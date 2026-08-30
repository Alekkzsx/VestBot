class SimuladoCustom extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="simulado-custom-view" class="hidden animate-fade-in max-w-5xl mx-auto pb-12">
        
        <!-- Header da Tela de Customização -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <button id="btn-custom-back-to-hub" class="text-xs font-bold text-slate-500 hover:text-black flex items-center gap-1.5 transition-colors mr-2">
                <i class="fas fa-arrow-left"></i> Voltar
              </button>
              <span class="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Configurador Avançado
              </span>
            </div>
            <h2 class="text-3xl font-black text-slate-900 tracking-tight">Criar Simulado Sob Medida</h2>
          </div>
          <p class="text-xs text-slate-500 max-w-xs sm:text-right">Monte a prova perfeita para as matérias que você mais precisa treinar hoje.</p>
        </div>

        <form id="form-custom-simulado-screen" class="space-y-8">
          
          <!-- Seção 1: As 7 Matérias Desmembradas -->
          <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div>
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">1</span>
                  Selecione as Matérias Alvo
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Escolha qualquer combinação entre as 7 disciplinas oficiais da ETEC.</p>
              </div>

              <!-- Atalhos Rápidos de Seleção -->
              <div class="flex items-center gap-1.5 flex-wrap">
                <button type="button" id="btn-quick-all" class="text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                  Todas
                </button>
                <button type="button" id="btn-quick-exatas" class="text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                  Exatas
                </button>
                <button type="button" id="btn-quick-humanas" class="text-[11px] font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors">
                  Humanas
                </button>
                <button type="button" id="btn-quick-bio" class="text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                  Biológicas
                </button>
              </div>
            </div>

            <!-- Grade das 7 Matérias -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              
              <!-- 1. Português -->
              <label class="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all custom-subject-card has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50 has-[:checked]:shadow-sm">
                <input type="checkbox" name="custom-screen-subject" value="Português" class="w-5 h-5 text-rose-600 rounded focus:ring-0 cursor-pointer" checked>
                <div>
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <i class="fas fa-book text-rose-500"></i> Português
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">Gramática & Textos</span>
                </div>
              </label>

              <!-- 2. Matemática -->
              <label class="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all custom-subject-card has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50 has-[:checked]:shadow-sm">
                <input type="checkbox" name="custom-screen-subject" value="Matemática" class="w-5 h-5 text-blue-600 rounded focus:ring-0 cursor-pointer" checked>
                <div>
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <i class="fas fa-calculator text-blue-500"></i> Matemática
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">Álgebra & Geometria</span>
                </div>
              </label>

              <!-- 3. Biologia -->
              <label class="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all custom-subject-card has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 has-[:checked]:shadow-sm">
                <input type="checkbox" name="custom-screen-subject" value="Biologia" class="w-5 h-5 text-emerald-600 rounded focus:ring-0 cursor-pointer" checked>
                <div>
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <i class="fas fa-dna text-emerald-500"></i> Biologia
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">Ecologia, Citologia & Genética</span>
                </div>
              </label>

              <!-- 4. Física -->
              <label class="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all custom-subject-card has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-50/50 has-[:checked]:shadow-sm">
                <input type="checkbox" name="custom-screen-subject" value="Física" class="w-5 h-5 text-cyan-600 rounded focus:ring-0 cursor-pointer" checked>
                <div>
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <i class="fas fa-atom text-cyan-500"></i> Física
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">Mecânica, Óptica & Ondas</span>
                </div>
              </label>

              <!-- 5. Química -->
              <label class="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all custom-subject-card has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50/50 has-[:checked]:shadow-sm">
                <input type="checkbox" name="custom-screen-subject" value="Química" class="w-5 h-5 text-teal-600 rounded focus:ring-0 cursor-pointer" checked>
                <div>
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <i class="fas fa-flask text-teal-500"></i> Química
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">Matéria, Reações & Tabela</span>
                </div>
              </label>

              <!-- 6. História -->
              <label class="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all custom-subject-card has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/50 has-[:checked]:shadow-sm">
                <input type="checkbox" name="custom-screen-subject" value="História" class="w-5 h-5 text-amber-600 rounded focus:ring-0 cursor-pointer" checked>
                <div>
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <i class="fas fa-landmark text-amber-500"></i> História
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">Brasil & Geral</span>
                </div>
              </label>

              <!-- 7. Geografia -->
              <label class="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all custom-subject-card has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50/50 has-[:checked]:shadow-sm">
                <input type="checkbox" name="custom-screen-subject" value="Geografia" class="w-5 h-5 text-orange-600 rounded focus:ring-0 cursor-pointer" checked>
                <div>
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <i class="fas fa-earth-americas text-orange-500"></i> Geografia
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">Clima, Relevo & Geopolítica</span>
                </div>
              </label>

            </div>
          </div>

          <!-- Seção 2: Nível de Dificuldade -->
          <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span class="w-6 h-6 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">2</span>
              Nível de Dificuldade
            </h3>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label class="p-4 text-center rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 text-xs font-bold text-slate-700 transition-all has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black shadow-sm">
                <input type="radio" name="custom-screen-diff" value="all" class="hidden" checked>
                <div class="text-base mb-1">🎯</div>
                <span>Mista (Padrão Prova)</span>
              </label>

              <label class="p-4 text-center rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 text-xs font-bold text-slate-700 transition-all has-[:checked]:bg-emerald-600 has-[:checked]:text-white has-[:checked]:border-emerald-600 shadow-sm">
                <input type="radio" name="custom-screen-diff" value="Fácil" class="hidden">
                <div class="text-base mb-1">🟢</div>
                <span>Fácil</span>
              </label>

              <label class="p-4 text-center rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 text-xs font-bold text-slate-700 transition-all has-[:checked]:bg-yellow-500 has-[:checked]:text-white has-[:checked]:border-yellow-500 shadow-sm">
                <input type="radio" name="custom-screen-diff" value="Médio" class="hidden">
                <div class="text-base mb-1">🟡</div>
                <span>Médio</span>
              </label>

              <label class="p-4 text-center rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 text-xs font-bold text-slate-700 transition-all has-[:checked]:bg-rose-600 has-[:checked]:text-white has-[:checked]:border-rose-600 shadow-sm">
                <input type="radio" name="custom-screen-diff" value="Difícil" class="hidden">
                <div class="text-base mb-1">🔴</div>
                <span>Difícil</span>
              </label>
            </div>
          </div>

          <!-- Seção 3: Quantidade de Questões (Máx 50) & Tempo Limite (Máx 4 Horas) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Quantidade de Questões -->
            <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <span class="w-6 h-6 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">3</span>
                  Qtd. de Questões (Máx: 50)
                </h3>
                <p class="text-xs text-slate-500 mb-4">Quantas questões você deseja resolver nesta sessão?</p>
              </div>

              <div>
                <div class="flex items-center justify-between gap-4 mb-4">
                  <span class="text-3xl font-black text-black" id="custom-qty-display">20 questões</span>
                  <span class="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full uppercase">Padrão</span>
                </div>

                <div class="grid grid-cols-4 gap-2 mb-3">
                  <button type="button" class="btn-qty-pill py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700" data-qty="10">10Q</button>
                  <button type="button" class="btn-qty-pill py-2 rounded-xl text-xs font-bold border border-black bg-black text-white" data-qty="20">20Q</button>
                  <button type="button" class="btn-qty-pill py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700" data-qty="35">35Q</button>
                  <button type="button" class="btn-qty-pill py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700" data-qty="50">50Q (Máx)</button>
                </div>

                <input type="range" id="custom-qty-slider" min="5" max="50" step="5" value="20" class="w-full accent-black cursor-pointer">
              </div>
            </div>

            <!-- Tempo Limite (Máx 4 Horas) -->
            <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <span class="w-6 h-6 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">4</span>
                  Tempo Limite (Máx: 4h)
                </h3>
                <p class="text-xs text-slate-500 mb-4">Escolha a duração total do cronômetro de prova.</p>
              </div>

              <div>
                <select id="custom-screen-time-select" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-black transition-colors mb-3">
                  <option value="900">15 Minutos (Sprint Ultrarrápido)</option>
                  <option value="1800">30 Minutos (Treino Diário)</option>
                  <option value="2700">45 Minutos</option>
                  <option value="3600" selected>1 Hora (60 min)</option>
                  <option value="5400">1 Hora e 30 Minutos</option>
                  <option value="7200">2 Horas</option>
                  <option value="10800">3 Horas</option>
                  <option value="14400">4 Horas (Tempo Máximo Oficial ETEC)</option>
                  <option value="0">Sem Limite de Tempo (Modo Livre)</option>
                </select>
                <p class="text-[11px] text-slate-400 text-center font-medium">Pace estimado: ~3 minutos por questão.</p>
              </div>
            </div>

          </div>

          <!-- Barra de Ação Inferior -->
          <div class="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
            <div>
              <h4 class="text-lg font-bold text-white mb-1">Pronto para começar?</h4>
              <p class="text-xs text-slate-400" id="custom-summary-text">
                Simulado com 20 questões • 1 hora limite • Matérias selecionadas.
              </p>
            </div>
            <button type="submit" class="w-full sm:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0">
              <i class="fas fa-play"></i> Iniciar Prova Personalizada
            </button>
          </div>

        </form>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const slider = this.querySelector('#custom-qty-slider');
    const display = this.querySelector('#custom-qty-display');
    const pills = this.querySelectorAll('.btn-qty-pill');
    const summaryText = this.querySelector('#custom-summary-text');
    const timeSelect = this.querySelector('#custom-screen-time-select');

    const btnQuickAll = this.querySelector('#btn-quick-all');
    const btnQuickExatas = this.querySelector('#btn-quick-exatas');
    const btnQuickHumanas = this.querySelector('#btn-quick-humanas');
    const btnQuickBio = this.querySelector('#btn-quick-bio');
    const checkboxes = this.querySelectorAll('input[name="custom-screen-subject"]');

    function updateSummary() {
      const checked = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
      const qty = slider ? slider.value : 20;
      const timeVal = timeSelect ? timeSelect.value : 3600;
      
      let timeStr = '1h';
      if (timeVal == 0) timeStr = 'Sem limite de tempo';
      else if (timeVal < 3600) timeStr = `${Math.floor(timeVal / 60)}min`;
      else timeStr = `${Math.floor(timeVal / 3600)}h`;

      if (summaryText) {
        summaryText.textContent = `${qty} questões • ${timeStr} • ${checked.length} matérias selecionadas (${checked.join(', ') || 'Nenhuma'})`;
      }
    }

    if (slider && display) {
      slider.addEventListener('input', (e) => {
        display.textContent = `${e.target.value} questões`;
        pills.forEach(p => {
          if (p.getAttribute('data-qty') === e.target.value) {
            p.className = 'btn-qty-pill py-2 rounded-xl text-xs font-bold border border-black bg-black text-white';
          } else {
            p.className = 'btn-qty-pill py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700';
          }
        });
        updateSummary();
      });
    }

    pills.forEach(p => {
      p.addEventListener('click', () => {
        const val = p.getAttribute('data-qty');
        if (slider) slider.value = val;
        if (display) display.textContent = `${val} questões`;
        pills.forEach(other => {
          other.className = 'btn-qty-pill py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700';
        });
        p.className = 'btn-qty-pill py-2 rounded-xl text-xs font-bold border border-black bg-black text-white';
        updateSummary();
      });
    });

    if (timeSelect) timeSelect.addEventListener('change', updateSummary);
    checkboxes.forEach(cb => cb.addEventListener('change', updateSummary));

    // Atalhos
    if (btnQuickAll) {
      btnQuickAll.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = true);
        updateSummary();
      });
    }
    if (btnQuickExatas) {
      btnQuickExatas.addEventListener('click', () => {
        const exatas = ['Matemática', 'Física', 'Química'];
        checkboxes.forEach(cb => cb.checked = exatas.includes(cb.value));
        updateSummary();
      });
    }
    if (btnQuickHumanas) {
      btnQuickHumanas.addEventListener('click', () => {
        const humanas = ['Português', 'História', 'Geografia'];
        checkboxes.forEach(cb => cb.checked = humanas.includes(cb.value));
        updateSummary();
      });
    }
    if (btnQuickBio) {
      btnQuickBio.addEventListener('click', () => {
        const bio = ['Biologia', 'Química'];
        checkboxes.forEach(cb => cb.checked = bio.includes(cb.value));
        updateSummary();
      });
    }

    updateSummary();
  }
}

customElements.define('simulado-custom', SimuladoCustom);
