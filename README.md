# ETEC Prep

Plataforma completa de preparação para o **Vestibulinho ETEC** impulsionada por IA.

## 🎯 Funcionalidades

- **📚 Plano de Estudos**: Gere um cronograma semanal personalizado baseado no curso técnico desejado e suas horas disponíveis
- **🧠 Simulados & Questões**: Pratique com questões estilo ETEC geradas por IA, focadas no conteúdo do Ensino Fundamental II
- **✍️ Análise de Texto**: Receba feedback detalhado sobre seus textos dissertativos
- **💬 Tutor Virtual**: Tire dúvidas sobre qualquer matéria do Ensino Fundamental II com um tutor especializado em ETEC

## 🚀 Como Usar

### Pré-requisitos

- Node.js instalado
- Chave de API do Google Gemini

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Alekkzsx/iVest.git
cd iVest
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a chave da API:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione sua chave do Gemini:
```
API_KEY=sua_chave_gemini_aqui
```

4. Execute o projeto:
```bash
npm run dev
```

5. Acesse http://localhost:5173 no seu navegador

## 📖 Sobre o Vestibulinho ETEC

O Vestibulinho ETEC é o processo seletivo para ingresso nos cursos técnicos das Escolas Técnicas Estaduais (ETECs) do Centro Paula Souza, no estado de São Paulo. A prova avalia conhecimentos do Ensino Fundamental II nas seguintes disciplinas:

- Matemática
- Português
- História
- Geografia
- Ciências
- Inglês

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Estilização**: TailwindCSS
- **IA**: Google Gemini API (gemini-2.5-flash)
- **Ícones**: Lucide React

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.
