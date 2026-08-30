const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration
// Ajuste com suas credenciais do MySQL Workbench
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password', // TODO: Troque para sua senha real
  database: 'vestbot_db'
};

let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log('Conexão com MySQL Pool criada.');
} catch (error) {
  console.error('Erro ao conectar com MySQL:', error);
}

// Endpoint de Status (Para o Frontend checar se a "Nave-Mãe" está online)
app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Servidor principal online!' });
});

// Endpoint de Sincronização (Recebe o cofre local da semana)
app.post('/api/sync', async (req, res) => {
  const { logs_questoes } = req.body;
  
  if (!logs_questoes || logs_questoes.length === 0) {
    return res.status(200).json({ message: 'Nenhum dado novo para sincronizar.' });
  }

  try {
    // Inicia a transação (se uma der erro, cancela todas para não corromper)
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Exemplo: iterando sobre os logs acumulados e inserindo no banco
      // Aqui você criará o SQL baseado na tabela real. 
      // Por enquanto vamos apenas simular sucesso para provar a arquitetura.
      
      console.log(`[SYNC] Recebidos ${logs_questoes.length} logs acumulados offline.`);
      
      // for (const log of logs_questoes) {
      //   await connection.execute(
      //     'INSERT INTO historico_questoes (questao_id, acertou, tempo_gasto, data_resolucao) VALUES (?, ?, ?, ?)',
      //     [log.questao_id, log.acertou, log.tempo, log.data]
      //   );
      // }

      await connection.commit();
      connection.release();
      
      res.status(200).json({ success: true, message: `Sincronização de ${logs_questoes.length} itens concluída com sucesso no MySQL!` });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }

  } catch (error) {
    console.error('[SYNC ERROR]', error);
    res.status(500).json({ success: false, error: 'Falha grave na sincronização com o banco.' });
  }
});

// Inicia o Servidor
app.listen(PORT, () => {
  console.log(`🚀 VestBot Backend (Nave-Mãe) rodando em http://localhost:${PORT}`);
});
