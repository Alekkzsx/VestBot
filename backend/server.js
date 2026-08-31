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

// Helper para inferir disciplina pelo questao_id caso não haja join
function inferirDisciplina(questaoId) {
  if (!questaoId) return 'Geral';
  const q = questaoId.toUpperCase();
  if (q.includes('PORT') || q.includes('LING')) return 'Português';
  if (q.includes('MAT') || q.includes('GEOM')) return 'Matemática';
  if (q.includes('BIO') || q.includes('ECO')) return 'Biologia';
  if (q.includes('FIS') || q.includes('OND')) return 'Física';
  if (q.includes('QUI') || q.includes('REA')) return 'Química';
  if (q.includes('HIST') || q.includes('VARGAS')) return 'História';
  if (q.includes('GEO') || q.includes('BIOMA')) return 'Geografia';
  return 'Geral';
}

// 1. Dashboard Completo com Filtros (Período & Disciplina)
app.get('/api/dashboard/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10) || 1;
  const { periodo = '7d', disciplina = 'all' } = req.query;

  try {
    // 1.1 Dados do Usuário e Gamificação
    const [userRows] = await pool.query(
      `SELECT u.id, u.nome, COALESCE(g.nivel_atual, 1) as nivel_atual, 
              COALESCE(g.xp_total, 0) as xp_total, COALESCE(g.ofensiva_dias, 0) as ofensiva_dias
       FROM usuarios u
       LEFT JOIN gamificacao g ON g.usuario_id = u.id
       WHERE u.id = ?`,
      [userId]
    );

    const usuario = userRows.length > 0 ? userRows[0] : { id: userId, nome: 'Estudante', nivel_atual: 1, xp_total: 0, ofensiva_dias: 0 };

    // 1.2 Monta cláusula WHERE de data
    let dateFilter = '';
    const queryParams = [userId];

    if (periodo === 'hoje') {
      dateFilter = ' AND data_hora >= CURDATE()';
    } else if (periodo === '7d') {
      dateFilter = ' AND data_hora >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (periodo === '30d') {
      dateFilter = ' AND data_hora >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    }

    // 1.3 Busca todos os logs do período para cálculos agregados
    const [logs] = await pool.query(
      `SELECT id, questao_id, alternativa_marcada, acertou, tempo_segundos, data_hora 
       FROM desempenho_questoes 
       WHERE usuario_id = ? ${dateFilter} 
       ORDER BY data_hora DESC`,
      queryParams
    );

    // Filtra disciplina se solicitada
    const filteredLogs = disciplina === 'all' 
      ? logs 
      : logs.filter(l => inferirDisciplina(l.questao_id) === disciplina);

    const totalQuestoes = filteredLogs.length;
    const acertos = filteredLogs.filter(l => l.acertou === 1 || l.acertou === true).length;
    const erros = totalQuestoes - acertos;
    const acuracia = totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;

    // Cálculo dinâmico de XP se tabela gamificação estiver com 0
    let xpCalculado = usuario.xp_total;
    if (xpCalculado === 0 && totalQuestoes > 0) {
      xpCalculado = (acertos * 15) + (erros * 5);
    }
    const nivelCalculado = Math.max(1, Math.floor(xpCalculado / 500) + 1);
    const xpNoNivelAtual = xpCalculado % 500;
    const xpMetaNivel = 500;
    const nivelPercentual = Math.round((xpNoNivelAtual / xpMetaNivel) * 100);

    // 1.4 Cálculo de Ofensiva / Sequência (dias consecutivos)
    const [diasRows] = await pool.query(
      `SELECT DISTINCT DATE(data_hora) as data_dia 
       FROM desempenho_questoes 
       WHERE usuario_id = ? 
       ORDER BY data_dia DESC`,
      [userId]
    );

    let streak = 0;
    if (diasRows.length > 0) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      let dataEsperada = new Date(hoje);
      const primeiraData = new Date(diasRows[0].data_dia);
      primeiraData.setHours(0, 0, 0, 0);

      // Se a última atividade foi hoje ou ontem, conta a streak
      const diffDiasHoje = Math.round((hoje - primeiraData) / (1000 * 60 * 60 * 24));
      if (diffDiasHoje <= 1) {
        dataEsperada = primeiraData;
        for (const row of diasRows) {
          const dataRow = new Date(row.data_dia);
          dataRow.setHours(0, 0, 0, 0);
          const diff = Math.round((dataEsperada - dataRow) / (1000 * 60 * 60 * 24));
          if (diff === 0) {
            streak++;
            dataEsperada.setDate(dataEsperada.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    // 1.5 Frequência dos Últimos 7 Dias (Segunda a Domingo)
    const diasSemanaNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const frequenciaUltimos7Dias = [];
    const hojeObj = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(hojeObj.getDate() - i);
      const dataStr = d.toISOString().split('T')[0];
      const diaSemanaLabel = diasSemanaNomes[d.getDay()];

      const count = logs.filter(l => {
        const logDate = new Date(l.data_hora).toISOString().split('T')[0];
        return logDate === dataStr;
      }).length;

      frequenciaUltimos7Dias.push({
        dia: diaSemanaLabel,
        data: dataStr,
        count
      });
    }

    const maxCountSemana = Math.max(...frequenciaUltimos7Dias.map(f => f.count), 1);
    frequenciaUltimos7Dias.forEach(f => {
      f.percent = f.count > 0 ? Math.max(20, Math.round((f.count / maxCountSemana) * 100)) : 8;
    });

    // 1.6 Foco por Disciplina (% de questões feitas)
    const disciplinasBase = ['Português', 'Matemática', 'Biologia', 'Física', 'Química', 'História', 'Geografia'];
    const focoPorDisciplina = {};
    disciplinasBase.forEach(d => focoPorDisciplina[d] = { total: 0, acertos: 0 });

    logs.forEach(l => {
      const disc = inferirDisciplina(l.questao_id);
      if (!focoPorDisciplina[disc]) focoPorDisciplina[disc] = { total: 0, acertos: 0 };
      focoPorDisciplina[disc].total++;
      if (l.acertou === 1 || l.acertou === true) focoPorDisciplina[disc].acertos++;
    });

    const focoArray = Object.keys(focoPorDisciplina).map(disc => {
      const info = focoPorDisciplina[disc];
      const percent = totalQuestoes > 0 ? Math.round((info.total / totalQuestoes) * 100) : 0;
      const acuraciaMat = info.total > 0 ? Math.round((info.acertos / info.total) * 100) : 0;
      return {
        disciplina: disc,
        total: info.total,
        acertos: info.acertos,
        percent,
        acuracia: acuraciaMat
      };
    }).sort((a, b) => b.total - a.total);

    // 1.7 Atividades Recentes (Últimas 5)
    const atividadesRecentes = filteredLogs.slice(0, 5).map(l => ({
      id: l.id,
      questao_id: l.questao_id,
      disciplina: inferirDisciplina(l.questao_id),
      acertou: l.acertou === 1 || l.acertou === true,
      tempo_segundos: l.tempo_segundos || 60,
      alternativa_marcada: l.alternativa_marcada || 'A',
      data_hora: l.data_hora
    }));

    // 1.8 Recomendação Inteligente (IA) - Matéria mais fraca ou com menos foco
    const materiasComErro = focoArray.filter(f => f.total > 0).sort((a, b) => a.acuracia - b.acuracia);
    const recomendacao = materiasComErro.length > 0 ? {
      disciplina: materiasComErro[0].disciplina,
      motivo: `Acurácia de ${materiasComErro[0].acuracia}% (${materiasComErro[0].total - materiasComErro[0].acertos} erros registrados)`,
      link: `../telaSimulado/index.html`
    } : {
      disciplina: 'Interpretação & Exatas',
      motivo: 'Inicie um simulado para calibrar seu diagnóstico',
      link: `../telaSimulado/index.html`
    };

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        nivel: nivelCalculado,
        xp: xpCalculado,
        xpNoNivel: xpNoNivelAtual,
        xpMetaNivel: xpMetaNivel,
        nivelPercentual,
        streak: Math.max(streak, usuario.ofensiva_dias || 0)
      },
      filtros: { periodo, disciplina },
      metricas: {
        totalQuestoes,
        acertos,
        erros,
        acuracia
      },
      frequenciaSemanal: frequenciaUltimos7Dias,
      focoDisciplinas: focoArray,
      atividadesRecentes,
      recomendacao
    });

  } catch (err) {
    console.error('[DASHBOARD] Erro ao carregar métricas:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Central de Desafios & Missões Dinâmicas
app.get('/api/desafios/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10) || 1;

  try {
    // 2.1 Resoluções de hoje
    const [hojeLogs] = await pool.query(
      `SELECT questao_id, acertou, tempo_segundos 
       FROM desempenho_questoes 
       WHERE usuario_id = ? AND data_hora >= CURDATE()`,
      [userId]
    );

    const totalHoje = hojeLogs.length;
    const exatasHoje = hojeLogs.filter(l => {
      const disc = inferirDisciplina(l.questao_id);
      return ['Matemática', 'Física', 'Química'].includes(disc) && (l.acertou === 1 || l.acertou === true);
    }).length;
    const errosRevisadosHoje = hojeLogs.filter(l => l.acertou === 1 || l.acertou === true).length;

    // 2.2 Resoluções da semana (últimos 7 dias)
    const [semanaLogs] = await pool.query(
      `SELECT questao_id, acertou, tempo_segundos 
       FROM desempenho_questoes 
       WHERE usuario_id = ? AND data_hora >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      [userId]
    );
    const totalSemana = semanaLogs.length;

    // 2.3 Total histórico para badges
    const [totalGeralRows] = await pool.query(
      `SELECT COUNT(*) as total, AVG(tempo_segundos) as pace_medio 
       FROM desempenho_questoes 
       WHERE usuario_id = ?`,
      [userId]
    );
    const totalGeral = totalGeralRows[0]?.total || 0;
    const paceMedio = Math.round(totalGeralRows[0]?.pace_medio || 0);

    // 2.4 Ofensiva
    const [userRows] = await pool.query(
      `SELECT COALESCE(ofensiva_dias, 0) as ofensiva_dias FROM gamificacao WHERE usuario_id = ?`,
      [userId]
    );
    const streak = userRows[0]?.ofensiva_dias || (totalHoje > 0 ? 1 : 0);

    res.json({
      diarias: [
        {
          id: 'daily-streak',
          titulo: 'Manter a Ofensiva',
          descricao: 'Entre no app e resolva ao menos 1 questão hoje.',
          icone: 'fa-fire',
          cor: 'emerald',
          progresso: Math.min(1, totalHoje),
          meta: 1,
          concluido: totalHoje >= 1,
          recompensaXp: 100
        },
        {
          id: 'daily-exatas',
          titulo: 'Treino de Exatas',
          descricao: 'Acerte 5 questões de Matemática, Física ou Química.',
          icone: 'fa-calculator',
          cor: 'blue',
          progresso: Math.min(5, exatasHoje),
          meta: 5,
          concluido: exatasHoje >= 5,
          recompensaXp: 250
        },
        {
          id: 'daily-erros',
          titulo: 'Superar o Passado',
          descricao: 'Resolva 2 questões com acerto para consolidar a matéria.',
          icone: 'fa-rotate-left',
          cor: 'rose',
          progresso: Math.min(2, errosRevisadosHoje),
          meta: 2,
          concluido: errosRevisadosHoje >= 2,
          recompensaXp: 150
        }
      ],
      semanais: [
        {
          id: 'weekly-maratona',
          titulo: 'Maratona ETEC: 50 Questões',
          descricao: 'Resolva 50 questões durante a semana para simular uma prova inteira.',
          icone: 'fa-chess-knight',
          cor: 'purple',
          progresso: Math.min(50, totalSemana),
          meta: 50,
          concluido: totalSemana >= 50,
          recompensaXp: 500
        }
      ],
      badges: [
        {
          id: 'badge-primeiro-passo',
          titulo: 'Primeiro Passo',
          descricao: 'Fazer sua primeira questão',
          emoji: '🥇',
          conquistado: totalGeral >= 1,
          progressoTexto: `${Math.min(1, totalGeral)}/1`
        },
        {
          id: 'badge-foco',
          titulo: 'Foco Inabalável',
          descricao: 'Alcançar 3 dias de ofensiva',
          emoji: '🔥',
          conquistado: streak >= 3,
          progressoTexto: `${Math.min(3, streak)}/3 dias`
        },
        {
          id: 'badge-centuriao',
          titulo: 'Centurião',
          descricao: 'Resolver 100 questões',
          emoji: '🛡️',
          conquistado: totalGeral >= 100,
          progressoTexto: `${Math.min(100, totalGeral)}/100`
        },
        {
          id: 'badge-pace',
          titulo: 'Gênio do Pace',
          descricao: 'Média menor que 2m por questão',
          emoji: '⚡',
          conquistado: paceMedio > 0 && paceMedio <= 120 && totalGeral >= 5,
          progressoTexto: paceMedio > 0 ? `${paceMedio}s` : '--'
        }
      ]
    });

  } catch (err) {
    console.error('[DESAFIOS] Erro ao carregar desafios:', err.message);
    res.status(500).json({ error: err.message });
  }
});

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
