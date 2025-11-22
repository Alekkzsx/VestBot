# ETEC Prep - Environment Setup

## Configuração da API Key

Para usar este projeto, você precisa de uma chave de API do Google Gemini.

### Passos:

1. Obtenha sua chave de API em: https://aistudio.google.com/app/apikey

2. Crie um arquivo `.env.local` na raiz do projeto

3. Adicione a seguinte linha ao arquivo:
   ```
   VITE_API_KEY=sua_chave_gemini_aqui
   ```

4. Salve o arquivo

5. Reinicie o servidor de desenvolvimento se estiver rodando

## Nota Importante

⚠️ **NUNCA** compartilhe sua chave de API publicamente ou faça commit dela no Git!

O arquivo `.env.local` já está no `.gitignore` para proteger suas credenciais.
