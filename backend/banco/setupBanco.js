const path = require('path');
const mysql = require('mysql2/promise');

// Carrega .env da raiz do projeto ou da subpasta backend
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const configConexao = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const nomeBanco = process.env.DB_NAME || 'vestbot_db';

async function inicializarBanco() {
  let conexao;
  try {
    console.log(`🔌 Conectando ao MySQL (${configConexao.user}@${configConexao.host}:${configConexao.port})...`);
    conexao = await mysql.createConnection(configConexao);

    // ============================
    // CRIAÇÃO DO BANCO DE DADOS
    // ============================
    console.log(`📦 Criando banco de dados ${nomeBanco}...`);
    await conexao.query(`CREATE DATABASE IF NOT EXISTS \`${nomeBanco}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conexao.query(`USE \`${nomeBanco}\`;`);

    // ============================
    // 1. DOMÍNIO: USUÁRIO & ENGAJAMENTO
    // ============================

    console.log('👤 Criando tabela USUARIOS...');
    await conexao.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    console.log('🎮 Criando tabela GAMIFICACAO...');
    await conexao.query(`
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
    await conexao.query(`
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
    await conexao.query(`
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
    await conexao.query(`
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

    // ============================
    // 2. DOMÍNIO: ENSINO & REVISÃO
    // ============================

    console.log('🎬 Criando tabela VIDEOS_AULAS...');
    await conexao.query(`
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
    await conexao.query(`
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
    await conexao.query(`
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
    await conexao.query(`
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
    await conexao.query(`
      CREATE TABLE IF NOT EXISTS textos_base (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255),
        conteudo_completo TEXT NOT NULL,
        fonte VARCHAR(100)
      ) ENGINE=InnoDB;
    `);

    console.log('❓ Criando tabela QUESTOES...');
    await conexao.query(`
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
    await conexao.query(`
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
    await conexao.query(`
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
        FOREIGN KEY (simulado_id) REFERENCES simulados_realizados(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    console.log('⚡ Criando tabela PACE_ANALITICO_USUARIO...');
    await conexao.query(`
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
    await conexao.query(`
      CREATE TABLE IF NOT EXISTS cronograma_pessoal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        titulo_evento VARCHAR(255) NOT NULL,
        materia VARCHAR(100) DEFAULT NULL,
        dia_semana VARCHAR(20) DEFAULT NULL,
        topico VARCHAR(200) DEFAULT NULL,
        tipo VARCHAR(20) DEFAULT 'estudo',
        data_marcada DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_geracao DATETIME DEFAULT CURRENT_TIMESTAMP,
        duracao_estimada VARCHAR(50) DEFAULT NULL,
        concluido BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log('🎯 Criando tabela DATAS_OFICIAIS_PROVAS...');
    await conexao.query(`
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
    // 5. DOMÍNIO: CENTRAL DE PEDIDOS (ENTENDENDO)
    // ============================

    console.log('🎫 Criando tabela CHAMADOS...');
    await conexao.query(`
      CREATE TABLE IF NOT EXISTS chamados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        tipo ENUM('explicacao', 'revisao') NOT NULL,
        assunto VARCHAR(200) NOT NULL,
        descricao TEXT,
        fonte_revisao VARCHAR(50) DEFAULT NULL,
        quantidade_questoes INT DEFAULT 10,
        status ENUM('pendente', 'em_andamento', 'concluido') DEFAULT 'pendente',
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // ============================
    // ÍNDICES DE PERFORMANCE
    // ============================
    console.log('🔍 Criando índices de performance...');
    await conexao.query(`CREATE INDEX IF NOT EXISTS idx_questoes_disciplina_assunto ON questoes (disciplina, assunto);`).catch(() => {});
    await conexao.query(`CREATE INDEX IF NOT EXISTS idx_questoes_dificuldade ON questoes (dificuldade);`).catch(() => {});
    await conexao.query(`CREATE INDEX IF NOT EXISTS idx_questoes_fonte_ano ON questoes (fonte_prova, ano_prova);`).catch(() => {});
    await conexao.query(`CREATE INDEX IF NOT EXISTS idx_desemp_usuario_data ON desempenho_questoes (usuario_id, data_hora);`).catch(() => {});
    await conexao.query(`CREATE INDEX IF NOT EXISTS idx_desemp_simulado ON desempenho_questoes (simulado_id);`).catch(() => {});
    await conexao.query(`CREATE INDEX IF NOT EXISTS idx_consumo_usuario_video ON consumo_ensino (usuario_id, video_id);`).catch(() => {});
    await conexao.query(`CREATE INDEX IF NOT EXISTS idx_revisoes_pendentes ON revisoes_agendadas (usuario_id, status_concluida);`).catch(() => {});
    await conexao.query(`CREATE INDEX IF NOT EXISTS idx_chamados_usuario ON chamados (usuario_id, status);`).catch(() => {});
    await conexao.query(`CREATE INDEX IF NOT EXISTS idx_cronograma_dia ON cronograma_pessoal (usuario_id, dia_semana);`).catch(() => {});

    // ============================
    // SEED: USUÁRIO DAVI + PROVAS ETEC / IFSP
    // ============================
    console.log('🌱 Inserindo dados iniciais...');
    const [existingUsers] = await conexao.query(`SELECT id FROM usuarios WHERE nome = 'Davi' LIMIT 1;`);
    let userId;
    if (existingUsers.length === 0) {
      const [result] = await conexao.query(`INSERT INTO usuarios (nome) VALUES ('Davi');`);
      userId = result.insertId;
      console.log(`   ✅ Usuário "Davi" criado com ID ${userId}`);

      await conexao.query(`INSERT INTO gamificacao (usuario_id, nivel_atual, xp_total, ofensiva_dias) VALUES (${userId}, 1, 0, 0);`);
      console.log('   ✅ Gamificação inicial criada');
    } else {
      userId = existingUsers[0].id;
    }

    const [existingProvas] = await conexao.query(`SELECT instituicao FROM datas_oficiais_provas;`);
    const instituicoesExistentes = existingProvas.map(p => p.instituicao);

    if (!instituicoesExistentes.includes('ETEC')) {
      await conexao.query(`
        INSERT INTO datas_oficiais_provas (instituicao, descricao, curso_alvo, data_prova, nota_corte_media)
        VALUES ('ETEC', 'Vestibulinho ETEC 2026.2', 'Desenvolvimento de Sistemas', '2026-12-06 13:30:00', 35);
      `);
      console.log('   ✅ Prova ETEC cadastrada (06/12/2026)');
    }

    if (!instituicoesExistentes.includes('IFSP')) {
      await conexao.query(`
        INSERT INTO datas_oficiais_provas (instituicao, descricao, curso_alvo, data_prova, nota_corte_media)
        VALUES ('IFSP', 'Processo Seletivo IFSP Jundiaí 2026.2', 'Técnico em Informática', '2026-11-29 13:30:00', 38);
      `);
      console.log('   ✅ Prova IFSP cadastrada (29/11/2026)');
    }

    console.log('\n========================================');
    console.log('✅ BANCO DE DADOS VESTBOT INICIALIZADO!');
    console.log('========================================');
    console.log(`📦 Database: ${nomeBanco}`);
    console.log('📊 Tabelas criadas: 15');
    console.log('🔍 Índices criados: 9');
    console.log('========================================\n');

    await conexao.end();

  } catch (error) {
    console.error('\n❌ ERRO AO CONFIGURAR BANCO DE DADOS:');
    console.error(error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`💡 Acesso negado para o usuário "${configConexao.user}". Verifique as credenciais no arquivo .env.`);
    }
    if (error.code === 'ECONNREFUSED') {
      console.error(`💡 Não foi possível conectar ao MySQL em ${configConexao.host}:${configConexao.port}. Verifique se o serviço está rodando.`);
    }
    if (conexao) await conexao.end();
    process.exit(1);
  }
}

inicializarBanco();
