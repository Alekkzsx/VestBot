# VestBot - Plataforma de Estudos ETEC & IFSP (MySQL + Offline-First)

## 📋 Visão Geral

O **VestBot** foi atualizado para uma arquitetura moderna cliente-servidor com **Banco de Dados MySQL** e **Sincronização Offline-First** para o usuário **Davi**:
- **Esta Máquina (Servidor Principal)**: Hospeda o banco de dados MySQL (`vestbot_db`) na porta `3306`, gerenciável visualmente via **MySQL Workbench**.
- **Computador do Davi (Cliente)**: O Davi pode estudar, responder simulados e evoluir mesmo quando o computador do servidor estiver desligado! Todas as respostas e XP são salvos localmente no navegador e sincronizados automaticamente com o MySQL assim que o servidor for ligado na rede.

---

## 🐬 Como Configurar o Banco MySQL e MySQL Workbench

### 1. Iniciar o Banco e Importar Dados
Basta executar o script automático na raiz do projeto:
```bash
./iniciar-mysql-e-banco.sh
```
Este script:
1. Inicia o serviço do MySQL/MariaDB.
2. Cria o banco `vestbot_db` e o usuário `vestbot`.
3. Importa automaticamente todas as **2.005 questões**, alternativas, **2.005 resoluções passo a passo** e histórico do Davi para o MySQL!

### 2. Conectar no MySQL Workbench
Abra o **MySQL Workbench** instalado na máquina e crie uma nova conexão:
- **Connection Name**: `VestBot Local`
- **Hostname**: `127.0.0.1` (ou `localhost`)
- **Port**: `3306`
- **Username**: `vestbot`
- **Password**: `vestbot123`
- **Default Schema**: `vestbot_db`

Clique em **Test Connection** e depois conecte! Você poderá rodar queries como:
```sql
-- Ver progresso geral do Davi
SELECT * FROM user_profiles WHERE user_id = 1;

-- Ver histórico recente de respostas
SELECT h.timestamp, q.materia, q.dificuldade, LEFT(q.enunciado, 50) AS questao, h.was_correct
FROM user_question_history h
JOIN questions q ON h.question_id = q.id
ORDER BY h.timestamp DESC LIMIT 10;
```

---

## 🚀 Como Executar o VestBot

### 1. Instalação

```bash
cd VestBot
npm install --legacy-peer-deps
```

### 2. Executar Localmente

#### 🐧 Linux / 🍎 macOS

```bash
npm run dev
```

O aplicativo abrirá em `http://localhost:4200`

> **💡 Dica:** O comando `npm run dev` padrão pode fechar após 30 minutos de inatividade. Se você precisa deixar o servidor rodando por mais tempo, use:
>
> ```bash
> npm run dev-extended
> ```
> 
> Este comando mantém o servidor ativo indefinidamente, ideal para sessões de estudo longas!

#### 🪟 Windows

**Método Simples (Recomendado):**

1. Dê **duplo clique** em `start-vestbot.bat`
2. Aguarde o script:
   - ✅ Instalar dependências (primeira vez)
   - ✅ Iniciar backend (porta 3001)
   - ✅ Iniciar frontend (porta 3000)
   - ✅ Abrir navegador automaticamente
3. Use o VestBot! 🎓

**⚠️ Windows Security bloqueando?**
- Veja [WINDOWS_SECURITY.md](WINDOWS_SECURITY.md) para adicionar exceção
- Leia [LEIA-ME-SEGURANCA.txt](LEIA-ME-SEGURANCA.txt) para entender por que é seguro
- O VestBot é 100% seguro e open source!

**Documentação Completa para Windows:**
- [WINDOWS_GUIDE.md](WINDOWS_GUIDE.md) - Guia de uso completo
- [WINDOWS_SECURITY.md](WINDOWS_SECURITY.md) - Como adicionar exceção no antivírus
- [CHANGELOG_SEGURANCA.md](CHANGELOG_SEGURANCA.md) - Detalhes das melhorias de segurança

### 3. Usar Simulados Offline

1. Acesse a seção **"Simulado"** no menu lateral
2. As questões serão carregadas automaticamente dos arquivos locais
3. Configure seu simulado:
   - Selecione as matérias desejadas
   - Escolha a quantidade de questões (até 600+)
   - Defina a dificuldade (Fácil, Médio, Difícil ou Mista)
   - Configure o tempo (padrão: 4 horas)
4. Clique em **"Iniciar Simulado"**
5. Responda as questões e veja seu desempenho!

## 🔧 Formato dos Arquivos de Questões

Os arquivos na pasta `questions/` seguem este formato JSON:

```json
[
  {
    "id": 1,
    "materia": "Biologia",
    "dificuldade": "Fácil",
    "enunciado": "Texto da questão...",
    "alternativas": [
      "Opção A",
      "Opção B",
      "Opção C",
      "Opção D",
      "Opção E"
    ],
    "correta": "Opção C",
    "explicacao_base": "Explicação da resposta correta..."
  }
]
```

### Adicionar Novas Questões

1. Edite qualquer arquivo `.txt` na pasta `questions/`
2. Adicione novas questões seguindo o formato acima
3. Recarregue a página - as questões serão carregadas automaticamente

## 📊 Estatísticas e Gamificação

O sistema mantém suas estatísticas localmente:
- **XP**: Ganhe 50 XP por resposta correta, 10 XP por tentativa
- **Níveis**: Suba de nível a cada 1000 XP
- **Streak**: Mantenha uma sequência de acertos
- **Histórico**: Acompanhe questões respondidas e taxa de acerto

## 🌐 Modo Online (Opcional)

Para usar funcionalidades de IA (chat, correção de redações):

1. Obtenha uma chave da API Gemini em https://ai.google.dev/
2. Adicione no arquivo `.env.local`:
   ```
   API_KEY=sua_chave_aqui
   ```
3. Reinicie o servidor

## 🛠️ Arquitetura Técnica

### Serviços Principais

- **QuestionLoaderService**: Carrega e converte questões dos arquivos JSON
- **ContentService**: Gerencia questões, estatísticas e cronograma
- **GeminiService**: Funcionalidades de IA (opcional, com fallback offline)

### Fluxo de Carregamento

1. App inicia → `QuizComponent` carrega questões
2. `ContentService.loadQuestionsFromFiles()` é chamado
3. `QuestionLoaderService` faz fetch dos arquivos JSON
4. Questões são convertidas para o formato interno
5. Cache é mantido em memória para performance

## 🐛 Solução de Problemas

### Questões não carregam
- Verifique se os arquivos estão em `/questions/`
- Abra o console do navegador (F12) para ver erros
- Certifique-se de que os arquivos são JSON válido

### Erro ao iniciar simulado
- Verifique se selecionou pelo menos uma matéria
- Tente reduzir a quantidade de questões
- Limpe o cache do navegador

### Performance lenta
- O carregamento inicial pode levar alguns segundos
- Após o primeiro carregamento, as questões ficam em cache
- Considere reduzir o número de questões no simulado

## 📝 Notas Importantes

- ✅ **100% offline** para simulados
- ✅ Não requer API key para funcionalidade básica
- ✅ Questões carregadas automaticamente
- ✅ Explicações incluídas quando disponíveis
- ⚠️ Funcionalidades de IA requerem internet e API key

## 🤝 Contribuindo

Para adicionar mais questões:
1. Edite os arquivos em `questions/`
2. Siga o formato JSON especificado
3. Teste localmente antes de compartilhar

## 📄 Licença

Este projeto é para fins educacionais.
