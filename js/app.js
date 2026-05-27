// Landing Page Application Logic & Chart.js Config

let charts = {};

document.addEventListener('DOMContentLoaded', () => {
  initStatsCharts();
  
  // Re-render charts when theme changes to ensure readable text labels
  window.addEventListener('themeChanged', () => {
    initStatsCharts();
  });
  
  // Re-translate if language changes
  window.addEventListener('languageChanged', (e) => {
    // Optionally update chart titles/legends if they are language-dependent
    initStatsCharts();
  });
});

function initStatsCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#eee' : '#1F2937';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  
  const saffron = '#FF9933';
  const green = '#138808';
  const navy = '#000080';
  
  // 1. Voter Turnout by State Chart
  const turnoutCtx = document.getElementById('turnoutStateChart');
  if (turnoutCtx) {
    if (charts.turnout) charts.turnout.destroy();
    
    const statesData = electionData.stats.turnoutByState;
    charts.turnout = new Chart(turnoutCtx, {
      type: 'bar',
      data: {
        labels: statesData.map(s => s.name),
        datasets: [{
          label: 'Voter Turnout (%)',
          data: statesData.map(s => s.turnout),
          backgroundColor: statesData.map((s, idx) => idx % 2 === 0 ? saffron : green),
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Recent Assembly Turnout by Selected States (%)',
            color: textColor,
            font: { size: 13, family: 'Outfit', weight: 'bold' }
          }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { min: 0, max: 100, ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });
  }

  // 2. Turnout by Gender Chart
  const genderCtx = document.getElementById('genderTurnoutChart');
  if (genderCtx) {
    if (charts.gender) charts.gender.destroy();
    
    const genderData = electionData.stats.genderDistribution;
    charts.gender = new Chart(genderCtx, {
      type: 'doughnut',
      data: {
        labels: ['Male Voters', 'Female Voters'],
        datasets: [{
          data: [genderData.male, genderData.female],
          backgroundColor: [navy, saffron],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: { color: textColor, font: { family: 'Outfit', size: 11 } }
          },
          title: {
            display: true,
            text: 'National Voter Turnout by Gender (%)',
            color: textColor,
            font: { size: 13, family: 'Outfit', weight: 'bold' }
          }
        }
      }
    });
  }

  // 3. Young Voter Turnout
  const youthCtx = document.getElementById('youthTurnoutChart');
  if (youthCtx) {
    if (charts.youth) charts.youth.destroy();
    
    const youthData = electionData.stats.youngVoterTurnout;
    charts.youth = new Chart(youthCtx, {
      type: 'line',
      data: {
        labels: youthData.map(y => y.age),
        datasets: [{
          label: 'Voting Turnout (%)',
          data: youthData.map(y => y.pct),
          borderColor: green,
          backgroundColor: 'rgba(19, 136, 8, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: green
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Young Voter Turnout vs Older Cohorts (%)',
            color: textColor,
            font: { size: 13, family: 'Outfit', weight: 'bold' }
          }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { min: 0, max: 100, ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });
  }

  // 4. Literacy vs Turnout Chart
  const litCtx = document.getElementById('literacyTrendChart');
  if (litCtx) {
    if (charts.literacy) charts.literacy.destroy();
    
    const trendData = electionData.stats.literacyVsTurnout;
    charts.literacy = new Chart(litCtx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Correlation Trend',
          data: trendData.map(t => ({ x: t.literacy, y: t.turnout, label: t.state })),
          backgroundColor: saffron,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const item = trendData[context.dataIndex];
                return `${item.state}: Turnout ${item.turnout}%, Literacy ${item.literacy}%`;
              }
            }
          },
          title: {
            display: true,
            text: 'Turnout (%) vs State Literacy Rates (%)',
            color: textColor,
            font: { size: 13, family: 'Outfit', weight: 'bold' }
          }
        },
        scales: {
          x: { 
            title: { display: true, text: 'Literacy Rate (%)', color: textColor },
            ticks: { color: textColor }, 
            grid: { color: gridColor },
            min: 60,
            max: 100
          },
          y: { 
            title: { display: true, text: 'Voter Turnout (%)', color: textColor },
            ticks: { color: textColor }, 
            grid: { color: gridColor },
            min: 50,
            max: 90
          }
        }
      }
    });
  }
}
