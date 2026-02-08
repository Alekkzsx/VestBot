#!/bin/bash

# Script para iniciar o VestBot automaticamente e abrir no navegador

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando VestBot...${NC}"

# Diretório do projeto
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Verifica se node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Instalando dependências...${NC}"
    npm install
fi

# Inicia o servidor em background
echo -e "${BLUE}🔧 Iniciando servidor...${NC}"
npm run dev &
SERVER_PID=$!

# Função para limpar processos ao sair
cleanup() {
    echo -e "\n${BLUE}🛑 Encerrando VestBot...${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Aguarda o servidor estar pronto (verifica se a porta 3000 está respondendo)
echo -e "${BLUE}⏳ Aguardando servidor iniciar...${NC}"
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Servidor pronto!${NC}"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${RED}❌ Timeout: Servidor não iniciou a tempo${NC}"
    cleanup
fi

# Abre o navegador
echo -e "${GREEN}🌐 Abrindo navegador...${NC}"

# Detecta e abre o navegador disponível
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v gnome-open > /dev/null; then
    gnome-open http://localhost:3000
elif command -v google-chrome > /dev/null; then
    google-chrome http://localhost:3000
elif command -v firefox > /dev/null; then
    firefox http://localhost:3000
else
    echo -e "${BLUE}ℹ️  Abra manualmente: http://localhost:3000${NC}"
fi

echo -e "${GREEN}✨ VestBot está rodando em http://localhost:3000${NC}"
echo -e "${BLUE}Pressione Ctrl+C para encerrar${NC}"

# Mantém o script rodando
wait $SERVER_PID
