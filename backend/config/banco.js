const path = require('path');
const mysql = require('mysql2/promise');

// Carrega as variáveis de ambiente a partir do .env na raiz do projeto ou na pasta backend
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const configBanco = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vestbot_db',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};

// Pool de conexões MySQL
const pool = mysql.createPool(configBanco);

module.exports = {
  pool,
  configBanco
};
