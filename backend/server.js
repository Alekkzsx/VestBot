const path = require('path');

// Carrega as variáveis de ambiente a partir do .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 VestBot Backend rodando na porta ${PORT}`);
  console.log(`   Nave-Mãe acessível em: http://localhost:${PORT}`);
  console.log(`   Engenharia (Oculto): http://localhost:${PORT}/engenharia`);
  console.log(`   Ping: http://localhost:${PORT}/api/ping`);
  console.log(`   Sync: POST http://localhost:${PORT}/api/sync`);
  console.log(`   Dashboard: GET http://localhost:${PORT}/api/dashboard/1\n`);
});
