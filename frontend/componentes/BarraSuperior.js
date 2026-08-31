class BarraSuperior extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="hidden md:flex justify-end items-center px-12 py-8 gap-4 shrink-0 w-full">
        <!-- Status de Conexão com o Servidor -->
        <div id="status-rede" class="flex items-center">
          <span class="text-xs text-slate-400 font-medium">Verificando rede...</span>
        </div>

        <!-- Cronômetro Global da Prova ETEC -->
        <div class="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-600 flex items-center">
          <i class="far fa-clock mr-2 text-slate-400"></i>
          Prova ETEC em: <span id="timer-days" class="text-black font-bold ml-1">... dias</span>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const targetDate = new Date('2026-12-06T13:30:00');
    const timerDays = this.querySelector('#timer-days');
    
    function updateTimer() {
      if (!timerDays) return;
      
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance < 0) {
        timerDays.textContent = '0 dias';
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      timerDays.textContent = `${days} dias`;
    }
    
    setInterval(updateTimer, 1000);
    updateTimer();
  }
}

// Registra os nomes do componente para compatibilidade total
customElements.define('barra-superior', BarraSuperior);
if (!customElements.get('app-topbar')) {
  customElements.define('app-topbar', class extends BarraSuperior {});
}
