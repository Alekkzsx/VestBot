/**
 * Conexão com o Banco de Dados MySQL / MariaDB (Pool Singleton)
 * Suporta reconexão automática e tolerância a falhas.
 */
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

// Carregar variáveis de ambiente de .env.local e .env se existirem
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).replace(/^['"]|['"]$/g, '').trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'vestbot',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'vestbot123',
  database: process.env.DB_NAME || 'vestbot_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  charset: 'utf8mb4'
};

let pool = null;
let lastConnectionStatus = false;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Testa se o servidor MySQL está acessível
 */
async function testConnection() {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT 1 AS alive');
    lastConnectionStatus = true;
    return { ok: true, rows };
  } catch (err) {
    lastConnectionStatus = false;
    return { ok: false, error: err.message };
  }
}

/**
 * Executa uma query com parâmetros de forma segura
 */
async function query(sql, params = []) {
  const p = getPool();
  const [results] = await p.query(sql, params);
  return results;
}

/**
 * Executa múltiplas queries em uma única transação atômica
 */
async function transaction(callback) {
  const p = getPool();
  const connection = await p.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function isDbAvailable() {
  return lastConnectionStatus;
}

module.exports = {
  getPool,
  testConnection,
  query,
  transaction,
  isDbAvailable,
  dbConfig
};

