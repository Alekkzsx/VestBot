document.addEventListener('DOMContentLoaded', () => {
  // =======================================================
  // 1. LÓGICA DO MOTOR PREDITIVO & BÔNUS OFICIAL ETEC
  // =======================================================
  
  const baseRawScore = 37.5; // Pontuação bruta base do estudante em 50 questões
  const selectCourse = document.getElementById('select-course');
  const checkPublica = document.getElementById('check-escola-publica');
  const checkAfro = document.getElementById('check-afro');
  
  const bonusBadge = document.getElementById('bonus-badge');
  const displayNotaPonderada = document.getElementById('display-nota-ponderada');
  const displayNotaBruta = document.getElementById('display-nota-bruta');
  const displayNotaCorte = document.getElementById('display-nota-corte');
  const displayDemanda = document.getElementById('display-demanda');
  const barStudentScore = document.getElementById('bar-student-score');
  const markerCorte = document.getElementById('marker-corte');
  const statusMargemSeguranca = document.getElementById('status-margem-seguranca');
  
  const displayChancePercent = document.getElementById('display-chance-percent');
  const displayChanceText = document.getElementById('display-chance-text');
  const cardChanceContainer = document.getElementById('card-chance-container');

  function calculateBonusMultiplier() {
    let bonus = 0;
    if (checkPublica && checkPublica.checked) bonus += 0.10;
    if (checkAfro && checkAfro.checked) bonus += 0.03;
    return { multiplier: 1 + bonus, bonusPercent: Math.round(bonus * 100) };
  }

  function updatePrediction() {
    if (!selectCourse) return;

    const selectedOption = selectCourse.options[selectCourse.selectedIndex];
    const corteScore = parseFloat(selectedOption.getAttribute('data-corte') || '35.0');
    const demanda = selectedOption.getAttribute('data-demanda') || '8.4';
    const courseName = selectedOption.textContent;

    const { multiplier, bonusPercent } = calculateBonusMultiplier();
    const finalScore = Math.min(50, parseFloat((baseRawScore * multiplier).toFixed(1)));
    const margin = parseFloat((finalScore - corteScore).toFixed(1));

    // Atualiza badge de bônus
    if (bonusBadge) {
      bonusBadge.textContent = bonusPercent > 0 ? `Bônus Aplicado: +${bonusPercent}%` : 'Sem Bônus';
      if (bonusPercent === 0) {
        bonusBadge.className = 'bg-slate-200 text-slate-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1';
      } else {
        bonusBadge.className = 'bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1';
      }
    }

    // Atualiza pontuações
    if (displayNotaPonderada) displayNotaPonderada.textContent = finalScore.toFixed(1);
    if (displayNotaBruta) displayNotaBruta.textContent = `(Bruta: ${baseRawScore.toFixed(1)})`;
    if (displayNotaCorte) displayNotaCorte.textContent = `${corteScore.toFixed(1)} pts`;
    if (displayDemanda) displayDemanda.textContent = `${demanda} c/v`;

    // Atualiza termômetro
    const studentPercent = (finalScore / 50) * 100;
    const cortePercent = (corteScore / 50) * 100;

    if (barStudentScore) barStudentScore.style.width = `${studentPercent}%`;
    if (markerCorte) markerCorte.style.left = `${cortePercent}%`;

    // Calcula probabilidade e status
    let chance = 50;
    if (margin >= 5) chance = 92;
    else if (margin >= 2) chance = 82;
    else if (margin >= 0) chance = 68;
    else if (margin >= -3) chance = 45;
    else chance = 22;

    if (displayChancePercent) displayChancePercent.textContent = `${chance}%`;

    if (statusMargemSeguranca) {
      if (margin >= 0) {
        statusMargemSeguranca.innerHTML = `<i class="fas fa-shield-check"></i> Margem de Segurança: +${margin} pts acima do corte`;
        statusMargemSeguranca.className = 'text-emerald-600 font-extrabold flex items-center gap-1';
      } else {
        statusMargemSeguranca.innerHTML = `<i class="fas fa-triangle-exclamation text-rose-500"></i> Déficit: ${Math.abs(margin)} pts abaixo do corte`;
        statusMargemSeguranca.className = 'text-rose-600 font-extrabold flex items-center gap-1';
      }
    }

    if (displayChanceText) {
      if (margin >= 0) {
        displayChanceText.textContent = `Sua pontuação ponderada (${finalScore}) supera o histórico de corte (${corteScore}) de ${courseName}.`;
      } else {
        displayChanceText.textContent = `Atenção: sua pontuação atual (${finalScore}) está abaixo do corte (${corteScore}). Concentre-se nas prioridades!`;
      }
    }

    if (cardChanceContainer) {
      if (chance >= 70) {
        cardChanceContainer.className = 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full relative overflow-hidden';
      } else if (chance >= 45) {
        cardChanceContainer.className = 'bg-gradient-to-br from-amber-500 to-orange-700 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full relative overflow-hidden';
      } else {
        cardChanceContainer.className = 'bg-gradient-to-br from-rose-500 to-red-700 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full relative overflow-hidden';
      }
    }
  }

  if (selectCourse) selectCourse.addEventListener('change', updatePrediction);
  if (checkPublica) checkPublica.addEventListener('change', updatePrediction);
  if (checkAfro) checkAfro.addEventListener('change', updatePrediction);

  updatePrediction();

  // =======================================================
  // 2. GRÁFICOS CHART.JS (PROJEÇÃO & RADAR COMPETITIVO)
  // =======================================================

  // Gráfico 1: Projeção de Nota até o Dia da Prova
  const ctxProjection = document.getElementById('projectionChart');
  if (ctxProjection && window.Chart) {
    new Chart(ctxProjection, {
      type: 'line',
      data: {
        labels: ['Sem 1', 'Sem 3', 'Sem 6', 'Sem 9', 'Sem 12', 'Prova (06/12)'],
        datasets: [
          {
            label: 'Ritmo Atual (30min/dia)',
            data: [32.0, 34.5, 37.0, 39.5, 41.8, 43.8],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#2563eb',
            borderWidth: 3
          },
          {
            label: 'Ritmo Acelerado (+1 simulado/sem)',
            data: [32.0, 36.0, 39.5, 43.0, 45.5, 47.2],
            borderColor: '#10b981',
            borderDash: [5, 5],
            fill: false,
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: '#10b981',
            borderWidth: 2
          },
          {
            label: 'Nota de Corte (35.0)',
            data: [35.0, 35.0, 35.0, 35.0, 35.0, 35.0],
            borderColor: '#0f172a',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleFont: { family: 'Inter', weight: 'bold' },
            bodyFont: { family: 'Inter' },
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            min: 25,
            max: 50,
            ticks: {
              stepSize: 5,
              callback: (val) => `${val} pts`,
              font: { family: 'Inter', size: 10, weight: 'bold' },
              color: '#94a3b8'
            },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: {
              font: { family: 'Inter', size: 10, weight: 'bold' },
              color: '#94a3b8'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Gráfico 2: Radar de Competitividade
  const ctxRadar = document.getElementById('competitiveRadarChart');
  if (ctxRadar && window.Chart) {
    new Chart(ctxRadar, {
      type: 'radar',
      data: {
        labels: ['Matemática', 'Português', 'Ciências', 'Humanas', 'Interdisciplinar'],
        datasets: [
          {
            label: 'Sua Nota',
            data: [82, 88, 70, 85, 60],
            backgroundColor: 'rgba(15, 23, 42, 0.2)',
            borderColor: '#0f172a',
            pointBackgroundColor: '#0f172a',
            borderWidth: 2
          },
          {
            label: 'Top 10% Aprovados',
            data: [90, 92, 85, 88, 80],
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: '#10b981',
            borderDash: [3, 3],
            pointBackgroundColor: '#10b981',
            borderWidth: 1.5
          },
          {
            label: 'Média Concorrentes',
            data: [60, 65, 55, 60, 48],
            backgroundColor: 'rgba(203, 213, 225, 0.2)',
            borderColor: '#94a3b8',
            pointBackgroundColor: '#94a3b8',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            bodyFont: { family: 'Inter' }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false },
            pointLabels: {
              font: { family: 'Inter', size: 9, weight: 'bold' },
              color: '#475569'
            },
            grid: { color: '#e2e8f0' },
            angleLines: { color: '#f1f5f9' }
          }
        }
      }
    });
  }
});
