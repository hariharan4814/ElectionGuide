// Upgraded EVM Simulator Logic with Dynamic Parties and Fast Actions

const candidates = [
  { id: 1, sl: "01", name: "Party 1", shortcut: "P1", symbol: "🌟", label: "तारा / Star" },
  { id: 2, sl: "02", name: "Party 2", shortcut: "P2", symbol: "🔔", label: "घंटी / Bell" },
  { id: 3, sl: "03", name: "Party 3", shortcut: "P3", symbol: "🪁", label: "पतंग / Kite" },
  { id: 4, sl: "04", name: "Party 4", shortcut: "P4", symbol: "🔑", label: "चाबी / Key" },
  { id: 5, sl: "05", name: "None of the Above", shortcut: "NOTA", symbol: "🚫", label: "नोटा / NOTA" }
];

let selectedCandidate = null;
let userToken = null;
let currentServing = 10;

document.addEventListener('DOMContentLoaded', () => {
  buildCandidatesList();
  resetEVM();
  initQueueSystem();
});

function buildCandidatesList() {
  const container = document.getElementById('evm-candidate-list');
  if (!container) return;
  container.innerHTML = '';
  
  candidates.forEach(c => {
    const row = document.createElement('div');
    row.id = `evm-row-${c.id}`;
    row.onclick = () => selectCandidate(c.id);
    row.className = "flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer transition-theme hover:bg-zinc-50 dark:hover:bg-zinc-800";
    
    const isNota = c.shortcut === "NOTA";
    const symbolHtml = isNota ? 
      `<span class="text-xl font-bold text-gray-500 border border-gray-400 rounded px-1 text-[11px]">NOTA</span>` :
      `<span class="text-2xl">${c.symbol}</span>`;
      
    row.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="w-7 h-7 bg-zinc-200 dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-600 rounded flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-300">${c.sl}</span>
        <div class="text-left">
          <span class="font-bold text-sm block dark:text-white">${isNota ? c.name : `${c.name} (${c.shortcut})`}</span>
          <span class="text-[10px] text-gray-400 font-medium block">${c.label}</span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        ${symbolHtml}
        <span id="evm-led-${c.id}" class="w-3.5 h-3.5 rounded-full bg-zinc-300 dark:bg-zinc-700 border border-zinc-400 dark:border-zinc-600 transition-colors duration-200"></span>
        <button class="w-9 h-6 bg-blue-600 active:bg-blue-700 border-2 border-blue-800 rounded shadow-md active:translate-y-[2px] transition-all" aria-label="Select ${c.name}"></button>
      </div>
    `;
    
    container.appendChild(row);
  });
}

// -------------------------------------------------------------
// Queue Token System (Disabled Wait Time for Direct Entry)
// -------------------------------------------------------------
function initQueueSystem() {
  userToken = null;
  currentServing = 10;
  
  updateQueueUI();
  lockEVM(true, "Please get a Queue Token to stand in line.");
}

function getQueueToken() {
  if (userToken !== null) return;
  
  // Instant Token matching current serving directly (No line delay)
  userToken = currentServing + 1;
  currentServing = userToken;
  
  if (typeof showToast === 'function') {
    showToast(`Token #${userToken} issued. Instantly unlocking compartment!`, "success");
  }
  
  updateQueueUI();
  unlockEVM();
  playTone(550, 0.1);
}

function updateQueueUI() {
  const tokenEl = document.getElementById('queue-user-token');
  const servingEl = document.getElementById('queue-current-serving');
  const statusTextEl = document.getElementById('queue-status-text');
  const getBtn = document.getElementById('queue-get-btn');
  
  if (servingEl) servingEl.innerText = currentServing;
  
  if (userToken === null) {
    if (tokenEl) tokenEl.innerText = "N/A";
    if (statusTextEl) statusTextEl.innerText = "Get a ticket to enter the voting booth queue.";
    if (getBtn) getBtn.disabled = false;
  } else {
    if (tokenEl) tokenEl.innerText = `#${userToken}`;
    if (getBtn) getBtn.disabled = true;
    if (statusTextEl) statusTextEl.innerText = "It's your turn! The EVM compartment is now unlocked.";
  }
}

function lockEVM(shouldLock, message) {
  const overlay = document.getElementById('evm-lock-overlay');
  const overlayText = document.getElementById('evm-lock-text');
  
  if (!overlay) return;
  
  if (shouldLock) {
    overlay.classList.remove('hidden');
    if (overlayText) overlayText.innerText = message;
  } else {
    overlay.classList.add('hidden');
  }
}

function unlockEVM() {
  lockEVM(false);
  
  // Play double ding
  playTone(800, 0.1);
  setTimeout(() => playTone(1000, 0.1), 150);
  
  if (typeof showToast === 'function') {
    showToast("EVM Unlocked! Please cast your vote.", "success");
  }
  
  // Add a green glowing border to the EVM box
  const evmBox = document.getElementById('evm-ballot-box');
  if (evmBox) {
    evmBox.classList.add('ring-4', 'ring-green_eci/30', 'border-green_eci');
    setTimeout(() => {
      evmBox.classList.remove('ring-4', 'ring-green_eci/30', 'border-green_eci');
    }, 4500);
  }
  
  // Speak prompt if SpeechSynthesis is supported
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(`Token number ${userToken}, please enter the voting booth.`);
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }
}

