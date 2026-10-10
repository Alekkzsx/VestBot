#!/bin/bash
# ==============================================================================
# Script de Configuração e Inicialização do MySQL para o VestBot
# Cria o banco 'vestbot_db', configura o usuário e importa todas as 2.000+ questões.
# ==============================================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}🐬 Configuração do Banco de Dados MySQL - VestBot${NC}"
echo -e "${BLUE}======================================================${NC}"

# Diretório raiz
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# 1. Verificar se o serviço MySQL ou MariaDB está instalado
echo -e "\n${BLUE}🔍 Verificando serviço MySQL/MariaDB...${NC}"
if ! command -v mariadb >/dev/null 2>&1 && ! command -v mysql >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Servidor MySQL/MariaDB não encontrado. Instalando MariaDB Server...${NC}"
    sudo apt update && sudo apt install -y mariadb-server
fi

# 2. Iniciar o serviço do banco de dados
echo -e "${BLUE}🚀 Iniciando serviço do banco de dados...${NC}"
if command -v systemctl >/dev/null 2>&1 && systemctl is-system-running >/dev/null 2>&1; then
    sudo systemctl start mariadb 2>/dev/null || sudo systemctl start mysql 2>/dev/null
else
    sudo service mariadb start 2>/dev/null || sudo service mysql start 2>/dev/null
fi

# 3. Testar se a porta 3306 está aberta
echo -e "${BLUE}⏳ Aguardando porta 3306 responder...${NC}"
sleep 2

# 4. Criar usuário e banco caso ainda não existam
echo -e "${BLUE}🔐 Configurando banco e permissões para 'vestbot'@'localhost'...${NC}"
sudo mysql -e "
CREATE DATABASE IF NOT EXISTS vestbot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'vestbot'@'%' IDENTIFIED BY 'vestbot123';
CREATE USER IF NOT EXISTS 'vestbot'@'localhost' IDENTIFIED BY 'vestbot123';
GRANT ALL PRIVILEGES ON vestbot_db.* TO 'vestbot'@'%';
GRANT ALL PRIVILEGES ON vestbot_db.* TO 'vestbot'@'localhost';
FLUSH PRIVILEGES;
" 2>/dev/null || true

# 5. Executar script de seed das 2.000+ questões e resoluções
echo -e "\n${BLUE}📦 Executando migração e seed (2.005 questões e resoluções)...${NC}"
npm run db:setup

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}✨ BANCO DE DADOS CONFIGURADO COM SUCESSO!${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "${BLUE}Como conectar no MySQL Workbench:${NC}"
echo -e "  - ${YELLOW}Hostname:${NC} 127.0.0.1 (ou localhost)"
echo -e "  - ${YELLOW}Port:${NC} 3306"
echo -e "  - ${YELLOW}Username:${NC} vestbot"
echo -e "  - ${YELLOW}Password:${NC} vestbot123"
echo -e "  - ${YELLOW}Default Schema:${NC} vestbot_db"
echo -e ""
echo -e "${BLUE}Para iniciar o VestBot completo agora:${NC}"
echo -e "  ./start-vestbot.sh"
echo -e ""

