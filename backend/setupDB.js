const mysql = require('mysql2/promise');

const connectionConfig = {
  host: '127.0.0.1',
  user: 'Davi-01',
  password: '495321',
};

async function setupDatabase() {
  let connection;
  try {
    console.log('🔌 Conectando ao MySQL (Davi-01)...');
    connection = await mysql.createConnection(connectionConfig);

    // ============================
    // CRIAÇÃO DO BANCO DE DADOS
    // ============================
    console.log('📦 Criando banco de dados vestbot_db...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS vestbot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE vestbot_db;`);

    // ============================
    // 1. DOMÍNIO: USUÁRIO & ENGAJAMENTO
    // ============================

    console.log('👤 Criando tabela USUARIOS...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    console.log('🎮 Criando tabela GAMIFICACAO...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS gamificacao (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL UNIQUE,
        nivel_atual INT DEFAULT 1,
        xp_total INT DEFAULT 0,
        ofensiva_dias INT DEFAULT 0,
        ultima_atividade DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log('⏱️ Criando tabela SESSOES_ESTUDO...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sessoes_estudo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        data_inicio DATETIME NOT NULL,
        data_fim DATETIME DEFAULT NULL,
        minutos_foco INT DEFAULT 0,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log('🏆 Criando tabela DESAFIOS...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS desafios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        descricao TEXT,
        tipo_frequencia ENUM('Diário', 'Semanal', 'Único') NOT NULL DEFAULT 'Único',
        condicao_tecnica VARCHAR(100),
        meta_quantidade INT DEFAULT 1,
        recompensa_xp INT DEFAULT 0
      ) ENGINE=InnoDB;
    `);

    console.log('🏆 Criando tabela DESAFIOS_USUARIO...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS desafios_usuario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        desafio_id INT NOT NULL,
        progresso_atual INT DEFAULT 0,
        concluido BOOLEAN DEFAULT FALSE,
        data_conclusao DATETIME DEFAULT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (desafio_id) REFERENCES desafios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log('🔔 Criando tabela NOTIFICACOES...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notificacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        tipo VARCHAR(50) NOT NULL DEFAULT 'ALERTA',
        mensagem TEXT NOT NULL,
        lida BOOLEAN DEFAULT FALSE,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // ============================
    // 2. DOMÍNIO: ENSINO & REVISÃO
    // ============================

    console.log('🎬 Criando tabela VIDEOS_AULAS...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS videos_aulas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        disciplina VARCHAR(100) NOT NULL,
        titulo_aula VARCHAR(255) NOT NULL,
        descricao TEXT,
        url_video VARCHAR(500),
        duracao_minutos INT DEFAULT 0
      ) ENGINE=InnoDB;
    `);

    console.log('📄 Criando tabela CONTEUDOS_TEXTUAIS...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS conteudos_textuais (
        id INT AUTO_INCREMENT PRIMARY KEY,
        disciplina VARCHAR(100) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        tipo ENUM('Apostila', 'Resumo', 'Mapa_Mental', 'Flashcard') NOT NULL DEFAULT 'Resumo',
        url_arquivo VARCHAR(500),
        qtd_paginas INT DEFAULT NULL
      ) ENGINE=InnoDB;
    `);

    console.log('📊 Criando tabela CONSUMO_ENSINO...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS consumo_ensino (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        video_id INT DEFAULT NULL,
        conteudo_id INT DEFAULT NULL,
        concluido BOOLEAN DEFAULT FALSE,
        percentual_assistido INT DEFAULT 0,
        data_consumo DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (video_id) REFERENCES videos_aulas(id) ON DELETE SET NULL,
        FOREIGN KEY (conteudo_id) REFERENCES conteudos_textuais(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    console.log('🔁 Criando tabela REVISOES_AGENDADAS...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS revisoes_agendadas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        video_id INT DEFAULT NULL,
        conteudo_id INT DEFAULT NULL,
        assunto VARCHAR(200),
        data_programada DATETIME NOT NULL,
        tipo_intervalo VARCHAR(20) DEFAULT '24h',
        status_concluida BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (video_id) REFERENCES videos_aulas(id) ON DELETE SET NULL,
        FOREIGN KEY (conteudo_id) REFERENCES conteudos_textuais(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    // ============================
    // 3. DOMÍNIO: AVALIAÇÃO (CORAÇÃO ANALÍTICO)
    // ============================

    console.log('📝 Criando tabela TEXTOS_BASE...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS textos_base (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255),
        conteudo_completo TEXT NOT NULL,
        fonte VARCHAR(100)
      ) ENGINE=InnoDB;
    `);

    console.log('❓ Criando tabela QUESTOES...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS questoes (
        id VARCHAR(50) PRIMARY KEY,
        texto_base_id INT DEFAULT NULL,
        disciplina VARCHAR(100) NOT NULL,
        assunto VARCHAR(100) NOT NULL,
        dificuldade ENUM('Fácil', 'Médio', 'Difícil') NOT NULL DEFAULT 'Médio',
        interdisciplinar BOOLEAN DEFAULT FALSE,
        tamanho_linhas INT DEFAULT 1,
        enunciado_texto TEXT NOT NULL,
        imagem_url VARCHAR(500) DEFAULT NULL,
        alternativas_json JSON NOT NULL,
        alternativa_correta CHAR(1) NOT NULL,
        explicacao_resolucao TEXT,
        pace_alvo_segundos INT DEFAULT 180,
        fonte_prova VARCHAR(100),
        ano_prova INT,
        FOREIGN KEY (texto_base_id) REFERENCES textos_base(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    console.log('📋 Criando tabela SIMULADOS_REALIZADOS...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS simulados_realizados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        tipo_simulado ENUM('Rápido', 'Oficial_ETEC', 'Oficial_IFSP') NOT NULL DEFAULT 'Rápido',
        total_questoes INT NOT NULL,
        nota_final INT DEFAULT 0,
        tempo_total_segundos INT DEFAULT 0,
        ponto_de_fadiga_indice INT DEFAULT NULL,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log('📈 Criando tabela DESEMPENHO_QUESTOES...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS desempenho_questoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        questao_id VARCHAR(50) NOT NULL,
        simulado_id INT DEFAULT NULL,
        ordem_resolucao INT DEFAULT NULL,
        alternativa_marcada CHAR(1),
        acertou BOOLEAN NOT NULL,
        tempo_segundos INT DEFAULT 0,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
        sync_hash VARCHAR(100) UNIQUE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (questao_id) REFERENCES questoes(id) ON DELETE CASCADE,
        FOREIGN KEY (simulado_id) REFERENCES simulados_realizados(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    console.log('⚡ Criando tabela PACE_ANALITICO_USUARIO...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pace_analitico_usuario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        disciplina VARCHAR(100) NOT NULL,
        pace_medio_segundos INT DEFAULT 0,
        acuracia_media DECIMAL(5,4) DEFAULT 0.0000,
        ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // ============================
    // 4. DOMÍNIO: PLANEJAMENTO & PRAZOS
    // ============================

    console.log('📅 Criando tabela CRONOGRAMA_PESSOAL...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cronograma_pessoal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        titulo_evento VARCHAR(255) NOT NULL,
        materia VARCHAR(100) DEFAULT NULL,
        data_marcada DATETIME NOT NULL,
        duracao_estimada VARCHAR(50) DEFAULT NULL,
        concluido BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log('🎯 Criando tabela DATAS_OFICIAIS_PROVAS...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS datas_oficiais_provas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        instituicao VARCHAR(100) NOT NULL,
        descricao VARCHAR(255),
        curso_alvo VARCHAR(200),
        data_prova DATETIME NOT NULL,
        nota_corte_media INT DEFAULT NULL
      ) ENGINE=InnoDB;
    `);

    // ============================
    // ÍNDICES DE PERFORMANCE
    // ============================
    console.log('🔍 Criando índices de performance...');

    // Índices para QUESTOES (milhares de questões)
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_questoes_disciplina_assunto ON questoes (disciplina, assunto);`).catch(() => {});
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_questoes_dificuldade ON questoes (dificuldade);`).catch(() => {});
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_questoes_fonte_ano ON questoes (fonte_prova, ano_prova);`).catch(() => {});

    // Índices para DESEMPENHO_QUESTOES (tabela mais pesada)
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_desemp_usuario_data ON desempenho_questoes (usuario_id, data_hora);`).catch(() => {});
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_desemp_simulado ON desempenho_questoes (simulado_id);`).catch(() => {});

    // Índices para CONSUMO_ENSINO
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_consumo_usuario_video ON consumo_ensino (usuario_id, video_id);`).catch(() => {});

    // Índices para REVISOES_AGENDADAS
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_revisoes_pendentes ON revisoes_agendadas (usuario_id, status_concluida);`).catch(() => {});

    // ============================
    // SEED: USUÁRIO DAVI + PROVA ETEC
    // ============================
    console.log('🌱 Inserindo dados iniciais (Davi + Prova ETEC)...');

    // Inserir usuário Davi (se não existir)
    const [existingUsers] = await connection.query(`SELECT id FROM usuarios WHERE nome = 'Davi' LIMIT 1;`);
    let userId;
    if (existingUsers.length === 0) {
      const [result] = await connection.query(`INSERT INTO usuarios (nome) VALUES ('Davi');`);
      userId = result.insertId;
      console.log(`   ✅ Usuário "Davi" criado com ID ${userId}`);

      // Criar gamificação inicial para Davi
      await connection.query(`INSERT INTO gamificacao (usuario_id, nivel_atual, xp_total, ofensiva_dias) VALUES (${userId}, 1, 0, 0);`);
      console.log('   ✅ Gamificação inicial criada (Nível 1, 0 XP)');
    } else {
      userId = existingUsers[0].id;
      console.log(`   ℹ️ Usuário "Davi" já existe (ID ${userId})`);
    }

    // Inserir data da prova ETEC (se não existir)
    const [existingProvas] = await connection.query(`SELECT id FROM datas_oficiais_provas WHERE instituicao = 'ETEC' LIMIT 1;`);
    if (existingProvas.length === 0) {
      await connection.query(`
        INSERT INTO datas_oficiais_provas (instituicao, descricao, curso_alvo, data_prova, nota_corte_media)
        VALUES ('ETEC', 'Vestibulinho ETEC 2026.2', 'Desenvolvimento de Sistemas', '2026-12-06 13:30:00', 35);
      `);
      console.log('   ✅ Prova ETEC 06/12/2026 cadastrada (Corte: 35 pts)');
    } else {
      console.log('   ℹ️ Prova ETEC já cadastrada');
    }

    // ============================
    // RESULTADO FINAL
    // ============================
    console.log('\n========================================');
    console.log('✅ BANCO DE DADOS VESTBOT CRIADO COM SUCESSO!');
    console.log('========================================');
    console.log('📦 Database: vestbot_db');
    console.log('📊 Tabelas criadas: 15');
    console.log('🔍 Índices criados: 7');
    console.log('👤 Usuário seed: Davi (ID ' + userId + ')');
    console.log('🎯 Prova seed: ETEC 06/12/2026');
    console.log('========================================\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ ERRO AO CONFIGURAR BANCO DE DADOS:');
    console.error(error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Verifique se o usuário "Davi-01" existe no MySQL e a senha "495321" está correta.');
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 O MySQL não está rodando. Abra o MySQL Workbench primeiro.');
    }
    if (connection) await connection.end();
    process.exit(1);
  }
}

setupDatabase();
