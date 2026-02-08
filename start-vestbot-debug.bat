@echo off
chcp 65001 >nul
title VestBot - Debug Mode

REM ==============================================
REM  VestBot Debug Launcher
REM  Use este script se start-vestbot.bat nao funcionar
REM ==============================================

echo.
echo ========================================
echo    🔍 VestBot - Modo Debug
echo ========================================
echo.
echo Este script mostra mais informacoes
echo para ajudar a diagnosticar problemas.
echo.
pause

REM Salva o diretório atual
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo.
echo ========================================
echo    Informacoes do Sistema
echo ========================================
echo.

echo Diretorio do projeto:
echo %PROJECT_DIR%
echo.

echo Versao do Windows:
ver
echo.

echo Verificando Node.js...
where node
if errorlevel 1 (
    echo ❌ Node.js NAO encontrado!
    echo.
    echo Por favor, instale Node.js de:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo.
echo Versao do Node.js:
node --version
echo.

echo Verificando npm...
where npm
if errorlevel 1 (
    echo ❌ npm NAO encontrado!
    echo.
    pause
    exit /b 1
)

echo.
echo Versao do npm:
npm --version
echo.

echo Verificando curl...
where curl
if errorlevel 1 (
    echo ⚠️  curl NAO encontrado!
    echo Isso pode causar problemas.
    echo.
    echo Instale curl ou atualize seu Windows.
    echo.
)
echo.

pause

echo.
echo ========================================
echo    Verificando Arquivos do Projeto
echo ========================================
echo.

if exist "package.json" (
    echo ✅ package.json encontrado
) else (
    echo ❌ package.json NAO encontrado!
    echo.
    echo Tem certeza que esta na pasta correta?
    echo.
    pause
    exit /b 1
)

if exist "server.cjs" (
    echo ✅ server.cjs encontrado
) else (
    echo ❌ server.cjs NAO encontrado!
    echo.
    pause
    exit /b 1
)

if exist "src\" (
    echo ✅ pasta src encontrada
) else (
    echo ❌ pasta src NAO encontrada!
    echo.
    pause
    exit /b 1
)

if exist "node_modules\" (
    echo ✅ node_modules existe
) else (
    echo ⚠️  node_modules NAO existe
    echo Sera necessario instalar dependencias
)
echo.

pause

echo.
echo ========================================
echo    Instalando Dependencias
echo ========================================
echo.

if not exist "node_modules\" (
    echo Instalando dependencias...
    echo Isso pode demorar varios minutos.
    echo.
    
    call npm install --legacy-peer-deps
    
    if errorlevel 1 (
        echo.
        echo ❌ ERRO ao instalar dependencias!
        echo.
        echo Codigo de erro: %errorlevel%
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ Dependencias instaladas!
) else (
    echo Dependencias ja instaladas.
)
echo.

pause

echo.
echo ========================================
echo    Testando Backend
echo ========================================
echo.

echo Iniciando backend em janela separada...
echo.

start "VestBot Backend" cmd /c "npm run server & pause"

echo Aguardando 5 segundos...
timeout /t 5 /nobreak >nul

echo.
echo Testando conexao com backend...
echo.

curl http://localhost:3001/api/health
if errorlevel 1 (
    echo.
    echo ❌ Backend NAO esta respondendo!
    echo.
    echo Verifique a janela do backend para erros.
    echo.
    pause
) else (
    echo.
    echo ✅ Backend esta funcionando!
    echo.
)

pause

echo.
echo ========================================
echo    Testando Frontend
echo ========================================
echo.

echo Iniciando frontend em janela separada...
echo.

start "VestBot Frontend" cmd /c "npm run dev & pause"

echo Aguardando 10 segundos...
timeout /t 10 /nobreak >nul

echo.
echo Testando conexao com frontend...
echo.

curl http://localhost:3000
if errorlevel 1 (
    echo.
    echo ❌ Frontend NAO esta respondendo!
    echo.
    echo Verifique a janela do frontend para erros.
    echo.
    pause
) else (
    echo.
    echo ✅ Frontend esta funcionando!
    echo.
)

pause

echo.
echo ========================================
echo    Abrindo Navegador
echo ========================================
echo.

start http://localhost:3000

echo.
echo Navegador aberto em http://localhost:3000
echo.
echo.
echo ========================================
echo    Debug Completo
echo ========================================
echo.
echo O VestBot deve estar rodando agora.
echo.
echo Janelas abertas:
echo   - VestBot Backend (porta 3001)
echo   - VestBot Frontend (porta 3000)
echo   - Navegador (localhost:3000)
echo.
echo Para encerrar:
echo   1. Feche esta janela
echo   2. Feche as janelas do Backend e Frontend
echo.
echo Pressione qualquer tecla para encerrar tudo...
pause >nul

taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo ✅ Processos encerrados!
echo.
timeout /t 3 /nobreak >nul
