@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo    🚀 VESTBOT - INICIALIZAÇÃO AUTOMÁTICA
echo ========================================

:: 1. Verificação de segurança
if not exist "package.json" (
    echo [!] ERRO: package.json não encontrado.
    pause
    exit
)

:: 2. Inicia o servidor em uma NOVA JANELA para não travar este script
echo [*] Iniciando servidores em segundo plano...
start "Servidor VestBot" cmd /k "npm run dev-extended"

:: 3. Aguarda o servidor ficar online
:: (Ajuste os segundos se o seu PC demorar mais para compilar)
echo [*] Aguardando inicialização do sistema (15s)...
timeout /t 15 /nobreak >nul

:: 4. Abre o navegador na porta correta
echo [*] Abrindo o navegador...
start http://localhost:3000

echo.
echo ✅ Tudo pronto! O servidor está rodando na outra janela.
echo [!] Não feche a janela do "Servidor VestBot" enquanto estuda.
echo.
pause

