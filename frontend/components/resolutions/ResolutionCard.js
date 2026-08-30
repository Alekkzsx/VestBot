class ResolutionCard extends HTMLElement {
  connectedCallback() {
    const data = {
      id: this.getAttribute('data-id') || 'ETEC-2023-Q12',
      disciplina: this.getAttribute('data-disciplina') || 'Matemática',
      assunto: this.getAttribute('data-assunto') || 'Geometria Plana',
      dificuldade: this.getAttribute('data-dificuldade') || 'Média',
      origem: this.getAttribute('data-origem') || 'ETEC',
      prova: this.getAttribute('data-prova') || 'Vestibulinho ETEC 2023',
      questaoNumero: this.getAttribute('data-numero') || 'Questão 12',
      acertou: this.getAttribute('data-acertou') === 'true',
      marcou: this.getAttribute('data-marcou') || 'B',
      gabarito: this.getAttribute('data-gabarito') || 'C',
      tempoGasto: this.getAttribute('data-tempo') || '1m 15s',
      paceIdeal: this.getAttribute('data-pace') || '3m 00s',
      enunciado: this.getAttribute('data-enunciado') || 'Calcule a área do triângulo retângulo cujos catetos medem 3cm e 4cm.',
      pegadinhaTexto: this.getAttribute('data-pegadinha') || '42% dos alunos multiplicaram os catetos (3 × 4 = 12), esquecendo de dividir por 2.',
      conceito: this.getAttribute('data-conceito') || 'Área de triângulos retângulos: A = (base × altura) / 2.',
      desenvolvimento: this.getAttribute('data-desenvolvimento') || 'Identificando base = 4cm e altura = 3cm:<br>A = (4 × 3) / 2<br>A = 12 / 2<br>A = <strong>6 cm²</strong>.',
      alternativas: JSON.parse(this.getAttribute('data-alternativas') || JSON.stringify([
        { letra: 'A', texto: '7 cm²', percentual: '8%' },
        { letra: 'B', texto: '12 cm²', percentual: '42%' },
        { letra: 'C', texto: '6 cm²', percentual: '44%' },
        { letra: 'D', texto: '24 cm²', percentual: '4%' },
        { letra: 'E', texto: '3,5 cm²', percentual: '2%' }
      ]))
    };

    const isCorrect = data.acertou;
    const cardBorder = isCorrect ? 'border-slate-200 hover:border-emerald-300' : 'border-rose-100 hover:border-rose-300';
    const statusBadge = isCorrect 
      ? `<span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><i class="fas fa-check-circle"></i> Você acertou (Marcou ${data.marcou})</span>`
      : `<span class="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><i class="fas fa-times-circle"></i> Você errou (Marcou ${data.marcou})</span>`;

    const subjectColors = {
      'Matemática': 'bg-blue-50 text-blue-700 border-blue-200',
      'Português': 'bg-rose-50 text-rose-700 border-rose-200',
      'Ciências': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Humanas': 'bg-amber-50 text-amber-700 border-amber-200'
    };
    const badgeColor = subjectColors[data.disciplina] || 'bg-slate-100 text-slate-700 border-slate-200';

    const renderAlternativas = data.alternativas.map(alt => {
      const isUserChoice = alt.letra === data.marcou;
      const isGabarito = alt.letra === data.gabarito;

      let itemStyle = 'border-slate-200 bg-white hover:bg-slate-50';
      let icon = `<span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">${alt.letra}</span>`;
      let tagExtra = '';

      if (isGabarito) {
        itemStyle = 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500/20';
        icon = `<span class="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center"><i class="fas fa-check"></i></span>`;
        tagExtra = `<span class="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full ml-auto uppercase tracking-wider">Gabarito Oficial</span>`;
      } else if (isUserChoice && !isCorrect) {
        itemStyle = 'border-rose-400 bg-rose-50/50 shadow-sm ring-1 ring-rose-400/20';
        icon = `<span class="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center"><i class="fas fa-times"></i></span>`;
        tagExtra = `<span class="text-[10px] bg-rose-100 text-rose-800 font-black px-2 py-0.5 rounded-full ml-auto uppercase tracking-wider">Sua Escolha (Incorreta)</span>`;
      }

      return `
        <div class="flex items-center justify-between p-3.5 rounded-xl border ${itemStyle} transition-all">
          <div class="flex items-center gap-3 flex-1">
            ${icon}
            <span class="text-sm font-medium text-slate-800">${alt.texto}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400 font-medium">${alt.percentual}</span>
            ${tagExtra}
          </div>
        </div>
      `;
    }).join('');

    this.innerHTML = `
      <article class="resolution-card bg-white rounded-2xl border ${cardBorder} shadow-sm p-6 md:p-8 transition-all" data-subject="${data.disciplina}" data-status="${isCorrect ? 'correct' : 'wrong'}" data-origin="${data.origem}">
        
        <!-- Topo do Card -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold px-2.5 py-1 rounded-lg border ${badgeColor}">
              ${data.disciplina} • ${data.assunto}
            </span>
            <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
              ${data.prova} - ${data.questaoNumero}
            </span>
            <span class="text-xs font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200">
              Nível ${data.dificuldade}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tempo gasto</span>
              <span class="text-xs font-bold text-slate-700">${data.tempoGasto} <span class="text-slate-400 font-normal">/ pace ${data.paceIdeal}</span></span>
            </div>
            ${statusBadge}
          </div>
        </div>

        <!-- Enunciado -->
        <div class="mb-6">
          <h3 class="text-base md:text-lg font-bold text-slate-900 leading-relaxed">${data.enunciado}</h3>
        </div>

        <!-- Alternativas -->
        <div class="space-y-2.5 mb-6">
          ${renderAlternativas}
        </div>

        <!-- Botão Toggle de Resolução -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <button class="btn-toggle-solution flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl transition-all">
            <i class="fas fa-chalkboard-teacher text-blue-600"></i>
            <span>Ver Resolução Passo a Passo</span>
            <i class="fas fa-chevron-down text-slate-400 transition-transform duration-300 icon-arrow"></i>
          </button>

          <div class="flex items-center gap-2">
            <button title="Salvar para revisão" class="btn-action-srs w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-center">
              <i class="fas fa-bookmark"></i>
            </button>
            <a href="../telaAulas/index.html" title="Ver videoaula" class="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center">
              <i class="fas fa-play"></i>
            </a>
          </div>
        </div>

        <!-- Explicação do Professor (Colapsável) -->
        <div class="solution-panel hidden mt-6 pt-6 border-t border-slate-100 animate-fade-in">
          <div class="bg-slate-900 text-slate-200 p-6 rounded-2xl space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 class="text-white font-bold text-sm flex items-center gap-2">
                <i class="fas fa-graduation-cap text-blue-400"></i> Explicação Didática do Professor
              </h4>
              <span class="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">Gabarito: ${data.gabarito}</span>
            </div>

            <!-- Etapa 1: Teoria -->
            <div>
              <p class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">1. Teoria & Conceito Chave</p>
              <p class="text-sm text-slate-300 leading-relaxed">${data.conceito}</p>
            </div>

            <!-- Etapa 2: Passo a Passo -->
            <div>
              <p class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">2. Desenvolvimento Passo a Passo</p>
              <p class="text-sm text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">${data.desenvolvimento}</p>
            </div>

            <!-- Etapa 3: Diagnóstico de Erro Comum / Pegadinha -->
            <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <p class="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                <i class="fas fa-lightbulb"></i> Análise da Pegadinha / Distrator
              </p>
              <p class="text-xs text-slate-300 leading-relaxed">${data.pegadinhaTexto}</p>
            </div>
          </div>
        </div>

      </article>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const toggleBtn = this.querySelector('.btn-toggle-solution');
    const panel = this.querySelector('.solution-panel');
    const iconArrow = this.querySelector('.icon-arrow');
    const srsBtn = this.querySelector('.btn-action-srs');

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('hidden');
        if (panel.classList.contains('hidden')) {
          toggleBtn.querySelector('span').textContent = 'Ver Resolução Passo a Passo';
          if (iconArrow) iconArrow.style.transform = 'rotate(0deg)';
        } else {
          toggleBtn.querySelector('span').textContent = 'Ocultar Resolução';
          if (iconArrow) iconArrow.style.transform = 'rotate(180deg)';
        }
      });
    }

    if (srsBtn) {
      srsBtn.addEventListener('click', () => {
        srsBtn.classList.toggle('text-purple-600');
        srsBtn.classList.toggle('bg-purple-50');
        srsBtn.classList.toggle('border-purple-300');
        const icon = srsBtn.querySelector('i');
        if (icon) {
          icon.classList.toggle('fas');
          icon.classList.toggle('far');
        }
      });
    }
  }
}

customElements.define('resolution-card', ResolutionCard);
