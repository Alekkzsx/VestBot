document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // TAB NAVIGATION LOGIC
  // ==========================================
  const btnOverview = document.getElementById('btn-tab-overview');
  const btnBehavior = document.getElementById('btn-tab-behavior');
  const btnQuestion = document.getElementById('btn-tab-question');
  
  const tabOverview = document.getElementById('tab-overview');
  const tabBehavior = document.getElementById('tab-behavior');
  const tabQuestion = document.getElementById('tab-question');

  function switchTab(activeBtn, activeTab) {
    const allBtns = [btnOverview, btnBehavior, btnQuestion];
    const allTabs = [tabOverview, tabBehavior, tabQuestion];

    // Reset all buttons
    allBtns.forEach(btn => {
      if(btn) {
        btn.classList.remove('bg-black', 'text-white', 'shadow-sm');
        btn.classList.add('text-slate-500', 'hover:text-slate-900');
      }
    });

    // Reset all tabs
    allTabs.forEach(tab => {
      if(tab) {
        tab.classList.remove('block');
        tab.classList.add('hidden');
      }
    });

    // Set Active State
    if(activeBtn && activeTab) {
      activeBtn.classList.remove('text-slate-500', 'hover:text-slate-900');
      activeBtn.classList.add('bg-black', 'text-white', 'shadow-sm');
      
      activeTab.classList.remove('hidden');
      activeTab.classList.add('block');
    }
  }

  if (btnOverview) btnOverview.addEventListener('click', () => switchTab(btnOverview, tabOverview));
  if (btnBehavior) btnBehavior.addEventListener('click', () => switchTab(btnBehavior, tabBehavior));
  if (btnQuestion) btnQuestion.addEventListener('click', () => switchTab(btnQuestion, tabQuestion));


  // ==========================================
  // GRÁFICOS (CHART.JS)
  // ==========================================
  
  // 1. Gráfico de Evolução (Line Chart)
  const evolutionCtx = document.getElementById('evolutionChart');
  if (evolutionCtx) {
    new Chart(evolutionCtx, {
      type: 'line',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
          label: 'Acurácia Geral (%)',
          data: [45, 52, 60, 75],
          borderColor: '#3b82f6', // blue-500
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#3b82f6',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { family: 'Inter', size: 13 },
            bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return context.parsed.y + '% de Acerto';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: '#f1f5f9', drawBorder: false },
            ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8', stepSize: 25 }
          },
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { font: { family: 'Inter', size: 12 }, color: '#64748b' }
          }
        }
      }
    });
  }

  // 2. Radar de Afinidade (Radar Chart)
  const radarCtx = document.getElementById('radarChart');
  if (radarCtx) {
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Exatas', 'Humanas', 'Biológicas', 'Linguagens'],
        datasets: [{
          label: 'Afinidade',
          data: [40, 85, 75, 90],
          backgroundColor: 'rgba(16, 185, 129, 0.2)', // emerald-500
          borderColor: '#10b981',
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#10b981',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 24
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            angleLines: { color: '#f1f5f9' },
            grid: { color: '#f1f5f9' },
            pointLabels: {
              font: { family: 'Inter', size: 10, weight: 'bold' },
              color: '#64748b'
            },
            ticks: { display: false, max: 100, min: 0 }
          }
        }
      }
    });
  }

  // 3. Gráfico da Pegadinha - Aba 3 (Doughnut Chart)
  const questionDoughnutCtx = document.getElementById('questionDoughnut');
  if (questionDoughnutCtx) {
    new Chart(questionDoughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Alt A', 'Alt B (Sua)', 'Alt C (Certa)', 'Alt D', 'Alt E'],
        datasets: [{
          data: [10, 45, 30, 12, 3],
          backgroundColor: [
            '#e2e8f0', // slate-200 (A)
            '#ef4444', // red-500 (B - Error)
            '#22c55e', // green-500 (C - Correct)
            '#e2e8f0', // slate-200 (D)
            '#e2e8f0'  // slate-200 (E)
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            bodyFont: { family: 'Inter', size: 13 },
            callbacks: {
              label: function(context) {
                return ' ' + context.parsed + '% dos alunos';
              }
            }
          }
        }
      }
    });
  }

});
