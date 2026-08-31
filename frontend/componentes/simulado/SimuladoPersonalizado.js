class SimuladoPersonalizado extends HTMLElement {
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
                    <i class="fas fa-leaf text-emerald-500"></i> Biologia
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">Ecologia & Corpo Humano</span>
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
                  <span class="text-[10px] text-slate-500 font-medium">Matéria, Soluções & Reações</span>
                </div>
              </label>

              <!-- 6. História -->
              <label class="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all custom-subject-card has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/50 has-[:checked]:shadow-sm">
                <input type="checkbox" name="custom-screen-subject" value="História" class="w-5 h-5 text-amber-600 rounded focus:ring-0 cursor-pointer" checked>
                <div>
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <i class="fas fa-landmark text-amber-500"></i> História
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">Brasil, Geral & Contemporânea</span>
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

          <!-- Seção 2: Volume de Questões (Slider 5 a 50) -->
          <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">2</span>
                  Quantidade de Questões
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Defina quantas questões deseja resolver (de 5 até 50).</p>
              </div>
              <div class="bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 rounded-2xl text-center">
                <span id="screen-display-qtd-questoes" class="text-2xl font-black text-purple-700">15</span>
                <span class="text-xs font-bold block text-purple-500 uppercase">Questões</span>
              </div>
            </div>

            <!-- Slider Interativo -->
            <input type="range" id="screen-input-qtd-questoes" min="5" max="50" step="5" value="15" class="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600">

            <div class="flex justify-between text-[11px] font-bold text-slate-400 mt-3 uppercase tracking-wider">
              <span>5Q (Express)</span>
              <span>15Q</span>
              <span>25Q</span>
              <span>35Q</span>
              <span>50Q (Prova Completa)</span>
            </div>
          </div>

          <!-- Seção 3: Dificuldade & Prova de Origem -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Dificuldade -->
            <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <span class="w-6 h-6 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">3</span>
                Nível de Dificuldade
              </h3>
              <p class="text-xs text-slate-500 mb-6">Filtre a régua de corte das questões.</p>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label class="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all text-center has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-600 has-[:checked]:text-white">
                  <input type="radio" name="custom-screen-difficulty" value="Fácil" class="sr-only">
                  <i class="fas fa-smile text-sm mb-1"></i>
                  <span class="text-xs font-bold">Fácil</span>
                </label>

                <label class="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all text-center has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500 has-[:checked]:text-white">
                  <input type="radio" name="custom-screen-difficulty" value="Média" class="sr-only">
                  <i class="fas fa-meh text-sm mb-1"></i>
                  <span class="text-xs font-bold">Média</span>
                </label>

                <label class="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all text-center has-[:checked]:border-rose-600 has-[:checked]:bg-rose-600 has-[:checked]:text-white">
                  <input type="radio" name="custom-screen-difficulty" value="Difícil" class="sr-only">
                  <i class="fas fa-fire text-sm mb-1"></i>
                  <span class="text-xs font-bold">Difícil</span>
                </label>

                <label class="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all text-center has-[:checked]:border-black has-[:checked]:bg-slate-900 has-[:checked]:text-white">
                  <input type="radio" name="custom-screen-difficulty" value="all" class="sr-only" checked>
                  <i class="fas fa-layer-group text-sm mb-1"></i>
                  <span class="text-xs font-bold">Mista</span>
                </label>
              </div>
            </div>

            <!-- Tempo Limite -->
            <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                <span class="w-6 h-6 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">4</span>
                Tempo Limite
              </h3>
              <p class="text-xs text-slate-500 mb-6">Regule o cronômetro para treinar seu pace.</p>

              <select id="screen-select-tempo" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-black transition-colors">
                <option value="auto">Tempo Automático (3 min por questão)</option>
                <option value="15">15 Minutos (Modo Blitz)</option>
                <option value="30">30 Minutos (Treino Rápido)</option>
                <option value="60">1 Hora</option>
                <option value="120">2 Horas</option>
                <option value="240">4 Horas (Tempo Real da ETEC)</option>
                <option value="unlimited">Sem Cronômetro (Livre)</option>
              </select>
            </div>

          </div>

          <!-- Botão Gerar Simulado -->
          <div class="pt-4">
            <button type="submit" class="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-base transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3">
              <i class="fas fa-rocket text-lg"></i> Gerar Simulado Personalizado
            </button>
          </div>

        </form>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const slider = this.querySelector('#screen-input-qtd-questoes');
    const display = this.querySelector('#screen-display-qtd-questoes');
    const btnAll = this.querySelector('#btn-quick-all');
    const btnExatas = this.querySelector('#btn-quick-exatas');
    const btnHumanas = this.querySelector('#btn-quick-humanas');
    const btnBio = this.querySelector('#btn-quick-bio');
    const checkboxes = this.querySelectorAll('input[name="custom-screen-subject"]');

    if (slider && display) {
      slider.addEventListener('input', (e) => {
        display.textContent = e.target.value;
      });
    }

    const setSubjects = (list) => {
      checkboxes.forEach(cb => {
        cb.checked = list.includes(cb.value);
      });
    };

    if (btnAll) btnAll.addEventListener('click', () => setSubjects(['Português', 'Matemática', 'Biologia', 'Física', 'Química', 'História', 'Geografia']));
    if (btnExatas) btnExatas.addEventListener('click', () => setSubjects(['Matemática', 'Física', 'Química']));
    if (btnHumanas) btnHumanas.addEventListener('click', () => setSubjects(['História', 'Geografia', 'Português']));
    if (btnBio) btnBio.addEventListener('click', () => setSubjects(['Biologia', 'Química']));
  }
}

customElements.define('simulado-personalizado', SimuladoPersonalizado);
if (!customElements.get('simulado-custom')) {
  customElements.define('simulado-custom', class extends SimuladoPersonalizado {});
}
