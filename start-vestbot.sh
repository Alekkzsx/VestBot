#!/bin/bash

# Script para iniciar o VestBot automaticamente e abrir no navegador
# Modo Estendido: Sem timeout de 30 minutos

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando VestBot (Modo Estendido)...${NC}"

# Diretório do projeto
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Instala/verifica dependências
echo -e "${BLUE}📦 Verificando e instalando dependências...${NC}"
npm install --legacy-peer-deps


# Limpa processos antigos
echo -e "${BLUE}🧹 Limpando processos antigos...${NC}"
pkill -f "node server.cjs" 2>/dev/null
pkill -f "ng serve" 2>/dev/null

# Inicia o sistema completo (Frontend + Backend) usando dev-extended
# O script 'dev-extended' evita o idle timeout de 30min do Angular CLI
echo -e "${BLUE}🔧 Iniciando sistema (Frontend + Backend)...${NC}"
npm run dev-extended &
SYSTEM_PID=$!

# Função para limpar processos ao sair
cleanup() {
    echo -e "\n${BLUE}🛑 Encerrando VestBot...${NC}"
    kill $SYSTEM_PID 2>/dev/null
    pkill -P $SYSTEM_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Aguarda o sistema estar pronto (porta 3000)
echo -e "${BLUE}⏳ Aguardando simema iniciar (porta 3000)...${NC}"
MAX_ATTEMPTS=60
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if command -v curl > /dev/null; then
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Sistema pronto!${NC}"
            break
        fi
    elif command -v wget > /dev/null; then
        if wget -q --spider http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Sistema pronto!${NC}"
            break
        fi
    else
        # Fallback se não tiver curl nem wget
        echo -e "${YELLOW}ℹ️  Aguardando 15s para compilação (sem curl/wget)...${NC}"
        sleep 15
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${YELLOW}⚠️  Timeout: O sistema demorou muito para iniciar.${NC}"
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
elif [ "$(uname)" == "Darwin" ]; then
    open http://localhost:3000
else
    echo -e "${BLUE}ℹ️  Abra manualmente: http://localhost:3000${NC}"
fi

echo -e ""
echo -e "${GREEN}✨ VestBot está rodando em MODO CONTÍNUO!${NC}"
echo -e "${BLUE}   URL: http://localhost:3000${NC}"
echo -e "${BLUE}Pressione Ctrl+C para encerrar os servidores${NC}"
echo -e ""

# Mantém o script rodando
wait $SYSTEM_PID
