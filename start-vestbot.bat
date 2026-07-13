@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

:: Códigos de Cores ANSI
set "ESC="
set "GREEN=!ESC![92m"
set "BLUE=!ESC![94m"
set "YELLOW=!ESC![93m"
set "RED=!ESC![91m"
set "RESET=!ESC![0m"

echo ====================================================
echo    !BLUE!🚀 VESTBOT - INICIALIZAÇÃO E CONFIGURAÇÃO!RESET!
echo ====================================================
echo.

:: 1. Verificar se package.json existe
if not exist "package.json" (
    echo !RED![!] ERRO CRÍTICO: O arquivo package.json não foi encontrado.!RESET!
    echo Certifique-se de que este script está na pasta raiz do VestBot.
    echo.
    pause
    exit /b
)

:: 2. Verificar se o Node.js está instalado
echo [*] Verificando se o Node.js está instalado...
where node >nul 2>nul
if !errorlevel! neq 0 (
    echo.
    echo !RED![!] ERRO: O Node.js não está instalado no seu computador.!RESET!
    echo O VestBot precisa do Node.js para ser executado.
    echo.
    echo [*] Abrindo a página de download oficial do Node.js...
    start https://nodejs.org/
    echo.
    echo !YELLOW!>> Instale a versão LTS recomendada, reinicie seu computador e execute este script novamente.!RESET!
    echo.
    pause
    exit /b
)
echo !GREEN![OK] Node.js detectado.!RESET!

:: 3. Verificar se a pasta node_modules existe (instalação inteligente)
if not exist "node_modules" (
    echo.
    echo !YELLOW![!] Dependências não encontradas. Iniciando configuração...!RESET!
    echo [*] Baixando e instalando arquivos necessários (isso pode levar alguns minutos)...
    call npm install --legacy-peer-deps
    if !errorlevel! neq 0 (
        echo.
        echo !RED![!] ERRO: Falha ao baixar dependências.!RESET!
        echo Verifique sua conexão de rede e tente novamente.
        echo.
        pause
        exit /b
    )
    echo !GREEN![OK] Configuração inicial concluída!!RESET!
) else (
    echo !GREEN![OK] Dependências já configuradas. Iniciando em modo rápido...!RESET!
)

:: 4. Verificar se o servidor já está ativo (evita portas duplicadas)
echo [*] Verificando se o VestBot já está rodando...
netstat -ano | findstr :3000 >nul 2>nul
if !errorlevel! eq 0 (
    echo.
    echo !YELLOW![!] O VestBot já está ativo em segundo plano.!RESET!
    echo [*] Abrindo aplicativo no navegador...
    start http://localhost:3000
    echo.
    echo !GREEN!✅ Tudo pronto! Aplicação carregada no navegador.!RESET!
    echo.
    pause
    exit /b
)

:: 5. Iniciar os servidores
echo.
echo [*] Iniciando os servidores (Frontend + Backend)...
start "Servidor VestBot" cmd /k "npm run dev-extended"

echo [*] Aguardando compilação do sistema (15 segundos)...
timeout /t 15 /nobreak >nul

:: 6. Abrir navegador
echo [*] Abrindo o VestBot no navegador...
start http://localhost:3000

echo.
echo !GREEN!✅ Servidores iniciados com sucesso!!RESET!
echo !BLUE!   URL: http://localhost:3000!RESET!
echo.
echo [!] IMPORTANTE: Mantenha a outra janela "Servidor VestBot" aberta enquanto estuda.
echo.
pause
