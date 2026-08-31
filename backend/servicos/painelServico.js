const { pool } = require('../config/banco');
const { inferirDisciplina, DISCIPLINAS_OFICIAIS } = require('../utilitarios/disciplinaHelper');

/**
 * Calcula todas as métricas consolidadas do Dashboard do usuário
 * @param {number} userId 
 * @param {string} periodo 'hoje' | '7d' | '30d' | 'all'
 * @param {string} disciplina 'all' | nome da disciplina
 * @returns {Promise<Object>}
 */
async function obterMetricasPainel(userId, periodo = '7d', disciplina = 'all') {
  // 1. Dados do Usuário
  const [userRows] = await pool.query(
    `SELECT u.id, u.nome, COALESCE(g.nivel_atual, 1) as nivel_atual, 
            COALESCE(g.xp_total, 0) as xp_total, COALESCE(g.ofensiva_dias, 0) as ofensiva_dias
     FROM usuarios u
     LEFT JOIN gamificacao g ON g.usuario_id = u.id
     WHERE u.id = ?`,
    [userId]
  );

  const usuario = userRows.length > 0 
    ? userRows[0] 
    : { id: userId, nome: 'Estudante', nivel_atual: 1, xp_total: 0, ofensiva_dias: 0 };

  // 2. Cláusula de Data
  let dateFilter = '';
  if (periodo === 'hoje') {
    dateFilter = ' AND data_hora >= CURDATE()';
  } else if (periodo === '7d') {
    dateFilter = ' AND data_hora >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
  } else if (periodo === '30d') {
    dateFilter = ' AND data_hora >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
  }

  // 3. Busca dos Logs
  const [logs] = await pool.query(
    `SELECT id, questao_id, alternativa_marcada, acertou, tempo_segundos, data_hora 
     FROM desempenho_questoes 
     WHERE usuario_id = ? ${dateFilter} 
     ORDER BY data_hora DESC`,
    [userId]
  );

  const logsFiltrados = disciplina === 'all' 
    ? logs 
    : logs.filter(l => inferirDisciplina(l.questao_id) === disciplina);

  const totalQuestoes = logsFiltrados.length;
  const acertos = logsFiltrados.filter(l => l.acertou === 1 || l.acertou === true).length;
  const erros = totalQuestoes - acertos;
  const acuracia = totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;

  // Cálculo de XP e Nível
  let xpCalculado = usuario.xp_total;
  if (xpCalculado === 0 && totalQuestoes > 0) {
    xpCalculado = (acertos * 15) + (erros * 5);
  }
  const nivelCalculado = Math.max(1, Math.floor(xpCalculado / 500) + 1);
  const xpNoNivelAtual = xpCalculado % 500;
  const xpMetaNivel = 500;
  const nivelPercentual = Math.round((xpNoNivelAtual / xpMetaNivel) * 100);

  // 4. Cálculo de Ofensiva / Sequência
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

  // 5. Frequência Semanal (Últimos 7 dias)
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

  // 6. Foco por Disciplina
  const focoPorDisciplina = {};
  DISCIPLINAS_OFICIAIS.forEach(d => focoPorDisciplina[d] = { total: 0, acertos: 0 });

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

  // 7. Atividades Recentes
  const atividadesRecentes = logsFiltrados.slice(0, 5).map(l => ({
    id: l.id,
    questao_id: l.questao_id,
    disciplina: inferirDisciplina(l.questao_id),
    acertou: l.acertou === 1 || l.acertou === true,
    tempo_segundos: l.tempo_segundos || 60,
    alternativa_marcada: l.alternativa_marcada || 'A',
    data_hora: l.data_hora
  }));

  // 8. Recomendação Inteligente (IA)
  const materiasComErro = focoArray.filter(f => f.total > 0).sort((a, b) => a.acuracia - b.acuracia);
  const recomendacao = materiasComErro.length > 0 ? {
    disciplina: materiasComErro[0].disciplina,
    motivo: `Acurácia de ${materiasComErro[0].acuracia}% (${materiasComErro[0].total - materiasComErro[0].acertos} erros registrados)`,
    link: '../telaSimulado/index.html'
  } : {
    disciplina: 'Interpretação & Exatas',
    motivo: 'Inicie um simulado para calibrar seu diagnóstico',
    link: '../telaSimulado/index.html'
  };

  return {
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
  };
}

/**
 * Calcula o progresso real dos desafios diários, semanais e badges do usuário
 * @param {number} userId 
 * @returns {Promise<Object>}
 */
async function obterDesafios(userId) {
  // Resoluções de hoje
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
  const acertosHoje = hojeLogs.filter(l => l.acertou === 1 || l.acertou === true).length;

  // Resoluções da semana
  const [semanaLogs] = await pool.query(
    `SELECT questao_id, acertou, tempo_segundos 
     FROM desempenho_questoes 
     WHERE usuario_id = ? AND data_hora >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
    [userId]
  );
  const totalSemana = semanaLogs.length;

  // Histórico geral para badges
  const [totalGeralRows] = await pool.query(
    `SELECT COUNT(*) as total, AVG(tempo_segundos) as pace_medio 
     FROM desempenho_questoes 
     WHERE usuario_id = ?`,
    [userId]
  );
  const totalGeral = totalGeralRows[0]?.total || 0;
  const paceMedio = Math.round(totalGeralRows[0]?.pace_medio || 0);

  // Ofensiva
  const [userRows] = await pool.query(
    `SELECT COALESCE(ofensiva_dias, 0) as ofensiva_dias FROM gamificacao WHERE usuario_id = ?`,
    [userId]
  );
  const streak = userRows[0]?.ofensiva_dias || (totalHoje > 0 ? 1 : 0);

  return {
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
        progresso: Math.min(2, acertosHoje),
        meta: 2,
        concluido: acertosHoje >= 2,
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
  };
}

module.exports = {
  obterMetricasPainel,
  obterDesafios
};
