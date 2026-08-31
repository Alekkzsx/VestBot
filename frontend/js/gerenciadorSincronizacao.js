// ==========================================
// MODO ACAMPAMENTO (OFFLINE-FIRST)
// Gerenciamento de Banco Local (Dexie.js) e Sincronização
// ==========================================

const db = new Dexie("VestBotDatabase");

// Schema do cofre local no navegador
db.version(2).stores({
  logs_questoes: '++id, questao_id, alternativa_marcada, acertou, tempo_gasto, data_resolucao, sync_status, sync_hash, simulado_id, ordem_resolucao'
});

const URL_BACKEND = 'http://localhost:3000';

/**
 * Registra a resolução de uma questão no cofre local IndexedDB
 */
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
    console.log(`[Cofre Local] Salvo offline: Q:${questao_id} | Marcou:${alternativa_marcada}`);

    tentarSincronizar();
  } catch (err) {
    console.error("[Cofre Local] Erro ao salvar resolução: ", err);
  }
}

/**
 * Tenta sincronizar os dados pendentes com a Nave-Mãe (Backend)
 */
async function tentarSincronizar() {
  try {
    const pingResponse = await fetch(`${URL_BACKEND}/api/ping`, { signal: AbortSignal.timeout(3000) });
    if (!pingResponse.ok) throw new Error('Servidor offline');

    const pendentes = await db.logs_questoes.where('sync_status').equals('pendente').toArray();

    if (pendentes.length === 0) {
      atualizarUIRede(true, 0);
      return;
    }

    const syncResponse = await fetch(`${URL_BACKEND}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs_questoes: pendentes })
    });

    if (syncResponse.ok) {
      const resultado = await syncResponse.json();
      const chaves = pendentes.map(log => log.id);
      await db.logs_questoes.bulkDelete(chaves);

      console.log(`[SYNC] 🎉 ${resultado.inseridos} logs sincronizados | ${resultado.duplicados} duplicados ignorados`);
      atualizarUIRede(true, 0);
    }

  } catch (error) {
    console.warn('[SYNC] Servidor Offline. Modo Acampamento ativado.');
    try {
      const pendentesCount = await db.logs_questoes.where('sync_status').equals('pendente').count();
      atualizarUIRede(false, pendentesCount);
    } catch (e) {
      atualizarUIRede(false, 0);
    }
  }
}

function atualizarUIRede(isOnline, itensPendentes) {
  const statusEl = document.getElementById('network-status') || document.getElementById('status-rede');
  if (!statusEl) return;

  if (isOnline) {
    statusEl.innerHTML = `<span class="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-green-200 flex items-center gap-1.5"><i class="fas fa-wifi"></i> Nave-Mãe Online</span>`;
  } else {
    statusEl.innerHTML = `<span class="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-orange-200 flex items-center gap-1.5 animate-pulse"><i class="fas fa-campground"></i> Modo Acampamento (${itensPendentes} salvos)</span>`;
  }
}

// Sincronização periódica a cada 30 segundos
setInterval(tentarSincronizar, 30000);

document.addEventListener('DOMContentLoaded', () => {
  tentarSincronizar();
});

// Exporta globalmente
window.registrarResolucaoLocal = registrarResolucaoLocal;
window.tentarSincronizar = tentarSincronizar;
window.db = db;
