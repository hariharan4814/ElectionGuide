// Reminders Management Logic

let reminders = [];
const BASING_DATE = new Date("2026-05-27");

document.addEventListener('DOMContentLoaded', () => {
  reminders = storage.getReminders();
  checkForPrefills();
  renderReminders();
  checkDueReminders();
});

// Check if a page redirect has left a prefilled reminder
function checkForPrefills() {
  const prefillRaw = localStorage.getItem('reminderPrefill');
  if (prefillRaw) {
    try {
      const prefill = JSON.parse(prefillRaw);
      const textInput = document.getElementById('reminder-text');
      const dateInput = document.getElementById('reminder-date');
      
      if (textInput) textInput.value = prefill.text;
      if (dateInput) dateInput.value = prefill.date;
      
      // Clean up prefill key
      localStorage.removeItem('reminderPrefill');
      
      if (typeof showToast === 'function') {
        showToast("Timeline task prefilled! Review and click Add Reminder.", "info");
      }
    } catch (e) {
      localStorage.removeItem('reminderPrefill');
    }
  }
}

function renderReminders() {
  const listEl = document.getElementById('reminders-list');
  const countEl = document.getElementById('reminders-count');
  if (!listEl) return;
  
  listEl.innerHTML = '';
  
  if (countEl) {
    countEl.innerText = reminders.length;
  }

  if (reminders.length === 0) {
    listEl.innerHTML = `
      <div class="text-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400">
        <i data-lucide="bell-off" class="w-8 h-8 mx-auto mb-2 text-gray-300"></i>
        <p class="text-xs font-semibold">No active reminders registered.</p>
      </div>
    `;
    if (window.lucide) {
      window.lucide.createIcons();
    }
    return;
  }

  // Sort by date ascending
  const sorted = [...reminders].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(rem => {
    const dateObj = new Date(rem.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const item = document.createElement('div');
    item.className = "flex items-center justify-between p-3.5 bg-gray-50 dark:bg-dark_bg border border-gray-200/50 dark:border-gray-700/50 rounded-xl transition-all hover:border-saffron";
    item.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="p-2.5 rounded-lg bg-saffron-light/60 dark:bg-dark_card text-saffron shadow-sm">
          <i data-lucide="calendar" class="w-4.5 h-4.5"></i>
        </span>
        <div>
          <p class="text-xs font-bold text-gray-800 dark:text-white leading-tight">${rem.text}</p>
          <p class="text-[10px] text-gray-400 font-semibold mt-0.5">Alert Date: ${formattedDate}</p>
        </div>
      </div>
      <button onclick="deleteReminder(${rem.id})" class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all" aria-label="Delete Reminder">
        <i data-lucide="trash-2" class="w-4.5 h-4.5"></i>
      </button>
    `;
    
    listEl.appendChild(item);
  });
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function submitReminderForm(e) {
  e.preventDefault();
  
  const text = document.getElementById('reminder-text').value.trim();
  const date = document.getElementById('reminder-date').value;

  if (!text || !date) {
    if (typeof showToast === 'function') {
      showToast("Please enter both a label and a calendar date.", "error");
    }
    return;
  }

  // Request browser Notification permissions if available
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted' && typeof showToast === 'function') {
          showToast("Web Notifications authorized!", "success");
        }
      });
    }
  }

  addReminder(text, date);
  
  // Clear input
  document.getElementById('reminder-form').reset();
  if (typeof showToast === 'function') {
    showToast("Reminder registered successfully!", "success");
  }
}

function addReminder(text, date) {
  const id = Date.now();
  reminders.push({ id, text, date, notified: false });
  storage.saveReminders(reminders);
  renderReminders();
  
  // Re-check reminders in case they set it for today
  checkDueReminders();
}

function deleteReminder(id) {
  reminders = reminders.filter(r => r.id !== id);
  storage.saveReminders(reminders);
  renderReminders();
  if (typeof showToast === 'function') {
    showToast("Reminder removed.", "info");
  }
}

function checkDueReminders() {
  let updated = false;
  
  reminders.forEach(rem => {
    const remDate = new Date(rem.date);
    
    // Reset hours to compare calendar days
    const d1 = new Date(remDate.getFullYear(), remDate.getMonth(), remDate.getDate());
    const d2 = new Date(BASING_DATE.getFullYear(), BASING_DATE.getMonth(), BASING_DATE.getDate());
    
    if (d1 <= d2 && !rem.notified) {
      triggerNotification(rem.text);
      rem.notified = true;
      updated = true;
    }
  });

  if (updated) {
    storage.saveReminders(reminders);
  }
}

function triggerNotification(text) {
  // Try HTML5 browser notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification("ElectionGuide India Alert", {
      body: `Reminder: ${text}`,
      icon: 'eci-logo-white.svg'
    });
  }
  
  // Dynamic audio beep synthesis
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      audioCtx.close();
    }, 450);
  } catch (e) {}

  // Fallback visual in-app toast
  if (typeof showToast === 'function') {
    showToast(`DUE ALARM: ${text}`, 'warning');
  }
}
