class AnalyticsPrediction extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
        
        <!-- Header do Card -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1.5">
                <i class="fas fa-brain"></i> Motor Preditivo IA
              </span>
              <span class="text-slate-400 text-xs font-medium">• Base histórica 2021-2025</span>
            </div>
            <h3 class="text-2xl font-black text-slate-900">Predição de Aprovação & Nota de Corte</h3>
          </div>

          <!-- Seletor de Curso e Câmpus -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <select id="select-campus" class="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl p-3 outline-none focus:border-black transition-colors">
              <option value="etec-vasco">ETEC Vasco A. Venchiarutti (Jundiaí)</option>
              <option value="etec-storani">ETEC Benedito Storani (Jundiaí)</option>
              <option value="ifsp-jundiai">IFSP Câmpus Jundiaí</option>
              <option value="etec-paulo-souza">ETEC São Paulo (Sede)</option>
            </select>

            <select id="select-course" class="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl p-3 outline-none focus:border-black transition-colors">
              <option value="ds" data-corte="35.0" data-demanda="8.4">Desenvolvimento de Sistemas</option>
              <option value="adm" data-corte="31.0" data-demanda="5.2">Administração</option>
              <option value="meca" data-corte="28.5" data-demanda="4.1">Mecânica</option>
              <option value="edif" data-corte="29.0" data-demanda="4.8">Edificações</option>
              <option value="quim" data-corte="33.0" data-demanda="6.3">Química</option>
            </select>
          </div>
        </div>

        <!-- Seção 2: Bônus de Pontuação Acrescida (Oficial ETEC) -->
        <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i class="fas fa-plus-circle text-emerald-600"></i> Sistema de Pontuação Acrescida (Bônus Oficial)
              </h4>
              <p class="text-xs text-slate-500 mt-0.5">Critérios estabelecidos pela portaria do Centro Paula Souza e IFSP.</p>
            </div>
            <div id="bonus-badge" class="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
              Bônus Aplicado: +13%
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-colors">
              <input type="checkbox" id="check-escola-publica" class="w-4 h-4 text-black rounded focus:ring-0 cursor-pointer" checked>
              <div>
                <span class="text-xs font-bold text-slate-800 block">Ensino Fundamental em Escola Pública</span>
                <span class="text-[10px] text-slate-500 font-medium">+10% sobre a pontuação bruta</span>
              </div>
            </label>

            <label class="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-colors">
              <input type="checkbox" id="check-afro" class="w-4 h-4 text-black rounded focus:ring-0 cursor-pointer" checked>
              <div>
                <span class="text-xs font-bold text-slate-800 block">Autodeclaração Étnica (Afrodescendente)</span>
                <span class="text-[10px] text-slate-500 font-medium">+3% sobre a pontuação bruta</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Seção 3: Termômetro & Comparativo de Pontos -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          <!-- Termômetro de Pontos -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex justify-between items-end">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sua Pontuação Final Ponderada</span>
                <div class="flex items-baseline gap-2">
                  <span id="display-nota-ponderada" class="text-4xl font-black text-black tracking-tight">42.4</span>
                  <span class="text-xs text-slate-400 font-bold">/ 50 pts <span class="text-emerald-600 font-semibold" id="display-nota-bruta">(Bruta: 37.5)</span></span>
                </div>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nota de Corte Histórica</span>
                <span id="display-nota-corte" class="text-2xl font-black text-slate-700">35.0 pts</span>
              </div>
            </div>

            <!-- Barra Termômetro com Marcador de Corte -->
            <div class="relative h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <!-- Barra de Progresso do Aluno -->
              <div id="bar-student-score" class="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-700" style="width: 84.8%;"></div>
              <!-- Linha de Corte Marcada -->
              <div id="marker-corte" class="absolute top-0 bottom-0 border-l-2 border-black border-dashed z-10 transition-all duration-700" style="left: 70%;" title="Linha de Corte">
                <span class="absolute -top-5 -translate-x-1/2 bg-black text-white text-[9px] font-bold px-1.5 py-0.2 rounded">Corte</span>
              </div>
            </div>

            <div class="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>0 pts</span>
              <span id="status-margem-seguranca" class="text-emerald-600 font-extrabold flex items-center gap-1">
                <i class="fas fa-shield-check"></i> Margem de Segurança: +7.4 pts acima do corte
              </span>
              <span>50 pts</span>
            </div>
          </div>

          <!-- Card de Probabilidade de Aprovação -->
          <div id="card-chance-container" class="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full relative overflow-hidden">
            <div class="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
            <div>
              <span class="text-emerald-100 text-xs font-bold uppercase tracking-wider block mb-1">Probabilidade Estimada</span>
              <h4 id="display-chance-percent" class="text-4xl font-black tracking-tight mb-2">92%</h4>
              <p id="display-chance-text" class="text-xs text-emerald-50 leading-relaxed font-medium">
                Sua pontuação atual está confortavelmente acima da nota de corte de Desenvolvimento de Sistemas.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-emerald-400/40 flex items-center justify-between text-xs text-emerald-100 font-bold">
              <span>Demanda: <strong class="text-white" id="display-demanda">8.4 c/v</strong></span>
              <span>Status: <strong class="text-white">Favorável</strong></span>
            </div>
          </div>

        </div>

      </div>
    `;
  }
}

customElements.define('analytics-prediction', AnalyticsPrediction);
