document.addEventListener('DOMContentLoaded', () => {
  let currentStatus = 'all';
  let currentSubject = 'all';
  let currentOrigin = 'all';
  let currentSearch = '';

  const cards = document.querySelectorAll('resolution-card');
  const emptyState = document.getElementById('resolutions-empty-state');
  const cardsCountDisplay = document.getElementById('resolutions-visible-count');

  function filterCards() {
    let visibleCount = 0;

    cards.forEach(card => {
      const subject = card.getAttribute('data-disciplina') || '';
      const status = card.getAttribute('data-acertou') === 'true' ? 'correct' : 'wrong';
      const origin = card.getAttribute('data-origem') || '';
      const enunciado = (card.getAttribute('data-enunciado') || '').toLowerCase();
      const assunto = (card.getAttribute('data-assunto') || '').toLowerCase();

      // Check status
      const matchStatus = currentStatus === 'all' || status === currentStatus;
      // Check subject
      const matchSubject = currentSubject === 'all' || subject === currentSubject;
      // Check origin
      const matchOrigin = currentOrigin === 'all' || origin === currentOrigin;
      // Check search
      const matchSearch = currentSearch === '' || enunciado.includes(currentSearch) || assunto.includes(currentSearch);

      if (matchStatus && matchSubject && matchOrigin && matchSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (cardsCountDisplay) {
      cardsCountDisplay.textContent = `${visibleCount} resoluç${visibleCount === 1 ? 'ão encontrada' : 'ões encontradas'}`;
    }

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }
  }

  // Event Listeners: Status Tabs
  const statusButtons = document.querySelectorAll('.filter-status-btn');
  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      statusButtons.forEach(b => {
        b.classList.remove('bg-black', 'text-white', 'shadow-sm');
        b.classList.add('text-slate-600', 'hover:text-slate-900');
      });
      btn.classList.add('bg-black', 'text-white', 'shadow-sm');
      btn.classList.remove('text-slate-600', 'hover:text-slate-900');

      currentStatus = btn.getAttribute('data-status') || 'all';
      filterCards();
    });
  });

  // Event Listeners: Subject Buttons
  const subjectButtons = document.querySelectorAll('.filter-subject-btn');
  subjectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      subjectButtons.forEach(b => {
        b.classList.remove('bg-slate-900', 'text-white');
        b.classList.add('bg-slate-50', 'text-slate-600', 'border', 'border-slate-200');
      });
      btn.classList.add('bg-slate-900', 'text-white');
      btn.classList.remove('bg-slate-50', 'text-slate-600', 'border', 'border-slate-200');

      currentSubject = btn.getAttribute('data-subject') || 'all';
      filterCards();
    });
  });

  // Event Listener: Origin Select
  const originSelect = document.getElementById('select-origin-filter');
  if (originSelect) {
    originSelect.addEventListener('change', (e) => {
      currentOrigin = e.target.value;
      filterCards();
    });
  }

  // Event Listener: Search input
  const searchInput = document.getElementById('input-search-resolutions');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      filterCards();
    });
  }

  // Initial calculation
  filterCards();
});
