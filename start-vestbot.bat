@echo off
chcp 65001 >nul
title VestBot Launcher

REM ==============================================
REM  VestBot Launcher - Windows
REM ==============================================

echo.
echo ========================================
echo    🚀 VestBot - Iniciando...
echo ========================================
echo.

REM Salva o diretório atual
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

REM ==============================================
REM  Verificações de Prerequisitos
REM ==============================================

echo [1/5] Verificando prerequisitos...
echo.

REM Verifica se Node.js está instalado
where node >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js nao encontrado!
    echo.
    echo Por favor, instale Node.js de https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Verifica se npm está instalado
where npm >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: npm nao encontrado!
    echo.
    echo Por favor, reinstale Node.js de https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ npm encontrado
npm --version
echo.

REM ==============================================
REM  Instalação de Dependências
REM ==============================================

echo [2/5] Verificando dependencias...
echo.

if not exist "node_modules\" (
    echo 📦 Instalando dependencias (pode demorar alguns minutos)...
    echo.
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo.
        echo ❌ ERRO ao instalar dependencias!
        echo.
        echo Tente executar manualmente:
        echo   npm install --legacy-peer-deps
        echo.
        pause
        exit /b 1
    )
    echo.
    echo ✅ Dependencias instaladas com sucesso!
) else (
    echo ✅ Dependencias ja instaladas
)
echo.

REM ==============================================
REM  Iniciar Backend
REM ==============================================

echo [3/5] Iniciando backend server (porta 3001)...
echo.

REM Mata qualquer processo Node.js anterior
taskkill /F /IM node.exe /T >nul 2>&1

REM Inicia o backend
start "" cmd /c "npm run server"
timeout /t 3 /nobreak >nul

REM Aguarda o backend estar pronto
echo ⏳ Aguardando backend iniciar...
set ATTEMPTS=0
:WAIT_BACKEND
set /a ATTEMPTS+=1
if %ATTEMPTS% GTR 30 (
    echo.
    echo ⚠️  Backend nao iniciou em 30 segundos
    echo.
    echo Verifique se:
    echo   - A porta 3001 esta livre
    echo   - O arquivo server.cjs existe
    echo.
    echo Tente executar manualmente:
    echo   npm run server
    echo.
    pause
    goto CLEANUP
)

REM Verifica se a porta 3001 está respondendo
curl -s http://localhost:3001/api/health >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto WAIT_BACKEND
)

echo ✅ Backend pronto!
echo.

REM ==============================================
REM  Iniciar Frontend
REM ==============================================

echo [4/5] Iniciando frontend (porta 3000)...
echo.

REM Inicia o frontend
start "" cmd /c "npm run dev"
timeout /t 3 /nobreak >nul

REM Aguarda o frontend estar pronto
echo ⏳ Aguardando frontend iniciar...
set ATTEMPTS=0
:WAIT_FRONTEND
set /a ATTEMPTS+=1
if %ATTEMPTS% GTR 40 (
    echo.
    echo ⚠️  Frontend nao iniciou em 40 segundos
    echo.
    echo Verifique se:
    echo   - A porta 3000 esta livre
    echo   - Angular CLI esta instalado corretamente
    echo.
    echo Tente executar manualmente:
    echo   npm run dev
    echo.
    pause
    goto CLEANUP
)

REM Verifica se a porta 3000 está respondendo
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto WAIT_FRONTEND
)

echo ✅ Frontend pronto!
echo.

REM ==============================================
REM  Abrir Navegador
REM ==============================================

echo [5/5] Abrindo navegador...
echo.

timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo    ✨ VestBot esta rodando!
echo ========================================
echo.
echo    📍 Frontend: http://localhost:3000
echo    📍 Backend:  http://localhost:3001
echo    📄 Dados:    %PROJECT_DIR%data\data-user.txt
echo.
echo ========================================
echo.
echo ⚠️  NAO FECHE ESTA JANELA!
echo.
echo    Para encerrar o VestBot, pressione
echo    qualquer tecla nesta janela.
echo.
pause >nul

REM ==============================================
REM  Encerrar Servidores
REM ==============================================

:CLEANUP
echo.
echo 🛑 Encerrando VestBot...
echo.

REM Encerra todos os processos Node.js
taskkill /F /IM node.exe /T >nul 2>&1

echo ✅ Encerrado com sucesso!
echo.
timeout /t 2 /nobreak >nul
exit /b 0

