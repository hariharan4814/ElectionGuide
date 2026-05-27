// Polling Information Finder Logic

// Sample data for states, districts, and constituencies
const areaData = {
  "Tamil Nadu": {
    districts: ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
    constituencies: ["Chennai Central", "Chennai South", "Chennai North", "Coimbatore Parliamentary", "Madurai Parliamentary"],
    officers: [
      { name: "Mr. K. Srinivasan", phone: "+91 94440 12345" },
      { name: "Ms. A. Radha", phone: "+91 94440 67890" }
    ],
    centers: [
      { name: "Chennai Corp. Primary School (Room 1)", address: "12, Gandhi Salai, T. Nagar, Chennai", distance: "0.4 km" },
      { name: "St. Joseph's Higher Secondary School", address: "45, Cathedral Road, Gopalapuram, Chennai", distance: "1.1 km" }
    ]
  },
  "Karnataka": {
    districts: ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"],
    constituencies: ["Bengaluru South", "Bengaluru North", "Bengaluru Central", "Mysuru Parliamentary", "Hubli-Dharwad Central"],
    officers: [
      { name: "Mr. R. K. Hegde", phone: "+91 98860 98765" },
      { name: "Mrs. Shwetha Gowda", phone: "+91 98860 12345" }
    ],
    centers: [
      { name: "Govt. Kannada Primary School (Room 2)", address: "5th Cross, Jayanagar 4th Block, Bengaluru", distance: "0.6 km" },
      { name: "R.V. College of Engineering (Block A)", address: "Mysore Road, Kengeri, Bengaluru", distance: "1.5 km" }
    ]
  },
  "Kerala": {
    districts: ["Trivandrum", "Kochi", "Kozhikode", "Thrissur", "Kannur"],
    constituencies: ["Thiruvananthapuram Central", "Ernakulam Parliamentary", "Kozhikode South", "Thrissur Parliamentary", "Kannur North"],
    officers: [
      { name: "Mr. Manoj Pillai", phone: "+91 94470 54321" },
      { name: "Mrs. Bindu Nair", phone: "+91 94470 98765" }
    ],
    centers: [
      { name: "Government Model High School (Room 1)", address: "Palayam, Thiruvananthapuram", distance: "0.5 km" },
      { name: "V.V. Teachers Training College", address: "M.G. Road, Ernakulam, Kochi", distance: "1.3 km" }
    ]
  },
  "Maharashtra": {
    districts: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
    constituencies: ["Mumbai South", "Mumbai North-Central", "Pune Parliamentary", "Nagpur Central", "Thane East"],
    officers: [
      { name: "Mr. Sanjay Deshmukh", phone: "+91 98200 45678" },
      { name: "Ms. Priya Kulkarni", phone: "+91 98200 12345" }
    ],
    centers: [
      { name: "Municipal School Hall (Room No. 3)", address: "Fort Ward, Near GPO, Mumbai", distance: "0.3 km" },
      { name: "Gokhale Institute of Politics & Economics", address: "Deccan Gymkhana, Pune", distance: "1.2 km" }
    ]
  },
  "Andhra Pradesh": {
    districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
    constituencies: ["Visakhapatnam Parliamentary", "Vijayawada West", "Guntur Parliamentary", "Tirupati Rural", "Nellore City"],
    officers: [
      { name: "Mr. Srinivasa Rao", phone: "+91 99890 12345" },
      { name: "Mrs. L. Lakshmi", phone: "+91 99890 67890" }
    ],
    centers: [
      { name: "Zilla Parishad High School", address: "Dwarka Nagar, Visakhapatnam", distance: "0.7 km" },
      { name: "Municipal Corporation Office Hall", address: "M.G. Road, Vijayawada", distance: "1.4 km" }
    ]
  },
  "Telangana": {
    districts: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    constituencies: ["Secunderabad Parliamentary", "Hyderabad South", "Warangal West", "Nizamabad Urban", "Karimnagar Town"],
    officers: [
      { name: "Mr. M. A. Reddy", phone: "+91 98480 98765" },
      { name: "Mrs. G. Sujatha", phone: "+91 98480 12345" }
    ],
    centers: [
      { name: "Government Junior College (Room 4)", address: "Koti, Hyderabad", distance: "0.5 km" },
      { name: "Nizam College Library Block", address: "Basheerbagh, Hyderabad", distance: "1.0 km" }
    ]
  },
  "Gujarat": {
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    constituencies: ["Ahmedabad West", "Surat City East", "Vadodara Parliamentary", "Rajkot Rural", "Gandhinagar Parliamentary"],
    officers: [
      { name: "Mr. Hasmukh Patel", phone: "+91 98980 12345" },
      { name: "Mrs. Jagruti Mehta", phone: "+91 98980 67890" }
    ],
    centers: [
      { name: "M.J. Library Meeting Hall", address: "Ashram Road, Ellisbridge, Ahmedabad", distance: "0.8 km" },
      { name: "Govt. Secondary School Block A", address: "Sector 16, Gandhinagar", distance: "1.6 km" }
    ]
  },
  "Rajasthan": {
    districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
    constituencies: ["Jaipur City", "Jodhpur Parliamentary", "Udaipur Rural", "Kota South", "Bikaner Town"],
    officers: [
      { name: "Mr. Ramesh Sharma", phone: "+91 94140 12345" },
      { name: "Mrs. Sunita Choudhary", phone: "+91 94140 67890" }
    ],
    centers: [
      { name: "Government Primary School Building", address: "C-Scheme, Near Statue Circle, Jaipur", distance: "0.4 km" },
      { name: "Maharaja College Hall Block B", address: "JLN Marg, Jaipur", distance: "1.1 km" }
    ]
  },
  "Delhi": {
    districts: ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
    constituencies: ["New Delhi Parliamentary", "Chandni Chowk", "South Delhi Parliamentary", "East Delhi Parliamentary", "West Delhi Parliamentary"],
    officers: [
      { name: "Mr. Rajeev Kumar", phone: "+91 98110 12345" },
      { name: "Mrs. Meena Sharma", phone: "+91 98110 67890" }
    ],
    centers: [
      { name: "Parliament House Reception Lounge (Room 12)", address: "Sansad Marg, New Delhi - 110001", distance: "0.2 km" },
      { name: "National Museum Lecture Hall", address: "Janpath, New Delhi - 110011", distance: "0.9 km" }
    ]
  }
};

