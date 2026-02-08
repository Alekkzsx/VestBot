@echo off
chcp 65001 >nul
title VestBot Launcher

echo.
echo ========================================
echo    🚀 Iniciando VestBot...
echo ========================================
echo.

REM Salva o diretório atual
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

REM Verifica se node_modules existe
if not exist "node_modules\" (
    echo 📦 Instalando dependências...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
)

REM Inicia o servidor em background
echo 🔧 Iniciando servidor...
echo.
start /B npm run dev

REM Aguarda o servidor estar pronto
echo ⏳ Aguardando servidor iniciar...
timeout /t 3 /nobreak >nul

REM Tenta conectar ao servidor (máximo 30 tentativas)
set ATTEMPTS=0
:WAIT_LOOP
set /a ATTEMPTS+=1
if %ATTEMPTS% GTR 30 (
    echo.
    echo ❌ Timeout: Servidor não iniciou a tempo
    pause
    exit /b 1
)

REM Verifica se a porta 3000 está respondendo
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto WAIT_LOOP
)

echo ✅ Servidor pronto!
echo.

REM Abre o navegador
echo 🌐 Abrindo navegador...
start http://localhost:3000

echo.
echo ========================================
echo    ✨ VestBot está rodando!
echo    📍 http://localhost:3000
echo ========================================
echo.
echo Pressione qualquer tecla para encerrar o servidor...
pause >nul

REM Encerra o servidor Node.js
echo.
echo 🛑 Encerrando VestBot...
taskkill /F /IM node.exe /T >nul 2>&1

echo ✅ Encerrado com sucesso!
timeout /t 2 /nobreak >nul
