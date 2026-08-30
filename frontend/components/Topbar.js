class AppTopbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="hidden md:flex justify-end items-center px-12 py-8 gap-4 shrink-0 w-full">
        <!-- Network Status -->
        <div id="network-status" class="flex items-center">
          <span class="text-xs text-slate-400 font-medium">Verificando rede...</span>
        </div>

        <!-- Global Timer -->
        <div class="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-600 flex items-center">
          <i class="far fa-clock mr-2 text-slate-400"></i>
          Prova em: <span id="timer-days" class="text-black font-bold ml-1">... dias</span>
        </div>

        <!-- Notification Bell -->
        <button class="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-black hover:scale-105 transition-all relative group">
          <i class="far fa-bell text-lg"></i>
          <span class="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          <div class="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 shadow-xl rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-left">
            <p class="text-xs font-bold text-slate-900 mb-1">Notificações</p>
            <p class="text-[10px] text-slate-500">Em breve você receberá alertas sobre datas de inscrição e dicas diárias aqui.</p>
          </div>
        </button>
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

customElements.define('app-topbar', AppTopbar);