// Generic fallback data
const genericFallback = {
  districts: ["Central District", "East District", "North District", "South District"],
  constituencies: ["Constituency Area 1", "Constituency Area 2", "Constituency Area 3"],
  officers: [
    { name: "Mr. A. K. Singh", phone: "+91 99990 12345" },
    { name: "Mrs. S. Roy", phone: "+91 99990 67890" }
  ],
  centers: [
    { name: "Government High School (Room 1)", address: "Main Bazaar Road, Central Town", distance: "0.7 km" },
    { name: "Panchayat Community Hall Block A", address: "Station Road, Near Tehsil Office", distance: "1.4 km" }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  setupStateDropdown();
  setupEventListeners();
  loadSavedProfileArea();
});

function setupStateDropdown() {
  const stateSelect = document.getElementById('state-select');
  if (!stateSelect) return;
  
  // Sort states alphabetically
  const states = Object.keys(areaData).sort();
  states.forEach(state => {
    const opt = document.createElement('option');
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });
}

function setupEventListeners() {
  const stateSelect = document.getElementById('state-select');
  if (stateSelect) {
    stateSelect.addEventListener('change', (e) => {
      updateDistrictAndConstituencyOptions(e.target.value);
    });
  }
}

function updateDistrictAndConstituencyOptions(stateName) {
  const districtSelect = document.getElementById('district-select');
  const constituencySelect = document.getElementById('constituency-select');
  
  if (!districtSelect || !constituencySelect) return;
  
  // Clear previous options
  districtSelect.innerHTML = '<option value="">-- Select District --</option>';
  constituencySelect.innerHTML = '<option value="">-- Select Constituency --</option>';
  
  if (!stateName) {
    districtSelect.disabled = true;
    const constituencySelectWrapper = document.getElementById('constituency-select');
    constituencySelect.disabled = true;
    return;
  }
  
  const data = areaData[stateName] || genericFallback;
  
  // Enable dropdowns
  districtSelect.disabled = false;
  constituencySelect.disabled = false;
  
  // Populate districts
  data.districts.forEach(dist => {
    const opt = document.createElement('option');
    opt.value = dist;
    opt.textContent = dist;
    districtSelect.appendChild(opt);
  });
  
  // Populate constituencies
  data.constituencies.forEach(constituency => {
    const opt = document.createElement('option');
    opt.value = constituency;
    opt.textContent = constituency;
    constituencySelect.appendChild(opt);
  });
}

