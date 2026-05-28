// Timeline Phases Management Logic with Vertical Scroll Inertia

// Native scroll-snap integration variables
let completedPhases = [];

document.addEventListener('DOMContentLoaded', () => {
  completedPhases = storage.getCompletedPhases();
  buildTimeline();
  setupScrollHandlers();
  setTimeout(updateScrollProgress, 100);
  
  // Translate elements once on load
  const activeLang = storage.getLanguage();
  translateTimelineContent(activeLang);
  
  window.addEventListener('languageChanged', (e) => {
    translateTimelineContent(e.detail);
  });

  // Check for query param phase deep link
  const urlParams = new URLSearchParams(window.location.search);
  const phaseParam = urlParams.get('phase');
  if (phaseParam) {
    const phaseId = parseInt(phaseParam, 10);
    if (phaseId >= 1 && phaseId <= 6) {
      setTimeout(() => {
        scrollToStep(phaseId);
      }, 500);
    }
  }
});

function buildTimeline() {
  const container = document.getElementById('timeline-track');
  if (!container) return;
  container.innerHTML = '';

  // 1. Add Conduit line
  const conduit = document.createElement('div');
  conduit.className = 'glass-conduit';
  conduit.innerHTML = `
    <div id="progressLine" class="comet-fill">
      <div class="comet-spark"></div>
    </div>
  `;
  container.appendChild(conduit);

  // 2. Add Step 0 (System Initialized / Welcome)
  const step0 = document.createElement('div');
  step0.className = 'step-unit timeline-item';
  step0.id = 'step-0';
  step0.innerHTML = `
    <div class="node-wrapper"><div class="glass-sphere"></div></div>
    <div class="glass-card">
      <div class="bezel-shroud">
        <div class="content text-center items-center justify-center">
          <div class="status-label mb-2" data-i18n="timeline_initialized">SYSTEM INITIALIZED</div>
          <h3 data-i18n="timeline_welcome_title">Welcome, Citizen Voter!</h3>
          <p data-i18n="timeline_welcome_desc" class="text-xs max-w-xs mx-auto leading-relaxed mt-2 text-gray-500 dark:text-gray-400">
            This high-performance interactive timeline guides you through every step of the election process. Scroll down or use the button below to start your democratic journey.
          </p>
          <button onclick="scrollToStep(1)" class="mt-4 px-6 py-2.5 bg-saffron hover:bg-saffron-hover text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-saffron/20 active:scale-95 transition-theme flex items-center space-x-2">
            <span data-i18n="timeline_start_btn">Begin Journey</span>
            <i data-lucide="chevron-down" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  container.appendChild(step0);

  // 3. Add Steps 1-6 (Phases)
  electionData.phases.forEach((phase) => {
    const isComplete = completedPhases.includes(phase.id);
    const step = document.createElement('div');
    step.className = 'step-unit timeline-item';
    step.id = `step-${phase.id}`;
    
    // Generate list items for actions
    const actionsHtml = phase.actions.map((action, idx) => {
      const actionKey = `action_${phase.id}_${idx}`;
      const actionCompleted = localStorage.getItem(actionKey) === 'true';
      return `
        <label class="flex items-start space-x-3 bg-gray-50 dark:bg-dark_bg/50 border border-gray-100 dark:border-gray-800/80 p-2 sm:p-3 rounded-xl cursor-pointer hover:border-saffron/30 dark:hover:border-saffron/20 transition-all select-none">
          <input type="checkbox" 
                 class="action-checkbox mt-0.5 w-4.5 h-4.5 text-saffron border-gray-300 dark:border-gray-700 rounded focus:ring-saffron bg-white dark:bg-dark_card" 
                 data-phase="${phase.id}" 
                 data-index="${idx}"
                 ${actionCompleted ? 'checked' : ''}
                 onchange="onActionToggle(this, ${phase.id}, ${idx})" />
          <span class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium transition-all ${actionCompleted ? 'line-through opacity-50' : ''}">${action}</span>
        </label>
      `;
    }).join('');

    step.innerHTML = `
      <div class="node-wrapper"><div class="glass-sphere"></div></div>
      <div class="glass-card">
        <div class="bezel-shroud">
          <div class="content">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-saffron/10 text-saffron dark:bg-saffron/20 tracking-wider">PHASE 0${phase.id}</span>
              <span id="phase-status-${phase.id}" class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ${isComplete ? 'text-green-600 dark:text-green-400' : ''}">
                ${isComplete ? 'Completed' : 'Pending'}
              </span>
            </div>
            
            <div class="flex items-center space-x-3 my-1">
              <span class="p-2 bg-gray-100 dark:bg-dark_bg/80 border border-gray-200/50 dark:border-gray-800 text-saffron rounded-lg shadow-sm">
                <i data-lucide="${phase.icon}" class="w-4.5 h-4.5"></i>
              </span>
              <h3>${phase.name}</h3>
            </div>
            
            <p class="text-xs font-semibold text-saffron/90 dark:text-saffron/80">Schedule: ${phase.dateRange}</p>
            
            <div class="flex flex-col gap-2 mt-2 max-h-[22vh] sm:max-h-[30vh] overflow-y-auto pr-1 custom-scrollbar">
              ${actionsHtml}
            </div>

            <div class="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div class="flex items-center space-x-2">
                <button onclick="setReminderShortcut(${phase.id})" class="px-2.5 py-1.5 border border-saffron/30 hover:border-saffron text-saffron hover:bg-saffron hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center space-x-1 shadow-sm active:scale-95">
                  <i data-lucide="bell" class="w-3 h-3"></i>
                  <span data-i18n="timeline_remind_btn">Reminder</span>
                </button>
                
                <label class="flex items-center space-x-1.5 bg-gray-50 dark:bg-dark_bg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 rounded-xl cursor-pointer select-none active:scale-95 transition-all">
                  <input type="checkbox" 
                         id="phase-complete-checkbox-${phase.id}" 
                         onchange="togglePhaseComplete(${phase.id})" 
                         ${isComplete ? 'checked' : ''} 
                         class="w-3.5 h-3.5 text-green_eci border-gray-300 rounded focus:ring-green-500 bg-white dark:bg-dark_card" />
                  <span class="text-[10px] font-bold text-gray-700 dark:text-gray-300" data-i18n="timeline_mark_complete">Complete</span>
                </label>
              </div>

              <button onclick="scrollToStep(${phase.id + 1})" class="px-3.5 py-1.5 bg-saffron hover:bg-saffron-hover text-white text-[10px] font-bold rounded-xl shadow-md hover:shadow-saffron/20 active:scale-95 transition-theme flex items-center space-x-1">
                <span data-i18n="timeline_next_btn">Next Step</span>
                <i data-lucide="arrow-down" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(step);
  });

  // 4. Add Step 7 (spacer/Congratulations)
  const step7 = document.createElement('div');
  step7.className = 'step-unit timeline-item';
  step7.id = 'step-7';
  
  const currentReadiness = calculateReadiness();
  
  step7.innerHTML = `
    <div class="node-wrapper"><div class="glass-sphere"></div></div>
    <div class="glass-card">
      <div class="bezel-shroud">
        <div class="content text-center items-center justify-center">
          <div class="status-label mb-2 text-green-600 dark:text-green-400" data-i18n="timeline_completed">DESTINATION REACHED</div>
          <h3 data-i18n="timeline_complete_title">You are Vote Ready!</h3>
          <p data-i18n="timeline_complete_desc" class="text-xs max-w-xs mx-auto leading-relaxed mt-2 text-gray-500 dark:text-gray-400">
            You have traveled through the entire voting preparation. Your citizen readiness index is at <strong class="text-saffron font-extrabold text-sm" id="readiness-summary-val">${currentReadiness}%</strong>. Make sure your reminders are active!
          </p>
          <div class="flex flex-col sm:flex-row gap-3 mt-5 w-full">
            <button onclick="scrollToStep(0)" class="w-full px-4 py-2.5 border border-saffron hover:bg-saffron text-saffron hover:text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1">
              <i data-lucide="chevrons-up" class="w-4 h-4"></i>
              <span data-i18n="timeline_top_btn">Back to Top</span>
            </button>
            <a href="dashboard.html" class="w-full px-4 py-2.5 bg-saffron hover:bg-saffron-hover text-white text-xs font-bold rounded-xl text-center shadow-lg hover:shadow-saffron/20 active:scale-95 transition-theme flex items-center justify-center space-x-1">
              <span data-i18n="timeline_dashboard_btn">My Roadmap</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(step7);

  // Add spacing unit to let page scroll comfortably past footer
  const spacer = document.createElement('div');
  spacer.style.height = '10vh';
  container.appendChild(spacer);

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function calculateReadiness() {
  const profile = storage.getProfile() || {};
  let score = 0;
  
  // 30% from basic details
  if (profile.registered) score += 30;
  if (profile.constituency) score += 10;
  
  // 60% from phases
  const completed = storage.getCompletedPhases();
  score += completed.length * 10;
  
  return score;
}

function onActionToggle(checkbox, phaseId, actionIdx) {
  const actionKey = `action_${phaseId}_${actionIdx}`;
  localStorage.setItem(actionKey, checkbox.checked);
  
  // Line-through visual text toggle
  const labelText = checkbox.nextElementSibling;
  if (labelText) {
    if (checkbox.checked) {
      labelText.classList.add('line-through', 'opacity-50');
    } else {
      labelText.classList.remove('line-through', 'opacity-50');
    }
  }

  // Check if all actions in this phase are complete
  const phase = electionData.phases.find(p => p.id === phaseId);
  if (phase) {
    const checkboxes = document.querySelectorAll(`input.action-checkbox[data-phase="${phaseId}"]`);
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const phaseCb = document.getElementById(`phase-complete-checkbox-${phaseId}`);
    if (phaseCb && phaseCb.checked !== allChecked) {
      phaseCb.checked = allChecked;
      togglePhaseComplete(phaseId, false); // Don't trigger alert inside if we are just syncing
    }
  }
}

function togglePhaseComplete(phaseId, showNotification = true) {
  const checkbox = document.getElementById(`phase-complete-checkbox-${phaseId}`);
  if (!checkbox) return;
  const checked = checkbox.checked;
  
  if (checked) {
    if (!completedPhases.includes(phaseId)) {
      completedPhases.push(phaseId);
      if (showNotification && typeof showToast === 'function') {
        showToast(`Phase ${phaseId} marked as completed! (+10% Readiness)`, "success");
      }
    }
  } else {
    completedPhases = completedPhases.filter(id => id !== phaseId);
    if (showNotification && typeof showToast === 'function') {
      showToast(`Phase ${phaseId} marked as pending.`, "info");
    }
  }
  
  storage.saveCompletedPhases(completedPhases);
  
  // Update UI Status Labels
  const statusEl = document.getElementById(`phase-status-${phaseId}`);
  if (statusEl) {
    const lang = storage.getLanguage();
    const isHi = lang === 'hi';
    const completeText = isHi ? "पूरा हो गया" : "Completed";
    const pendingText = isHi ? "लंबित" : "Pending";
    
    if (checked) {
      statusEl.innerText = completeText;
      statusEl.classList.add('text-green-600', 'dark:text-green-400');
    } else {
      statusEl.innerText = pendingText;
      statusEl.classList.remove('text-green-600', 'dark:text-green-400');
    }
  }

  // Check all action checkboxes of this phase if marked complete
  const actionsCheckboxes = document.querySelectorAll(`input.action-checkbox[data-phase="${phaseId}"]`);
  actionsCheckboxes.forEach((cb, idx) => {
    if (cb.checked !== checked) {
      cb.checked = checked;
      const actionKey = `action_${phaseId}_${idx}`;
      localStorage.setItem(actionKey, checked);
      const labelText = cb.nextElementSibling;
      if (labelText) {
        if (checked) {
          labelText.classList.add('line-through', 'opacity-50');
        } else {
          labelText.classList.remove('line-through', 'opacity-50');
        }
      }
    }
  });

  // Update final page readiness percentage
  const readyVal = document.getElementById('readiness-summary-val');
  if (readyVal) {
    readyVal.innerText = `${calculateReadiness()}%`;
  }
}

function setReminderShortcut(phaseId) {
  const phase = electionData.phases.find(p => p.id === phaseId);
  if (!phase) return;
  
  const reminderPrefill = {
    text: `Prepare for ${phase.name} phase`,
    date: "2026-05-27"
  };
  localStorage.setItem('reminderPrefill', JSON.stringify(reminderPrefill));
  
  if (typeof showToast === 'function') {
    showToast("Redirecting to Reminders to confirm prefilled alert...", "info");
  }
  
  setTimeout(() => {
    window.location.href = "reminders.html";
  }, 800);
}

function scrollToStep(stepIndex) {
  const target = document.getElementById(`step-${stepIndex}`);
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function setupScrollHandlers() {
  const wrapper = document.getElementById('scroll-wrapper');
  if (!wrapper) return;
  wrapper.addEventListener('scroll', () => {
    updateScrollProgress();
  }, { passive: true });
  
  window.addEventListener('resize', () => {
    updateScrollProgress();
  });
}

function updateScrollProgress() {
  const wrapper = document.getElementById('scroll-wrapper');
  const items = document.querySelectorAll('.timeline-item');
  const progressLine = document.getElementById('progressLine');
  
  if (!wrapper || items.length === 0) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const wrapperCenter = wrapperRect.top + wrapperRect.height / 2;
  
  let activeIndex = 0;
  let minDistance = Infinity;
  
  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - wrapperCenter);
    
    if (distance < minDistance) {
      minDistance = distance;
      activeIndex = index;
    }
  });
  
  items.forEach((item, index) => {
    if (index === activeIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const totalSteps = items.length;
  const maxScroll = (totalSteps - 1) * stepHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  if (progressLine) {
    progressLine.style.height = `${Math.max(0, Math.min(100, progress))}%`;
  }
}

// Translations support custom page-specific words
function translateTimelineContent(lang) {
  const trans = electionData.translations[lang] || electionData.translations.en;
  
  // Add some page specific keywords to translate
  const localDict = {
    en: {
      timeline_initialized: "SYSTEM INITIALIZED",
      timeline_welcome_title: "Welcome, Citizen Voter!",
      timeline_welcome_desc: "This high-performance interactive timeline guides you through every step of the election process. Scroll down or use the button below to start your democratic journey.",
      timeline_start_btn: "Begin Journey",
      timeline_remind_btn: "Reminder",
      timeline_mark_complete: "Complete",
      timeline_completed: "DESTINATION REACHED",
      timeline_complete_title: "You are Vote Ready!",
      timeline_complete_desc: "You have traveled through the entire voting preparation. Your citizen readiness index is at",
      timeline_desc_suffix: ". Make sure your reminders are active!",
      timeline_top_btn: "Back to Top",
      timeline_dashboard_btn: "My Roadmap",
      status_completed: "Completed",
      status_pending: "Pending",
      timeline_next_btn: "Next Step"
    },
    hi: {
      timeline_initialized: "सिस्टम प्रारंभ",
      timeline_welcome_title: "स्वागत है, नागरिक मतदाता!",
      timeline_welcome_desc: "यह उच्च प्रदर्शन वाली इंटरैक्टिव समयरेखा आपको चुनाव प्रक्रिया के प्रत्येक चरण में मार्गदर्शन करती है। अपनी लोकतांत्रिक यात्रा शुरू करने के लिए नीचे स्क्रॉल करें या बटन का उपयोग करें।",
      timeline_start_btn: "यात्रा शुरू करें",
      timeline_remind_btn: "स्मरणपत्र",
      timeline_mark_complete: "पूरा",
      timeline_completed: "गंतव्य तक पहुंचे",
      timeline_complete_title: "आप मतदान के लिए तैयार हैं!",
      timeline_complete_desc: "आपने मतदान की पूरी तैयारी कर ली है। आपकी नागरिक तत्परता सूचकांक",
      timeline_desc_suffix: " पर है। सुनिश्चित करें कि आपके स्मरणपत्र सक्रिय हैं!",
      timeline_top_btn: "ऊपर वापस जाएं",
      timeline_dashboard_btn: "मेरा रोडमैप",
      status_completed: "पूरा हो गया",
      status_pending: "लंबित",
      timeline_next_btn: "अगला चरण"
    },
    ta: {
      timeline_initialized: "இயந்திரம் தொடங்கப்பட்டது",
      timeline_welcome_title: "வரவேற்கிறோம், வாக்காளரே!",
      timeline_welcome_desc: "இந்த அதிநவீன காலவரிசை தேர்தல் செயல்முறையின் ஒவ்வொரு படியிலும் உங்களை வழிநடத்துகிறது. உங்கள் ஜனநாயக பயணத்தை தொடங்க கீழே உருட்டவும் அல்லது பொத்தானை பயன்படுத்தவும்.",
      timeline_start_btn: "பயணத்தை தொடங்கு",
      timeline_remind_btn: "நினைவூட்டல்",
      timeline_mark_complete: "முழுமை",
      timeline_completed: "இலக்கை அடைந்தது",
      timeline_complete_title: "நீங்கள் வாக்களிக்க தயார்!",
      timeline_complete_desc: "வாக்களிப்பதற்கான முழு தயாரிப்பையும் கடந்துவிட்டீர்கள். உங்கள் வாக்காளர் தயார்நிலை குறியீடு",
      timeline_desc_suffix: " உள்ளது. நினைவೂட்டல்கள் இயங்குவதை உறுதிசெய்யவும்!",
      timeline_top_btn: "மேலே செல்",
      timeline_dashboard_btn: "என் வரைபடம்",
      status_completed: "முடிந்தது",
      status_pending: "நிலುவையில் உள்ளது",
      timeline_next_btn: "அடுத்த படி"
    },
    ml: {
      timeline_initialized: "സിസ്റ്റം ആരംഭിച്ചു",
      timeline_welcome_title: "സ്വാഗതം, വോട്ടർ സുഹൃത്തേ!",
      timeline_welcome_desc: "ഈ അത്യാധുനിക ടൈംലൈൻ തിരഞ്ഞെടുപ്പ് പ്രക്രിയയുടെ ഓരോ ഘട്ടത്തിലും നിങ്ങളെ നയിക്കുന്നു. നിങ്ങളുടെ ജനാധിപത്യ യാത്ര ആരംഭിക്കാൻ താഴേക്ക് സ്ക്രോൾ ചെയ്യുക അല്ലെങ്കിൽ ബട്ടൺ ഉപയോഗിക്കുക.",
      timeline_start_btn: "യാത്ര ആരംഭിക്കുക",
      timeline_remind_btn: "ഓർമ്മപ്പെടുത്തൽ",
      timeline_mark_complete: "പൂർത്തിയായി",
      timeline_completed: "ലക്ഷ്യത്തിലെത്തി",
      timeline_complete_title: "നിങ്ങൾ വോട്ട് ചെയ്യാൻ തയ്യാറാണ്!",
      timeline_complete_desc: "നിങ്ങൾ എല്ലാ തയ്യാറെടുപ്പുകളും പൂർത്തിയാക്കി. നിങ്ങളുടെ സന്നദ്ധതാ സൂചിക",
      timeline_desc_suffix: " ലാണ്. അലാറങ്ങൾ സജീവമാണെന്ന് ഉറപ്പാക്കുക!",
      timeline_top_btn: "മുകളിലേക്ക്",
      timeline_dashboard_btn: "എന്റെ റോഡ്മാപ്പ്",
      status_completed: "പൂർത്തിയായി",
      status_pending: "ബാക്കിനിൽക്കുന്നു",
      timeline_next_btn: "അടുത്ത ഘട്ടം"
    },
    kn: {
      timeline_initialized: "ಸಿಸ್ಟಮ್ ಪ್ರಾರಂಭಗೊಂಡಿದೆ",
      timeline_welcome_title: "ಸ್ವಾಗತ, ನಾಗರಿಕ ಮತದಾರರೇ!",
      timeline_welcome_desc: "ಈ ಸಂವಾದಾತ್ಮಕ ಸಮಯರೇಖೆಯು ಚುನಾವಣಾ ಪ್ರಕ್ರಿಯೆಯ ಪ್ರತಿಯೊಂದು ಹಂತದಲ್ಲೂ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ. ನಿಮ್ಮ ಪ್ರಜಾಪ್ರಭುತ್ವದ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ಬಟನ್ ಬಳಸಿ.",
      timeline_start_btn: "ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ",
      timeline_remind_btn: "ಜ್ಞಾಪನೆ",
      timeline_mark_complete: "ಕಂಪ್ಲೀಟ್",
      timeline_completed: "ಗುರಿ ತಲುಪಲಾಗಿದೆ",
      timeline_complete_title: "ನೀವು ಮತ ಚಲಾಯಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಿ!",
      timeline_complete_desc: "ನೀವು ಮತದಾನದ ಸಂಪೂರ್ಣ ಸಿದ್ಧತೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ. ನಿಮ್ಮ ನಾಗರಿಕ ಸಿದ್ಧತೆಯ ಸೂಚ್ಯಂಕವು",
      timeline_desc_suffix: " ನಲ್ಲಿದೆ. ನಿಮ್ಮ ಜ್ಞಾಪನೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ!",
      timeline_top_btn: "ಮೇಲಕ್ಕೆ ಹಿಂತಿರುಗಿ",
      timeline_dashboard_btn: "ನನ್ನ ರೋಡ್‌ಮ್ಯಾಪ್",
      status_completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
      status_pending: "ಬಾಕಿ ಉಳಿದಿದೆ",
      timeline_next_btn: "ಮುಂದಿನ ಹಂತ"
    }
  };

  const words = localDict[lang] || localDict.en;
  
  // Update elements that have matching IDs or custom data attributes
  const sysInit = document.querySelector('[data-i18n="timeline_initialized"]');
  if (sysInit) sysInit.innerText = words.timeline_initialized;

  const welcomeTitle = document.querySelector('[data-i18n="timeline_welcome_title"]');
  if (welcomeTitle) welcomeTitle.innerText = words.timeline_welcome_title;

  const welcomeDesc = document.querySelector('[data-i18n="timeline_welcome_desc"]');
  if (welcomeDesc) welcomeDesc.innerText = words.timeline_welcome_desc;

  const startBtn = document.querySelector('[data-i18n="timeline_start_btn"]');
  if (startBtn) startBtn.innerText = words.timeline_start_btn;

  const completedBadge = document.querySelector('[data-i18n="timeline_completed"]');
  if (completedBadge) completedBadge.innerText = words.timeline_completed;

  const completeTitle = document.querySelector('[data-i18n="timeline_complete_title"]');
  if (completeTitle) completeTitle.innerText = words.timeline_complete_title;

  const completeDesc = document.querySelector('[data-i18n="timeline_complete_desc"]');
  if (completeDesc) {
    const readiness = calculateReadiness();
    completeDesc.innerHTML = `${words.timeline_complete_desc} <strong class="text-saffron font-extrabold text-sm" id="readiness-summary-val">${readiness}%</strong>${words.timeline_desc_suffix}`;
  }

  const topBtn = document.querySelector('[data-i18n="timeline_top_btn"]');
  if (topBtn) topBtn.innerText = words.timeline_top_btn;

  const dbBtn = document.querySelector('[data-i18n="timeline_dashboard_btn"]');
  if (dbBtn) dbBtn.innerText = words.timeline_dashboard_btn;

  const remindBtns = document.querySelectorAll('[data-i18n="timeline_remind_btn"]');
  remindBtns.forEach(btn => btn.innerText = words.timeline_remind_btn);

  const markCompleteBtns = document.querySelectorAll('[data-i18n="timeline_mark_complete"]');
  markCompleteBtns.forEach(btn => btn.innerText = words.timeline_mark_complete);

  const nextBtnSpans = document.querySelectorAll('[data-i18n="timeline_next_btn"]');
  nextBtnSpans.forEach(span => span.innerText = words.timeline_next_btn);

  // Translate Phase pending/complete tags
  electionData.phases.forEach(phase => {
    const statusLabel = document.getElementById(`phase-status-${phase.id}`);
    if (statusLabel) {
      const isComplete = completedPhases.includes(phase.id);
      statusLabel.innerText = isComplete ? words.status_completed : words.status_pending;
    }
  });
}
