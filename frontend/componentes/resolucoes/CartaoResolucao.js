class CartaoResolucao extends HTMLElement {
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
        <div class="p-3 rounded-xl border ${itemStyle} flex items-center gap-3 transition-colors">
          ${icon}
          <span class="text-xs font-semibold text-slate-800 flex-1">${alt.texto}</span>
          <span class="text-[10px] font-bold text-slate-400 mr-2">${alt.percentual} marcaram</span>
          ${tagExtra}
        </div>
      `;
    }).join('');

    this.innerHTML = `
      <div class="resolution-card bg-white rounded-3xl border ${cardBorder} shadow-sm p-6 md:p-8 mb-6 transition-all duration-300 relative overflow-hidden" 
           data-disciplina="${data.disciplina}" 
           data-status="${isCorrect ? 'correct' : 'wrong'}" 
           data-origem="${data.origem}"
           data-search="${(data.disciplina + ' ' + data.assunto + ' ' + data.enunciado + ' ' + data.id).toLowerCase()}">
        
        <!-- Header da Questão -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold px-3 py-1 rounded-lg border ${badgeColor}">
              ${data.disciplina} • ${data.assunto}
            </span>
            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              ${data.prova} (${data.questaoNumero})
            </span>
            <span class="text-xs font-medium text-slate-400">
              Dificuldade: <strong class="text-slate-700">${data.dificuldade}</strong>
            </span>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            ${statusBadge}
          </div>
        </div>

        <!-- Enunciado -->
        <div class="mb-6">
          <p class="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
            ${data.enunciado}
          </p>
        </div>

        <!-- Alternativas -->
        <div class="space-y-2 mb-6">
          ${renderAlternativas}
        </div>

        <!-- Métricas Rápidas de Tempo & Alerta de Pegadinha -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- Tempo / Speed Run -->
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 text-sm">
                <i class="fas fa-stopwatch"></i>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Seu Tempo</p>
                <p class="text-sm font-black text-slate-900">${data.tempoGasto} <span class="text-[10px] text-slate-400 font-semibold">(Ideal: ${data.paceIdeal})</span></p>
              </div>
            </div>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              Pace Ótimo
            </span>
          </div>

          <!-- Radar da Pegadinha (Distrator Crítico) -->
          <div class="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm shrink-0">
              <i class="fas fa-triangle-exclamation"></i>
            </div>
            <div>
              <p class="text-[10px] font-bold text-amber-800 uppercase">Pegadinha Clássica Detectada</p>
              <p class="text-xs text-amber-900 font-medium leading-tight mt-0.5">${data.pegadinhaTexto}</p>
            </div>
          </div>
        </div>

        <!-- Botão Accordion: Resolução Guiada Passo a Passo -->
        <div>
          <button class="btn-toggle-resolution w-full py-3.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-between shadow-sm">
            <span class="flex items-center gap-2">
              <i class="fas fa-brain text-purple-400"></i> Ver Passo a Passo Detalhado & Teoria
            </span>
            <i class="fas fa-chevron-down text-slate-400 transition-transform duration-300"></i>
          </button>

          <!-- Conteúdo do Passo a Passo (Oculto por padrão) -->
          <div class="resolution-content hidden mt-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fade-in">
            <!-- Passo 1: Conceito Teórico Central -->
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
              <div>
                <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Fundamento Teórico</h5>
                <p class="text-xs text-slate-700 leading-relaxed">${data.conceito}</p>
              </div>
            </div>

            <!-- Passo 2: Desenvolvimento da Resolução -->
            <div class="flex items-start gap-3 pt-3 border-t border-slate-200">
              <div class="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
              <div>
                <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Desenvolvimento Matemático / Lógico</h5>
                <p class="text-xs text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-xl border border-slate-200 mt-1">${data.desenvolvimento}</p>
              </div>
            </div>

            <!-- Passo 3: Conclusão & Dica de Memorização -->
            <div class="flex items-start gap-3 pt-3 border-t border-slate-200">
              <div class="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
              <div>
                <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Dica de Prova (Vestibulinho ETEC)</h5>
                <p class="text-xs text-slate-600 leading-relaxed">Sempre verifique as unidades de medida pedidas nas alternativas antes de marcar o gabarito.</p>
              </div>
            </div>

            <!-- Ação Rápida de Reforço -->
            <div class="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <a href="../telaSimulado/index.html" class="px-4 py-2 bg-white border border-slate-200 hover:border-black text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5">
                <i class="fas fa-rotate-left"></i> Treinar Questões Semelhantes
              </a>
            </div>
          </div>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const btnToggle = this.querySelector('.btn-toggle-resolution');
    const content = this.querySelector('.resolution-content');
    const chevron = this.querySelector('.btn-toggle-resolution i.fa-chevron-down');

    if (btnToggle && content) {
      btnToggle.addEventListener('click', () => {
        content.classList.toggle('hidden');
        if (chevron) {
          chevron.classList.toggle('rotate-180');
        }
      });
    }
  }
}

customElements.define('cartao-resolucao', CartaoResolucao);
if (!customElements.get('resolution-card')) {
  customElements.define('resolution-card', class extends CartaoResolucao {});
}