function loadSavedProfileArea() {
  // Pre-fill fields if user profile has state details
  if (typeof storage !== 'undefined') {
    const profile = storage.getProfile();
    if (profile && profile.state) {
      const stateSelect = document.getElementById('state-select');
      if (stateSelect) {
        stateSelect.value = profile.state;
        updateDistrictAndConstituencyOptions(profile.state);
      }
    }
  }
}

function searchPollingInfo() {
  const pincodeEl = document.getElementById('pincode-input');
  const stateSelect = document.getElementById('state-select');
  const districtSelect = document.getElementById('district-select');
  const constituencySelect = document.getElementById('constituency-select');
  const resultsContainer = document.getElementById('finder-results-container');
  
  if (!pincodeEl || !stateSelect || !districtSelect || !constituencySelect || !resultsContainer) return;
  
  const pincode = pincodeEl.value.trim();
  const state = stateSelect.value;
  const district = districtSelect.value;
  const constituency = constituencySelect.value;
  
  // Validation
  if (!/^\d{6}$/.test(pincode)) {
    if (typeof showToast === 'function') {
      showToast("Please enter a valid 6-digit Pincode.", "error");
    } else {
      alert("Please enter a valid 6-digit Pincode.");
    }
    return;
  }
  
  if (!state || !district || !constituency) {
    if (typeof showToast === 'function') {
      showToast("Please select State, District, and Constituency.", "error");
    } else {
      alert("Please fill all fields.");
    }
    return;
  }
  
  if (typeof showToast === 'function') {
    showToast("Searching electoral registers...", "info");
  }
  
  // Render loading skeleton
  resultsContainer.innerHTML = `
    <div class="bg-white dark:bg-dark_card rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 space-y-6 animate-pulse">
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div class="space-y-4">
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    renderPollingResults(pincode, state, district, constituency);
    if (typeof showToast === 'function') {
      showToast("Polling information loaded!", "success");
    }
  }, 900);
}

function renderPollingResults(pincode, state, district, constituency) {
  const resultsContainer = document.getElementById('finder-results-container');
  if (!resultsContainer) return;
  
  const data = areaData[state] || genericFallback;
  const blo = data.officers[0] || { name: "Mr. Raj Kumar", phone: "+91 99990 12345" };
  const ero = data.officers[1] || { name: "Mrs. A. Sen", phone: "+91 99990 67890" };
  
  // Mocking current queue states
  const randomQueueNum = Math.floor(Math.random() * 3); // 0: low, 1: medium, 2: high
  const mockQueue = getQueueStatusConfig(randomQueueNum);
  
  // Generate HTML for Polling Centers list
  let centersHtml = "";
  data.centers.forEach((center, idx) => {
    const queueConfig = getQueueStatusConfig((randomQueueNum + idx) % 3);
    centersHtml += `
      <div class="bg-gray-50 dark:bg-dark_bg/40 p-4.5 rounded-2xl border border-gray-200/50 dark:border-gray-800/80 hover:border-saffron/40 transition-theme flex justify-between items-start gap-4">
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-black uppercase text-saffron bg-saffron-light dark:bg-saffron/10 px-2 py-0.5 rounded border border-saffron-light">Center #${idx + 1}</span>
            <span class="text-[10px] font-bold text-gray-500">${center.distance} away</span>
          </div>
          <h4 class="font-extrabold text-navy-eci dark:text-white text-sm mt-1">${center.name}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">${center.address}, Pincode: ${pincode}</p>
        </div>
        <div class="shrink-0 flex flex-col items-end">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide border ${queueConfig.badgeClass}">
            ${queueConfig.label}
          </span>
          <span class="text-[10px] text-gray-400 mt-1.5 font-bold">~${queueConfig.voters} in queue</span>
        </div>
      </div>
    `;
  });
  
  resultsContainer.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      <!-- Left Column: Nearby Polling Centers -->
      <div class="lg:col-span-2 bg-white dark:bg-dark_card rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center space-x-2 text-navy-eci dark:text-saffron">
            <i data-lucide="map-pins" class="w-5 h-5"></i>
            <h3 class="font-extrabold text-base">Nearby Polling Centers</h3>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-green_eci bg-green-100 dark:bg-green-950/20 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-900/30">
            ${constituency}
          </span>
        </div>
        
        <div class="space-y-4">
          ${centersHtml}
        </div>
        
        <!-- Accessibility widget -->
        <div class="pt-4 border-t border-gray-100 dark:border-gray-800 mt-2 space-y-3">
          <span class="text-xs font-black uppercase tracking-wider text-gray-400 block">Accessibility & Facilities</span>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              <i data-lucide="accessibility" class="w-3.5 h-3.5"></i>
              <span>Wheelchair Ramps</span>
            </span>
            <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
              <i data-lucide="droplet" class="w-3.5 h-3.5"></i>
              <span>Drinking Water</span>
            </span>
            <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/25 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
              <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
              <span>Senior Citizen Priority Queue</span>
            </span>
            <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/25 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
              <i data-lucide="heart" class="w-3.5 h-3.5"></i>
              <span>First Aid Desk</span>
            </span>
          </div>
        </div>
      </div>
      
      <!-- Right Column: Queue levels, Contacts & Docs -->
      <div class="space-y-6">
        
        <!-- Live Queue tracker -->
        <div class="bg-white dark:bg-dark_card rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-xs font-black uppercase tracking-wider text-gray-400">Queue Tracker</span>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 uppercase tracking-widest animate-pulse">
              Live mock
            </span>
          </div>
          
          <div id="live-queue-indicator-box" class="space-y-3.5">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-bold block text-navy-eci dark:text-white">Primary Booth Status</span>
                <span class="text-[11px] text-gray-400 font-medium">Estimated wait at Center #1</span>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border ${mockQueue.badgeClass}" id="live-queue-badge">
                ${mockQueue.label}
              </span>
            </div>
            
            <!-- Progress Bar -->
            <div class="relative w-full h-3 bg-gray-100 dark:bg-dark_bg rounded-full overflow-hidden border border-gray-200/20">
              <div id="live-queue-progress" class="h-full transition-all duration-500 ease-out rounded-full ${mockQueue.barClass}" style="width: ${mockQueue.percent}%"></div>
            </div>
            
            <div class="flex justify-between items-center text-xs">
              <span class="text-gray-500 font-medium"><i data-lucide="users" class="w-3.5 h-3.5 inline mr-1 text-gray-400"></i><strong id="live-voter-count">${mockQueue.voters}</strong> voters in queue</span>
              <button onclick="refreshQueueStatus()" class="text-saffron hover:text-saffron-hover font-black flex items-center space-x-1 hover:underline active:scale-95 transition-transform">
                <i data-lucide="rotate-cw" class="w-3.5 h-3.5" id="refresh-icon"></i>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Timings & Officer Contact -->
        <div class="bg-white dark:bg-dark_card rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 space-y-4.5">
          <div class="space-y-3">
            <span class="text-xs font-black uppercase tracking-wider text-gray-400 block">Booth Timings</span>
            <div class="flex items-center space-x-3 bg-green-50/50 dark:bg-green-950/10 p-3 rounded-2xl border border-green-100/30">
              <i data-lucide="clock" class="w-5 h-5 text-green_eci shrink-0"></i>
              <div>
                <span class="text-xs font-extrabold text-green_eci block">🟢 Open (7:00 AM - 6:00 PM)</span>
                <span class="text-[10px] text-gray-400 block">General Election Standard Hours</span>
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span class="text-xs font-black uppercase tracking-wider text-gray-400 block">Election Officers</span>
            <div class="space-y-3.5">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-navy-eci/10 dark:bg-dark_bg rounded-lg text-navy-eci dark:text-saffron shrink-0">
                  <i data-lucide="user" class="w-4 h-4"></i>
                </div>
                <div>
                  <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Booth Level Officer (BLO)</span>
                  <span class="text-xs font-black text-navy-eci dark:text-white block">${blo.name}</span>
                  <a href="tel:${blo.phone.replace(/\s+/g, '')}" class="text-[10px] text-saffron hover:underline font-bold">${blo.phone}</a>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-navy-eci/10 dark:bg-dark_bg rounded-lg text-navy-eci dark:text-saffron shrink-0">
                  <i data-lucide="shield-alert" class="w-4 h-4"></i>
                </div>
                <div>
                  <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Electoral Registration Officer</span>
                  <span class="text-xs font-black text-navy-eci dark:text-white block">${ero.name}</span>
                  <a href="tel:${ero.phone.replace(/\s+/g, '')}" class="text-[10px] text-saffron hover:underline font-bold">${ero.phone}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Required Documents -->
        <div class="bg-white dark:bg-dark_card rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 space-y-3.5">
          <span class="text-xs font-black uppercase tracking-wider text-gray-400 block">Required ID Documents</span>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">Present one of these valid photo IDs at the Polling Station to cast your vote:</p>
          <div class="space-y-2 text-xs">
            <div class="flex items-start space-x-2">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-green_eci shrink-0 mt-0.5"></i>
              <span class="font-bold text-navy-eci dark:text-gray-200 leading-snug">Voter ID Card (EPIC) - Preferred</span>
            </div>
            <div class="flex items-start space-x-2">
              <i data-lucide="check" class="w-4 h-4 text-gray-400 shrink-0 mt-0.5"></i>
              <span class="text-gray-600 dark:text-gray-300 leading-snug">Aadhaar Card</span>
            </div>
            <div class="flex items-start space-x-2">
              <i data-lucide="check" class="w-4 h-4 text-gray-400 shrink-0 mt-0.5"></i>
              <span class="text-gray-600 dark:text-gray-300 leading-snug">PAN Card / Indian Passport</span>
            </div>
            <div class="flex items-start space-x-2">
              <i data-lucide="check" class="w-4 h-4 text-gray-400 shrink-0 mt-0.5"></i>
              <span class="text-gray-600 dark:text-gray-300 leading-snug">Driving License / Bank Passbook</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function getQueueStatusConfig(index) {
  const statuses = [
    {
      label: "🟢 Low Waiting Time",
      percent: 20,
      voters: Math.floor(Math.random() * 10) + 5,
      barClass: "bg-green-500",
      badgeClass: "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30"
    },
    {
      label: "🟡 Medium Waiting Time",
      percent: 55,
      voters: Math.floor(Math.random() * 15) + 15,
      barClass: "bg-amber-500",
      badgeClass: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
    },
    {
      label: "🔴 High Waiting Time",
      percent: 90,
      voters: Math.floor(Math.random() * 20) + 30,
      barClass: "bg-rose-500",
      badgeClass: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30"
    }
  ];
  return statuses[index];
}

function refreshQueueStatus() {
  const refreshIcon = document.getElementById('refresh-icon');
  const countEl = document.getElementById('live-voter-count');
  const badgeEl = document.getElementById('live-queue-badge');
  const progressEl = document.getElementById('live-queue-progress');
  
  if (!refreshIcon || !countEl || !badgeEl || !progressEl) return;
  
  // Start spin animation
  refreshIcon.classList.add('animate-spin');
  
  setTimeout(() => {
    // Generate new random status
    const randomStatusIndex = Math.floor(Math.random() * 3);
    const newConfig = getQueueStatusConfig(randomStatusIndex);
    
    // Update DOM
    countEl.textContent = newConfig.voters;
    badgeEl.textContent = newConfig.label;
    badgeEl.className = `inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border ${newConfig.badgeClass}`;
    
    // Update progress bar
    progressEl.className = `h-full transition-all duration-500 ease-out rounded-full ${newConfig.barClass}`;
    progressEl.style.width = `${newConfig.percent}%`;
    
    // Stop spin animation
    refreshIcon.classList.remove('animate-spin');
    
    if (typeof showToast === 'function') {
      showToast("Queue status updated live!", "success");
    }
  }, 400);
}
