#!/bin/bash

# Script para iniciar o VestBot automaticamente e abrir no navegador

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando VestBot...${NC}"

# Diretório do projeto
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Verifica se node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Instalando dependências...${NC}"
    npm install --legacy-peer-deps
fi

# Inicia o backend em background
echo -e "${BLUE}🔧 Iniciando backend server...${NC}"
npm run server &
BACKEND_PID=$!

# Inicia o frontend em background
echo -e "${BLUE}🔧 Iniciando frontend...${NC}"
npm run dev &
FRONTEND_PID=$!

# Função para limpar processos ao sair
cleanup() {
    echo -e "\n${BLUE}🛑 Encerrando VestBot...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Aguarda o backend estar pronto (porta 3001)
echo -e "${BLUE}⏳ Aguardando backend iniciar (porta 3001)...${NC}"
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend pronto!${NC}"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${YELLOW}⚠️  Backend não iniciou a tempo, mas continuando...${NC}"
fi

# Aguarda o frontend estar pronto (porta 3000)
echo -e "${BLUE}⏳ Aguardando frontend iniciar (porta 3000)...${NC}"
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend pronto!${NC}"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${YELLOW}⚠️  Timeout: Frontend não iniciou a tempo${NC}"
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

echo -e ""
echo -e "${GREEN}✨ VestBot está rodando!${NC}"
echo -e "${BLUE}   Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}   Backend:  http://localhost:3001${NC}"
echo -e "${BLUE}Pressione Ctrl+C para encerrar${NC}"
echo -e ""

# Mantém o script rodando
wait $FRONTEND_PID
