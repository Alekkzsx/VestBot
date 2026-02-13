@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title VestBot Launcher - Sistema de Estudos

REM ==============================================
REM  1. Configuração de Diretório
REM ==============================================

:: Usar o diretório onde o script está localizado (%~dp0)
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo.
echo ========================================
echo    🚀 VestBot - Iniciando Modo Estendido
echo    (Sem Timeout de 30 minutos)
echo    Diretório: %PROJECT_DIR%
echo ========================================
echo.

REM ==============================================
REM  2. Validação e Pré-requisitos
REM ==============================================

if not exist "package.json" (
    echo ❌ ERRO: O arquivo 'package.json' não foi encontrado em:
    echo "%PROJECT_DIR%"
    pause
    exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js não instalado ou não está no PATH!
    pause
    exit /b 1
)

REM ==============================================
REM  3. Dependências e Servidores
REM ==============================================

if not exist "node_modules\" (
    echo 📦 Instalando dependências (isso pode demorar na primeira vez)...
    call npm install --legacy-peer-deps
)

echo [3/4] Limpando processos antigos...
:: Mata qualquer processo node que possa estar travado
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo [4/4] Iniciando Servidores (Frontend + Backend)...
:: O script 'dev-extended' já inicia ambos (ng serve + node server.cjs)
:: Usamos polling de 2s para evitar o idle timeout de 30min do Angular CLI
start "VestBot SISTEMA" /MIN cmd /k "npm run dev-extended"

REM ==============================================
REM  4. Finalização
REM ==============================================

echo ⏳ Aguardando inicialização (aprox. 15s)...
timeout /t 15 /nobreak >nul

echo 🌐 Abrindo navegador...
start http://localhost:3000

echo.
echo ✅ SISTEMA EM EXECUÇÃO (MODO CONTÍNUO)
echo.
echo NOTA: Não feche a janela minimizada do terminal enquanto estiver estudando.
echo.
echo Pressione qualquer tecla para ENCERRAR os servidores e sair.
pause >nul

echo 🛑 Encerrando processos...
taskkill /F /IM node.exe /T >nul 2>&1
exit /b 0