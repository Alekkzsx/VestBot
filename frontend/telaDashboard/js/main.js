document.addEventListener('DOMContentLoaded', () => {
  const etecDate = new Date('2026-12-06T13:30:00');
  const ifspDate = new Date('2026-11-29T13:30:00');
  
  const timerEtecEl = document.getElementById('timer-countdown-etec') || document.getElementById('timer-countdown');
  const timerIfspEl = document.getElementById('timer-countdown-ifsp');

  function calculateDays(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;
    if (distance < 0) return 0;
    return Math.floor(distance / (1000 * 60 * 60 * 24));
  }

  function updateTimers() {
    if (timerEtecEl) timerEtecEl.textContent = calculateDays(etecDate);
    if (timerIfspEl) timerIfspEl.textContent = calculateDays(ifspDate);
  }

  setInterval(updateTimers, 1000);
  updateTimers();

  const tabResumo = document.getElementById('btn-tab-resumo');
  const tabDesafios = document.getElementById('btn-tab-desafios');
  const viewResumo = document.getElementById('view-resumo');
  const viewDesafios = document.getElementById('view-desafios');

  if (tabResumo && tabDesafios && viewResumo && viewDesafios) {
    function setActiveTab(tab) {
      if (tab === 'resumo') {
        tabResumo.classList.add('bg-black', 'text-white');
        tabResumo.classList.remove('text-slate-500', 'hover:bg-slate-50');
        tabDesafios.classList.remove('bg-black', 'text-white');
        tabDesafios.classList.add('text-slate-500', 'hover:bg-slate-50');
        viewResumo.classList.remove('hidden');
        viewDesafios.classList.add('hidden');
      } else {
        tabDesafios.classList.add('bg-black', 'text-white');
        tabDesafios.classList.remove('text-slate-500', 'hover:bg-slate-50');
        tabResumo.classList.remove('bg-black', 'text-white');
        tabResumo.classList.add('text-slate-500', 'hover:bg-slate-50');
        viewDesafios.classList.remove('hidden');
        viewResumo.classList.add('hidden');
      }
    }
    tabResumo.addEventListener('click', () => setActiveTab('resumo'));
    tabDesafios.addEventListener('click', () => setActiveTab('desafios'));
  }
});
