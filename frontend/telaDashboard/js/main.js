document.addEventListener('DOMContentLoaded', () => {
  const targetDate = new Date('2026-12-06T13:30:00');
  const timerEl = document.getElementById('timer-countdown');

  function updateTimer() {
    if (!timerEl) return;
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;
    if (distance < 0) {
      timerEl.textContent = '0';
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    timerEl.textContent = days;
  }
  setInterval(updateTimer, 1000);
  updateTimer();

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
