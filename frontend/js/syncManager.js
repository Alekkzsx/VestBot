// ==========================================
// MODO ACAMPAMENTO (OFFLINE-FIRST)
// Gerenciamento de Banco Local e Sincronização
// ==========================================

// Configuração do IndexedDB usando Dexie.js
const db = new Dexie("VestBotDatabase");

// Schema do cofre local (espelhando os campos do MySQL)
db.version(2).stores({
  logs_questoes: '++id, questao_id, alternativa_marcada, acertou, tempo_gasto, data_resolucao, sync_status, sync_hash, simulado_id, ordem_resolucao'
});

const BACKEND_URL = 'http://localhost:3000'; // IP da Nave-Mãe

// Função para registrar uma questão resolvida no cofre local
async function registrarResolucaoLocal(questao_id, alternativa_marcada, acertou, tempo_gasto, simulado_id = null, ordem_resolucao = null) {
  try {
    const syncHash = `${questao_id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.logs_questoes.add({
      questao_id: questao_id,
      alternativa_marcada: alternativa_marcada,
      acertou: acertou,
      tempo_gasto: tempo_gasto,
      data_resolucao: new Date().toISOString(),
      sync_status: 'pendente',
      sync_hash: syncHash,
      simulado_id: simulado_id,
      ordem_resolucao: ordem_resolucao
    });
    console.log(`[Cofre Local] Resolução salva offline! Q:${questao_id} | Marcou:${alternativa_marcada}`);

    // Tenta sincronizar imediatamente, se falhar, fica guardado.
    tentarSincronizar();
  } catch (err) {
    console.error("[Cofre Local] Erro ao salvar log: ", err);
  }
}

// Função para tentar sincronizar com o Servidor (Fim de Semana)
async function tentarSincronizar() {
  try {
    // 1. Verifica se a Nave-Mãe está online
    const pingResponse = await fetch(`${BACKEND_URL}/api/ping`, { signal: AbortSignal.timeout(3000) });
    if (!pingResponse.ok) throw new Error('Servidor offline');

    // 2. Coleta tudo que está pendente no cofre local
    const pendentes = await db.logs_questoes.where('sync_status').equals('pendente').toArray();

    if (pendentes.length === 0) {
      atualizarUIRede(true, 0); // Online, nada a enviar
      return;
    }

    // 3. Envia o pacote gigante para o MySQL
    const syncResponse = await fetch(`${BACKEND_URL}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs_questoes: pendentes })
    });

    if (syncResponse.ok) {
      const resultado = await syncResponse.json();

      // 4. Limpa do cofre local os que foram aceitos
      const chaves = pendentes.map(log => log.id);
      await db.logs_questoes.bulkDelete(chaves);

      console.log(`[SYNC] 🎉 ${resultado.inseridos} logs sincronizados | ${resultado.duplicados} duplicados ignorados`);
      atualizarUIRede(true, 0);
    }

  } catch (error) {
    // A Nave-Mãe está offline (Modo de Segunda a Sexta)
    console.warn('[SYNC] Servidor Offline. Os dados estão seguros no cofre local.');

    const pendentesCount = await db.logs_questoes.where('sync_status').equals('pendente').count();
    atualizarUIRede(false, pendentesCount);
  }
}

// Atualiza o Status visual na interface
function atualizarUIRede(isOnline, itensPendentes) {
  const statusEl = document.getElementById('network-status');
  if (!statusEl) return;

  if (isOnline) {
    statusEl.innerHTML = `<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg border border-green-200 flex items-center gap-1"><i class="fas fa-wifi"></i> Servidor Online</span>`;
  } else {
    statusEl.innerHTML = `<span class="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg border border-orange-200 flex items-center gap-1 animate-pulse"><i class="fas fa-campground"></i> Modo Acampamento (${itensPendentes} salvos local)</span>`;
  }
}

// Tenta sincronizar a cada 30 segundos silenciosamente
setInterval(tentarSincronizar, 30000);

// Tenta sincronizar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  tentarSincronizar();
});

// Expondo a função para outras partes do sistema
window.registrarResolucaoLocal = registrarResolucaoLocal;
window.tentarSincronizar = tentarSincronizar;