// -------------------------------------------------------------
// EVM Voter Core logic
// -------------------------------------------------------------
function selectCandidate(candidateIdx) {
  selectedCandidate = candidateIdx;
  
  // Reset all LED status lights
  candidates.forEach(c => {
    const row = document.getElementById(`evm-row-${c.id}`);
    const led = document.getElementById(`evm-led-${c.id}`);
    if (row) row.className = "flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer transition-theme hover:bg-zinc-50 dark:hover:bg-zinc-800";
    if (led) led.className = "w-3.5 h-3.5 rounded-full bg-zinc-300 dark:bg-zinc-700 border border-zinc-400 dark:border-zinc-600 transition-colors duration-200";
  });
  
  // Light up selected candidate LED
  const activeRow = document.getElementById(`evm-row-${candidateIdx}`);
  const activeLed = document.getElementById(`evm-led-${candidateIdx}`);
  
  if (activeRow) activeRow.className = "flex items-center justify-between p-3 border-2 border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg cursor-pointer transition-theme";
  if (activeLed) activeLed.className = "w-3.5 h-3.5 rounded-full bg-red-600 border border-red-800 shadow-glow_saffron transition-colors duration-200";
  
  // Short press sound
  playTone(550, 0.08);
}

function castVote() {
  if (selectedCandidate === null) {
    if (typeof showToast === 'function') {
      showToast("Please select a candidate on the EVM balloting unit first.", "error");
    }
    return;
  }
  
  const slip = document.getElementById('vvpat-paper-slip');
  if (slip && slip.classList.contains('vvpat-slip-animate')) return;
  
  // Play the authentic ECI 1-second long Beep sound
  playRealEVMBeep();
  
  // Retrieve selected candidate details
  const cand = candidates.find(c => c.id === selectedCandidate);
  if (!cand) return;
  
  let name = cand.shortcut === "NOTA" ? cand.name : `${cand.name} (${cand.shortcut})`;
  let symbol = cand.symbol;
  let sl = cand.sl;
  
  // Populate slip details
  document.getElementById('vvpat-slip-sl').innerText = sl;
  document.getElementById('vvpat-slip-name').innerText = name;
  document.getElementById('vvpat-slip-symbol').innerText = symbol;
  
  // Hide standby message
  document.getElementById('vvpat-default-text').classList.add('hidden');
  
  // Blinking VVPAT indicators
  const blinker = document.getElementById('vvpat-blinker-light');
  if (blinker) {
    blinker.classList.remove('bg-zinc-600');
    blinker.classList.add('bg-green-500', 'animate-blink');
  }
  
  // Slide slip down
  slip.classList.remove('hidden');
  slip.classList.add('vvpat-slip-animate');
  
  // Lock EVM buttons
  document.getElementById('evm-cast-btn').disabled = true;
  document.getElementById('evm-reset-btn').disabled = true;
  
  // Wait 2.5 seconds (accelerated for testing) for VVPAT slip display
  setTimeout(() => {
    // Drop slip
    slip.classList.add('hidden');
    slip.classList.remove('vvpat-slip-animate');
    document.getElementById('vvpat-default-text').classList.remove('hidden');
    
    // Stop blinking ECI VVPAT LED
    if (blinker) {
      blinker.classList.remove('bg-green-500', 'animate-blink');
      blinker.classList.add('bg-zinc-600');
    }
    
    // Run success animations
    triggerSuccessAnimation(name, symbol);
    
    // Auto-draw indelible finger ink
    drawFingerInkAnim();
    
    // Reset queue token
    userToken = null;
    updateQueueUI();
    
    // Lock again till next queue ticket
    lockEVM(true, "Please get a new Queue Token to vote again.");
  }, 2500);
}

