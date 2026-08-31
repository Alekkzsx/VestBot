const path = require('path');
// Carrega .env da raiz do projeto ou da pasta backend
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Permitir payloads grandes (sincronização em lote)

// ==========================================
// Database Configuration
// ==========================================
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vestbot_db'
};

// Pool de conexões (mais eficiente que conexão única)
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

// ==========================================
// ROTAS DE SAÚDE
// ==========================================

// Ping: O frontend usa para saber se a Nave-Mãe está online
app.get('/api/ping', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// ==========================================
// ROTA DE SINCRONIZAÇÃO (OFFLINE-FIRST)
// ==========================================

app.post('/api/sync', async (req, res) => {
  const { logs_questoes } = req.body;

  if (!logs_questoes || !Array.isArray(logs_questoes) || logs_questoes.length === 0) {
    return res.status(400).json({ error: 'Nenhum log para sincronizar.' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let inseridos = 0;
    let duplicados = 0;

    for (const log of logs_questoes) {
      try {
        // Gera sync_hash único baseado nos dados do log
        const syncHash = log.sync_hash || `${log.questao_id}_${log.data_resolucao}_${Date.now()}`;

        await connection.query(
          `INSERT INTO desempenho_questoes 
           (usuario_id, questao_id, simulado_id, ordem_resolucao, alternativa_marcada, acertou, tempo_segundos, data_hora, sync_hash) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            log.usuario_id || 1, // Default: Davi (ID 1)
            log.questao_id,
            log.simulado_id || null,
            log.ordem_resolucao || null,
            log.alternativa_marcada || null,
            log.acertou ? 1 : 0,
            log.tempo_gasto || log.tempo_segundos || 0,
            log.data_resolucao || log.data_hora || new Date().toISOString(),
            syncHash
          ]
        );
        inseridos++;
      } catch (insertErr) {
        if (insertErr.code === 'ER_DUP_ENTRY') {
          // Log já sincronizado anteriormente — ignora silenciosamente
          duplicados++;
        } else if (insertErr.code === 'ER_NO_REFERENCED_ROW_2') {
          // questao_id não existe no banco ainda — pula
          console.warn(`[SYNC] Questão "${log.questao_id}" não existe no banco. Pulando.`);
        } else {
          throw insertErr;
        }
      }
    }

    await connection.commit();

    console.log(`[SYNC] ✅ ${inseridos} logs inseridos | ${duplicados} duplicados ignorados`);

    res.json({
      status: 'ok',
      inseridos,
      duplicados,
      total_recebido: logs_questoes.length
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('[SYNC] ❌ Erro na sincronização:', error.message);
    res.status(500).json({ error: 'Erro interno na sincronização.' });
  } finally {
    if (connection) connection.release();
  }
});

// ==========================================
// ROTAS DE DADOS (APIs para o Frontend)
// ==========================================

// Buscar dados do usuário (Dashboard)
app.get('/api/usuario/:id', async (req, res) => {
  try {
    const [usuario] = await pool.query(
      `SELECT u.*, g.nivel_atual, g.xp_total, g.ofensiva_dias
       FROM usuarios u
       LEFT JOIN gamificacao g ON g.usuario_id = u.id
       WHERE u.id = ?`,
      [req.params.id]
    );
    if (usuario.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar próxima prova (Topbar timer)
app.get('/api/proxima-prova', async (req, res) => {
  try {
    const [prova] = await pool.query(
      `SELECT * FROM datas_oficiais_provas WHERE data_prova > NOW() ORDER BY data_prova ASC LIMIT 1`
    );
    if (prova.length === 0) return res.json({ prova: null });
    res.json(prova[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 VestBot Backend rodando na porta ${PORT}`);
  console.log(`   Nave-Mãe acessível em: http://localhost:${PORT}`);
  console.log(`   Ping: http://localhost:${PORT}/api/ping`);
  console.log(`   Sync: POST http://localhost:${PORT}/api/sync\n`);
});
