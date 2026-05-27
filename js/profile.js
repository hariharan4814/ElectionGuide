// Profile Management & Voter ID Card Mock Preview

document.addEventListener('DOMContentLoaded', () => {
  loadStateDropdown();
  loadSavedProfile();
  
  // Bind live change listeners to update mock Voter ID preview card
  const inputs = ['profile-name', 'profile-age', 'profile-voter-id', 'profile-state'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updateMockCardPreview);
      if (el.tagName === 'INPUT') {
        el.addEventListener('input', updateMockCardPreview);
      }
    }
  });
});

function loadStateDropdown() {
  const stateSelect = document.getElementById('profile-state');
  if (!stateSelect) return;
  
  // Sort states alphabetically
  const sortedStates = [...electionData.states].sort((a, b) => a.name.localeCompare(b.name));
  
  sortedStates.forEach(state => {
    const option = document.createElement('option');
    option.value = state.name;
    option.textContent = state.name;
    stateSelect.appendChild(option);
  });
}

function loadSavedProfile() {
  const profile = storage.getProfile();
  if (profile) {
    if (document.getElementById('profile-name')) document.getElementById('profile-name').value = profile.name || '';
    if (document.getElementById('profile-age')) document.getElementById('profile-age').value = profile.age || '';
    if (document.getElementById('profile-voter-id')) document.getElementById('profile-voter-id').value = profile.voterId || '';
    if (document.getElementById('profile-state')) document.getElementById('profile-state').value = profile.state || '';
    
    // Save EPIC card details
    if (!profile.epicNumber) {
      profile.epicNumber = generateEpicNumber();
      storage.saveProfile(profile);
    }
  }
  
  updateMockCardPreview();
}

function generateEpicNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let epic = '';
  // Generate 3 chars + 7 digits (standard ECI format)
  for (let i = 0; i < 3; i++) {
    epic += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < 7; i++) {
    epic += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return epic;
}

function updateMockCardPreview() {
  const nameInput = document.getElementById('profile-name');
  const ageSelect = document.getElementById('profile-age');
  const voterIdSelect = document.getElementById('profile-voter-id');
  const stateSelect = document.getElementById('profile-state');
  
  const name = nameInput ? nameInput.value.trim() : "";
  const age = ageSelect ? ageSelect.value : "";
  const voterId = voterIdSelect ? voterIdSelect.value : "";
  const state = stateSelect ? stateSelect.value : "";
  
  const profile = storage.getProfile();
  let epic = profile ? profile.epicNumber : "";
  if (!epic && voterId === 'have') {
    epic = generateEpicNumber();
  }
  
  // Target preview nodes
  const mockName = document.getElementById('mock-card-name');
  const mockAge = document.getElementById('mock-card-age');
  const mockState = document.getElementById('mock-card-state');
  const mockEpic = document.getElementById('mock-card-epic');
  const mockVoterStatus = document.getElementById('mock-card-status');
  
  if (mockName) mockName.innerText = name || "CITIZEN NAME";
  if (mockState) mockState.innerText = state || "STATE / JURISDICTION";
  
  if (mockAge) {
    if (age === 'under-18') mockAge.innerText = "Under 18 (Minor)";
    else if (age === '18-25') mockAge.innerText = "18-25 Years";
    else if (age === '25-plus') mockAge.innerText = "25+ Years";
    else mockAge.innerText = "SELECT AGE";
  }

  if (mockEpic) {
    if (voterId === 'have') {
      mockEpic.innerText = epic || "EPIC NO: ABC1234567";
    } else if (voterId === 'applied') {
      mockEpic.innerText = "EPIC NO: PENDING APPLICATION";
    } else {
      mockEpic.innerText = "EPIC NO: NOT REGISTERED";
    }
  }

  if (mockVoterStatus) {
    if (age === 'under-18') {
      mockVoterStatus.className = "text-[10px] font-black uppercase bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded border border-red-200";
      mockVoterStatus.innerText = "Not Eligible";
    } else if (voterId === 'have') {
      mockVoterStatus.className = "text-[10px] font-black uppercase bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded border border-green-200";
      mockVoterStatus.innerText = "Active Voter";
    } else if (voterId === 'applied') {
      mockVoterStatus.className = "text-[10px] font-black uppercase bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded border border-yellow-200";
      mockVoterStatus.innerText = "Applied / Pending";
    } else {
      mockVoterStatus.className = "text-[10px] font-black uppercase bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 px-2 py-0.5 rounded border border-gray-200";
      mockVoterStatus.innerText = "Needs Action";
    }
  }
}

function submitProfileForm(e) {
  e.preventDefault();
  
  const name = document.getElementById('profile-name').value.trim();
  const age = document.getElementById('profile-age').value;
  const voterId = document.getElementById('profile-voter-id').value;
  const state = document.getElementById('profile-state').value;
  
  if (!name || !age || !voterId || !state) {
    if (typeof showToast === 'function') {
      showToast("Please fill all details to complete profile.", "error");
    }
    return;
  }
  
  const currentProfile = storage.getProfile() || {};
  const epicNumber = currentProfile.epicNumber || generateEpicNumber();
  
  const newProfile = { name, age, voterId, state, epicNumber };
  storage.saveProfile(newProfile);
  
  if (typeof showToast === 'function') {
    showToast("Voter profile saved! Opening roadmap...", "success");
  }
  
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
}