function resetEVM() {
  selectedCandidate = null;
  
  candidates.forEach(c => {
    const row = document.getElementById(`evm-row-${c.id}`);
    const led = document.getElementById(`evm-led-${c.id}`);
    if (row) row.className = "flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer transition-theme hover:bg-zinc-50 dark:hover:bg-zinc-800";
    if (led) led.className = "w-3.5 h-3.5 rounded-full bg-zinc-300 dark:bg-zinc-700 border border-zinc-400 dark:border-zinc-600 transition-colors duration-200";
  });
  
  const slip = document.getElementById('vvpat-paper-slip');
  if (slip) {
    slip.classList.add('hidden');
    slip.classList.remove('vvpat-slip-animate');
  }
  
  const defaultText = document.getElementById('vvpat-default-text');
  if (defaultText) defaultText.classList.remove('hidden');
  
  document.getElementById('evm-cast-btn').disabled = false;
  document.getElementById('evm-reset-btn').disabled = false;
  
  const inkContainer = document.getElementById('ink-finger-container');
  if (inkContainer) inkContainer.classList.add('hidden');
  
  const inkMark = document.getElementById('ink-mark');
  if (inkMark) inkMark.classList.add('hidden');
}

// -------------------------------------------------------------
// Voice Speech & Audio Synthesizer
// -------------------------------------------------------------
function playTone(freq, duration) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    setTimeout(() => {
      osc.stop();
      audioCtx.close();
    }, duration * 1000);
  } catch (e) {}
}

function playRealEVMBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.9);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    setTimeout(() => {
      osc.stop();
      audioCtx.close();
    }, 1000);
  } catch (e) {}
}

// -------------------------------------------------------------
// Vote Success & Confetti Graphics
// -------------------------------------------------------------
function triggerSuccessAnimation(name, symbol) {
  const successOverlay = document.getElementById('vote-success-overlay');
  const detailsEl = document.getElementById('vote-success-details');
  
  if (!successOverlay) return;
  
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div class="text-4xl mb-2">${symbol}</div>
      <p class="font-extrabold text-navy-eci dark:text-saffron text-lg">${name}</p>
      <p class="text-xs text-gray-500 mt-1">EPIC Ballot Slip Verified.</p>
    `;
  }
  
  successOverlay.classList.remove('hidden', 'opacity-0');
  successOverlay.classList.add('flex', 'opacity-100');
  
  // Play double success tone
  playTone(880, 0.15);
  setTimeout(() => playTone(1100, 0.3), 180);
  
  createConfettiConf();

  setTimeout(() => {
    successOverlay.classList.remove('opacity-100', 'flex');
    successOverlay.classList.add('hidden', 'opacity-0');
  }, 4000);
}

function createConfettiConf() {
  const overlay = document.getElementById('vote-success-overlay');
  if (!overlay) return;
  
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = "absolute w-2 h-2 rounded-full pointer-events-none";
    p.style.backgroundColor = ['#FF9933', '#138808', '#000080', '#FFD700'][Math.floor(Math.random() * 4)];
    p.style.left = `${50 + (Math.random() - 0.5) * 80}%`;
    p.style.top = `${40 + (Math.random() - 0.5) * 40}%`;
    p.style.transform = `scale(${Math.random() * 1.5 + 0.5}) rotate(${Math.random() * 360}deg)`;
    
    p.animate([
      { transform: 'translateY(0) scale(1)', opacity: 1 },
      { transform: `translate(${(Math.random() - 0.5) * 150}px, ${Math.random() * 150 + 100}px) scale(0)`, opacity: 0 }
    ], {
      duration: Math.random() * 1500 + 1000,
      easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
      fill: 'forwards'
    });
    
    overlay.appendChild(p);
    setTimeout(() => { p.remove(); }, 2500);
  }
}

function drawFingerInkAnim() {
  const container = document.getElementById('ink-finger-container');
  const inkMark = document.getElementById('ink-mark');
  
  if (!container || !inkMark) return;
  
  container.classList.remove('hidden');
  inkMark.classList.remove('hidden');
  inkMark.classList.add('ink-draw-fill');
}
