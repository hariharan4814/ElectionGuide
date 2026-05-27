// Dashboard Page Logic & PDF Generator

let dashboardChart = null;
const BASE_DATE = new Date("2026-05-27");

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  
  // Listen for dark/light mode toggles to redraw charts
  window.addEventListener('themeChanged', () => {
    const profile = storage.getProfile();
    if (profile) {
      recalculateReadiness(profile);
    }
  });

  // Re-translate if language changes
  window.addEventListener('languageChanged', () => {
    renderDashboard();
  });
});

function renderDashboard() {
  const profile = storage.getProfile();
  const noProfileEl = document.getElementById('no-profile-container');
  const activeProfileEl = document.getElementById('active-profile-container');
  
  if (!profile) {
    noProfileEl.classList.remove('hidden');
    activeProfileEl.classList.add('hidden');
    return;
  }
  
  noProfileEl.classList.add('hidden');
  activeProfileEl.classList.remove('hidden');
  
  // Find state data
  const stateData = electionData.states.find(s => s.name === profile.state);
  if (!stateData) return;
  
  // 1. Eligibility status
  const badge = document.getElementById('db-eligibility-badge');
  const desc = document.getElementById('db-eligibility-desc');
  if (profile.age === 'under-18') {
    badge.className = 'mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/30';
    badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 animate-pulse"></span> Not Eligible`;
    desc.innerText = "You must be 18+ to register and vote in India.";
  } else {
    badge.className = 'mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900/30';
    badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5"></span> Eligible to Vote`;
    
    if (profile.voterId === 'have') {
      desc.innerText = "You have your Voter ID card. Make sure name is in electoral roll.";
    } else if (profile.voterId === 'applied') {
      desc.innerText = "Keep tracking your application. Verify name on ECI roll.";
    } else {
      desc.innerText = "Action required: Complete Form 6 to apply for Voter ID.";
    }
  }

  // 2. Next Election Date
  const electionDateEl = document.getElementById('db-election-date');
  const electionStateEl = document.getElementById('db-election-state');
  if (profile.age === 'under-18') {
    electionDateEl.innerText = "N/A";
    electionStateEl.innerText = `State cycle: ${stateData.name}`;
  } else {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const electionDate = new Date(stateData.nextElection);
    electionDateEl.innerText = electionDate.toLocaleDateString('en-US', dateOptions);
    electionStateEl.innerText = `Next Assembly cycle in ${stateData.name}`;
  }

  // 3. Form Required
  const formEl = document.getElementById('db-form');
  const formLinkEl = document.getElementById('db-form-link');
  if (profile.age === 'under-18') {
    formEl.innerText = "None";
    formLinkEl.classList.add('hidden');
  } else {
    formLinkEl.classList.remove('hidden');
    formLinkEl.href = stateData.formLink;
    if (profile.voterId === 'have') {
      formEl.innerText = "Form 8 (Corrections)";
    } else if (profile.voterId === 'applied') {
      formEl.innerText = "Track Status";
    } else {
      formEl.innerText = "Form 6 (New Voter)";
    }
  }

  // 4. Days Remaining
  const daysEl = document.getElementById('db-days');
  const daysDescEl = document.getElementById('db-days-desc');
  if (profile.age === 'under-18') {
    daysEl.innerText = "N/A";
    daysEl.className = "text-xl font-bold text-gray-400 mt-1";
    daysDescEl.innerText = "Not applicable due to age.";
  } else {
    const deadlineDate = new Date(stateData.registrationDeadline);
    const timeDiff = deadlineDate.getTime() - BASE_DATE.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysRemaining > 0) {
      daysEl.innerText = `${daysRemaining} Days`;
      daysEl.className = "text-2xl font-black text-green_eci dark:text-green-400 mt-1";
      daysDescEl.innerText = `Deadline: ${deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (daysRemaining === 0) {
      daysEl.innerText = `Today!`;
      daysEl.className = "text-2xl font-black text-saffron mt-1 animate-pulse";
      daysDescEl.innerText = `Register today!`;
    } else {
      daysEl.innerText = `Closed`;
      daysEl.className = "text-2xl font-black text-red-500 mt-1";
      daysDescEl.innerText = `Cycle ended. Please check updates.`;
    }
  }

  recalculateReadiness(profile);
}

function recalculateReadiness(profile) {
  let readiness = 0;
  
  if (profile.age !== 'under-18') {
    if (profile.voterId === 'have') {
      readiness += 40;
    } else if (profile.voterId === 'applied') {
      readiness += 20;
    } else {
      readiness += 10;
    }
    
    const completedPhases = storage.getCompletedPhases();
    readiness += (completedPhases.length * 10);
  }
  
  // Update Progress values
  document.getElementById('db-progress-bar-val').innerText = `${readiness}%`;
  document.getElementById('db-progress-bar-fill').style.width = `${readiness}%`;
  document.getElementById('db-chart-pct').innerText = `${readiness}%`;
  
  // Draw Chart.js Doughnut
  const ctx = document.getElementById('dbReadinessChart').getContext('2d');
  const isDark = document.documentElement.classList.contains('dark');
  const trackColor = isDark ? '#23304d' : '#e5e7eb';
  
  if (dashboardChart) {
    dashboardChart.destroy();
  }
  
  dashboardChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Readiness', 'Remaining'],
      datasets: [{
        data: [readiness, 100 - readiness],
        backgroundColor: ['#FF9933', trackColor],
        borderWidth: 0,
        borderRadius: 4
      }]
    },
    options: {
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function resetProfile() {
  if (confirm("Are you sure you want to clear your voter profile?")) {
    storage.clearProfile();
    renderDashboard();
    showToast("Profile reset successfully.", "info");
  }
}

// -------------------------------------------------------------
// PDF Generator Exporter
// -------------------------------------------------------------
async function downloadRoadmapAsPDF() {
  const profile = storage.getProfile();
  if (!profile) return;

  const btn = document.getElementById('download-pdf-btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = `<span class="inline-block animate-spin mr-1">⏳</span> Exporting PDF...`;
  btn.disabled = true;

  try {
    const { jsPDF } = window.jspdf;
    
    // Create temporary print container
    const pdfWrapper = document.createElement('div');
    pdfWrapper.style.position = 'absolute';
    pdfWrapper.style.left = '-9999px';
    pdfWrapper.style.top = '-9999px';
    pdfWrapper.style.width = '1024px';
    pdfWrapper.style.padding = '40px';
    pdfWrapper.style.background = '#FFF9F0'; // Warm light bg
    pdfWrapper.style.color = '#1F2937';
    pdfWrapper.className = 'font-sans';

    // Header
    const pdfHeader = document.createElement('div');
    pdfHeader.className = 'border-b-4 border-navy-eci pb-4 mb-6 flex justify-between items-center';
    pdfHeader.innerHTML = `
      <div>
        <h1 class="text-3xl font-extrabold text-[#000080]" style="color: #000080;">ELECTIONGUIDE INDIA</h1>
        <p class="text-xs text-gray-500 font-bold tracking-wider mt-1">Your Personalized Democracy Preparation Roadmap</p>
      </div>
      <div class="text-right text-xs text-gray-400 font-bold">
        <p>Date: ${BASE_DATE.toLocaleDateString()}</p>
        <p class="text-[10px] text-gray-400 mt-0.5">Independent Voter Guide</p>
      </div>
    `;
    pdfWrapper.appendChild(pdfHeader);

    // Profile Details Card
    const profileBox = document.createElement('div');
    profileBox.className = 'bg-white border border-gray-200 rounded-xl p-4 mb-6 grid grid-cols-3 gap-4 text-xs font-bold text-center';
    profileBox.innerHTML = `
      <div class="border-r border-gray-200">
        <span class="text-[10px] text-gray-400 block uppercase tracking-wider">Voter Age Range</span>
        <span class="text-navy-eci block mt-1">${profile.age === 'under-18' ? 'Under 18' : (profile.age === '18-25' ? '18-25' : '25+')}</span>
      </div>
      <div class="border-r border-gray-200">
        <span class="text-[10px] text-gray-400 block uppercase tracking-wider">State / UT Jurisdiction</span>
        <span class="text-navy-eci block mt-1">${profile.state}</span>
      </div>
      <div>
        <span class="text-[10px] text-gray-400 block uppercase tracking-wider">Voter ID Status</span>
        <span class="text-navy-eci block mt-1">${profile.voterId === 'have' ? 'Have Card' : (profile.voterId === 'applied' ? 'Applied' : 'No Card')}</span>
      </div>
    `;
    pdfWrapper.appendChild(profileBox);

    // Clone Dashboard Cards
    const dbSection = document.getElementById('active-profile-container');
    const dbClone = dbSection.cloneNode(true);
    
    // Hide controls, remove recheck buttons
    const recheckBtn = dbClone.querySelector('button');
    if (recheckBtn) recheckBtn.remove();
    
    // Handle canvas cloning
    const originalCanvas = document.getElementById('dbReadinessChart');
    const clonedCanvas = dbClone.querySelector('#dbReadinessChart');
    if (originalCanvas && clonedCanvas) {
      const img = document.createElement('img');
      img.src = originalCanvas.toDataURL('image/png');
      img.className = 'w-full max-h-[150px] object-contain mx-auto';
      clonedCanvas.parentNode.replaceChild(img, clonedCanvas);
    }
    pdfWrapper.appendChild(dbClone);

    // Spacing Divider
    const divider = document.createElement('div');
    divider.className = 'my-8 border-t border-gray-300';
    pdfWrapper.appendChild(divider);

    // Print-friendly Timeline Report
    const journeyTitle = document.createElement('h3');
    journeyTitle.className = 'text-xl font-bold text-navy-eci mb-4';
    journeyTitle.innerText = "Timeline: The Indian Election Journey (6 Phases)";
    pdfWrapper.appendChild(journeyTitle);

    const completedPhases = storage.getCompletedPhases();
    const timelineReport = document.createElement('div');
    timelineReport.className = 'grid grid-cols-2 gap-4';
    
    electionData.phases.forEach(phase => {
      const isComplete = completedPhases.includes(phase.id);
      const phaseCard = document.createElement('div');
      phaseCard.className = `p-4 rounded-xl border bg-white ${isComplete ? 'border-green-600' : 'border-gray-200'}`;
      phaseCard.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-black uppercase text-gray-400">Phase ${phase.id}</span>
          <span class="text-xs font-bold ${isComplete ? 'text-green-600' : 'text-gray-400'}">${isComplete ? '✓ Completed' : 'Pending'}</span>
        </div>
        <h4 class="font-bold text-sm text-gray-800">${phase.name}</h4>
        <p class="text-[10px] text-gray-400 font-semibold mt-1">Schedule: ${phase.dateRange}</p>
        <ul class="mt-2 space-y-1 text-[10px] text-gray-600 leading-tight">
          ${phase.actions.map(act => `<li>• ${act}</li>`).join('')}
        </ul>
      `;
      timelineReport.appendChild(phaseCard);
    });
    pdfWrapper.appendChild(timelineReport);

    // Disclaimer footer
    const pdfFooter = document.createElement('div');
    pdfFooter.className = 'border-t border-gray-300 mt-8 pt-4 text-[10px] text-gray-400 leading-relaxed text-center';
    pdfFooter.innerHTML = `
      <p><strong>Disclaimer:</strong> This is a custom educational roadmap compiled from mock and public schedules. Always check the official ECI electoral search at voters.eci.gov.in for binding information.</p>
    `;
    pdfWrapper.appendChild(pdfFooter);

    document.body.appendChild(pdfWrapper);

    // html2canvas render
    const canvas = await html2canvas(pdfWrapper, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    document.body.removeChild(pdfWrapper);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; 
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('ElectionGuide_My_Roadmap.pdf');
    showToast("PDF Roadmap downloaded successfully!", "success");

  } catch (err) {
    console.error("PDF compiling failed: ", err);
    showToast("Failed to compile PDF.", "error");
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}
