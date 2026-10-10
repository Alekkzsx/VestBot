-- =====================================================================
-- VestBot Database Schema (MySQL / MariaDB)
-- Desenvolvido para VestBot - Plataforma de Estudos ETEC & IFSP
-- Usuário principal: Davi
-- Suporte completo para visualização e modelagem no MySQL Workbench
-- =====================================================================

CREATE DATABASE IF NOT EXISTS vestbot_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE vestbot_db;

-- ---------------------------------------------------------------------
-- 1. TABELA DE USUÁRIOS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. PERFIL E ESTATÍSTICAS DO USUÁRIO
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT PRIMARY KEY,
    level INT NOT NULL DEFAULT 1,
    xp INT NOT NULL DEFAULT 0,
    current_streak INT NOT NULL DEFAULT 0,
    questions_answered INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    essays_written INT NOT NULL DEFAULT 0,
    version VARCHAR(20) DEFAULT '4.0.0',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. TABELA GERAL DE QUESTÕES (Simulado e Interpretação)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    id INT PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'simulado',
    subject VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'Médio',
    statement TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    correct_index TINYINT NOT NULL DEFAULT 0,
    base_explanation TEXT NULL,
    image_url VARCHAR(255) NULL,
    support_text TEXT NULL,
    group_id INT NULL,
    theme VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questions_type (type),
    INDEX idx_questions_subject (subject),
    INDEX idx_questions_difficulty (difficulty),
    INDEX idx_questions_group (group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. ALTERNATIVAS DAS QUESTÕES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_index TINYINT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_options_question (question_id, option_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4.1 QUESTÕES DE INTERPRETAÇÃO DE TEXTO
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interpretation_questions (
    id INT PRIMARY KEY,
    group_id INT NOT NULL,
    theme VARCHAR(150) NULL,
    subject VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'Médio',
    statement TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    correct_index TINYINT NOT NULL DEFAULT 0,
    base_explanation TEXT NULL,
    image_url VARCHAR(255) NULL,
    support_text TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inter_group (group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS interpretation_question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_index TINYINT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES interpretation_questions(id) ON DELETE CASCADE,
    INDEX idx_inter_opt (question_id, option_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. RESOLUÇÕES DETALHADAS DAS QUESTÕES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_resolutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    mode VARCHAR(50) NOT NULL DEFAULT 'quiz',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_resolution_question (question_id, mode),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. PASSOS DA RESOLUÇÃO (Step-by-Step)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resolution_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resolution_id INT NOT NULL,
    step_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (resolution_id) REFERENCES question_resolutions(id) ON DELETE CASCADE,
    INDEX idx_steps_res_order (resolution_id, step_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. HISTÓRICO DE QUESTÕES RESPONDIDAS (Simulados)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_question_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    was_correct BOOLEAN NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_uqh_user_time (user_id, timestamp),
    INDEX idx_uqh_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. HISTÓRICO DE QUESTÕES DE INTERPRETAÇÃO
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_interpretation_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    was_correct BOOLEAN NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_uih_user_time (user_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. HISTÓRICO DE RESOLUÇÕES VISUALIZADAS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_resolutions_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    timestamp BIGINT NOT NULL,
    viewed_at BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_urh_user (user_id, question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. CRONOGRAMA DE ESTUDOS (Schedule)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_schedule (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    day_of_week VARCHAR(30) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(150) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_schedule_user_day (user_id, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 11. GAMIFICAÇÃO (Conquistas, Desafios, Estatísticas por Matéria)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_gamification (
    user_id INT PRIMARY KEY,
    consecutive_correct INT NOT NULL DEFAULT 0,
    achievements_json JSON NULL,
    challenges_json JSON NULL,
    subject_stats_json JSON NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 12. HISTÓRICO DE VIDEOAULAS ASSISTIDAS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_lessons_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id VARCHAR(100) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    watched_duration INT NOT NULL DEFAULT 0,
    completed_at BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_lessons_user (user_id, lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 13. SESSÕES DE ATIVIDADES DE ESTUDO
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(100) NULL,
    session_type VARCHAR(50) NOT NULL,
    duration_seconds INT NOT NULL DEFAULT 0,
    xp_earned INT NOT NULL DEFAULT 0,
    questions_count INT NOT NULL DEFAULT 0,
    raw_payload JSON NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sessions_user_time (user_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 14. FREQUÊNCIA DE DIAS DE ESTUDO (Streak Days)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_study_days (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    study_date VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_study_date (user_id, study_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 15. CACHE DE CALENDÁRIO DE VESTIBULARES (ETEC / IFSP)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_calendar_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution VARCHAR(50) NOT NULL,
    exam_date VARCHAR(50) NOT NULL,
    modality VARCHAR(100) NOT NULL,
    raw_data JSON NULL,
    last_updated BIGINT NOT NULL,
    INDEX idx_exam_inst (institution)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- GARANTIR USUÁRIO PADRÃO 'davi'
-- ---------------------------------------------------------------------
INSERT INTO users (id, username, name)
VALUES (1, 'davi', 'Davi')
ON DUPLICATE KEY UPDATE name = 'Davi';

INSERT INTO user_profiles (user_id, level, xp, current_streak, questions_answered, correct_answers, essays_written)
VALUES (1, 1, 0, 0, 0, 0, 0)
ON DUPLICATE KEY UPDATE user_id = 1;

