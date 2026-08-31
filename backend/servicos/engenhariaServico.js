const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const configConexao = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vestbot_db'
};

async function adicionarQuestao(dados) {
  let conexao;
  try {
    conexao = await mysql.createConnection(configConexao);
    await conexao.beginTransaction(); // Inicia transação segura

    let textoBaseId = null;

    // Se for interpretação, precisa salvar o texto base primeiro
    if (dados.isInterpretacao && dados.textoBaseConteudo) {
      const [textoResult] = await conexao.query(
        `INSERT INTO textos_base (titulo, conteudo_completo, fonte) VALUES (?, ?, ?)`,
        [
          dados.textoBaseTitulo || 'Sem Título',
          dados.textoBaseConteudo,
          dados.fonteProva
        ]
      );
      textoBaseId = textoResult.insertId;
    } else if (dados.textoBaseIdExistente) {
      // Caso o front mande o ID de um texto que já existe
      textoBaseId = dados.textoBaseIdExistente;
    }

    // Preparar JSON das alternativas
    const alternativasJson = JSON.stringify(dados.alternativas);
    
    // Gerar um ID único para a questão (ex: Q_ETEC_2024_0123)
    const ano = dados.anoProva || new Date().getFullYear();
    const idQuestao = `Q_${dados.fonteProva || 'GEN'}_${ano}_${Math.floor(Math.random() * 100000)}`;

    // Inserir Questão
    await conexao.query(
      `INSERT INTO questoes 
      (id, texto_base_id, disciplina, assunto, dificuldade, enunciado_texto, alternativas_json, alternativa_correta, explicacao_resolucao, fonte_prova, ano_prova) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idQuestao,
        textoBaseId, // Pode ser null se for simulado direto
        dados.disciplina,
        dados.assunto,
        dados.dificuldade,
        dados.enunciado,
        alternativasJson,
        dados.alternativaCorreta,
        dados.explicacaoResolucao || '',
        dados.fonteProva,
        dados.anoProva
      ]
    );

    await conexao.commit(); // Efetiva a transação

    return {
      sucesso: true,
      mensagem: "Questão salva com sucesso!",
      questaoId: idQuestao,
      textoBaseId: textoBaseId
    };

  } catch (erro) {
    if (conexao) await conexao.rollback(); // Desfaz tudo se der erro
    console.error("Erro no engenhariaServico:", erro);
    throw erro;
  } finally {
    if (conexao) await conexao.end();
  }
}

module.exports = {
  adicionarQuestao
};
