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
  const displayDiferenca = document.getElementById('display-diferenca');
  const displayChance = document.getElementById('display-chance');
  const displayDiagnostico = document.getElementById('display-diagnostico');

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

    const { multiplier, bonusPercent } = calculateBonusMultiplier();
    const finalScore = Math.min(50, parseFloat((baseRawScore * multiplier).toFixed(1)));
    const margin = parseFloat((finalScore - corteScore).toFixed(1));

    if (bonusBadge) bonusBadge.textContent = bonusPercent > 0 ? `Bônus Aplicado: +${bonusPercent}%` : 'Sem Bônus';
    if (displayNotaPonderada) displayNotaPonderada.textContent = finalScore.toFixed(1);
    if (displayNotaBruta) displayNotaBruta.textContent = `(Bruta: ${baseRawScore.toFixed(1)})`;
    if (displayNotaCorte) displayNotaCorte.textContent = `${corteScore.toFixed(1)} pts`;
    if (displayDemanda) displayDemanda.textContent = `${demanda} c/v`;

    const studentPercent = (finalScore / 50) * 100;
    const cortePercent = (corteScore / 50) * 100;

    if (barStudentScore) barStudentScore.style.width = `${studentPercent}%`;
    if (markerCorte) markerCorte.style.left = `${cortePercent}%`;

    let chance = 50;
    if (margin >= 5) chance = 92;
    else if (margin >= 2) chance = 82;
    else if (margin >= 0) chance = 68;
    else if (margin >= -3) chance = 45;
    else chance = 22;

    if (displayChance) displayChance.textContent = `${chance}%`;

    if (displayDiferenca) {
      if (margin >= 0) {
        displayDiferenca.textContent = `+${margin} pts acima da margem de segurança`;
        displayDiferenca.className = 'text-emerald-600 font-black';
      } else {
        displayDiferenca.textContent = `${margin} pts abaixo do corte de segurança`;
        displayDiferenca.className = 'text-rose-600 font-black';
      }
    }

    if (displayDiagnostico) {
      if (margin >= 0) {
        displayDiagnostico.textContent = 'Excelente! Sua média ponderada supera a nota de corte com folga para a 1ª chamada.';
      } else {
        displayDiagnostico.textContent = 'Atenção: Você está abaixo do corte histórico. Foque nos assuntos de maior relevância para subir sua nota.';
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
