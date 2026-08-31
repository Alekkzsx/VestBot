document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-engenharia');
  const checkInterpretacao = document.getElementById('check-interpretacao');
  const containerTextoBase = document.getElementById('container-texto-base');
  const containerAlternativas = document.getElementById('container-alternativas');
  
  // Letras das alternativas
  const letras = ['A', 'B', 'C', 'D', 'E'];

  // Renderizar alternativas
  function renderizarAlternativas() {
    let html = '';
    letras.forEach((letra, index) => {
      html += `
        <div class="flex items-start gap-3">
          <div class="mt-3">
            <input type="radio" name="radio-correta" value="${letra}" class="w-4 h-4 text-blue-600 cursor-pointer" ${index === 0 ? 'checked' : ''}>
          </div>
          <div class="flex-1 flex gap-3 items-center">
            <div class="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-500 shrink-0">
              ${letra}
            </div>
            <textarea id="alt-${letra}" rows="2" class="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm custom-scrollbar" placeholder="Texto da alternativa ${letra}" required></textarea>
          </div>
        </div>
      `;
    });
    containerAlternativas.innerHTML = html;
  }

  // Toggle do texto base
  checkInterpretacao.addEventListener('change', (e) => {
    if (e.target.checked) {
      containerTextoBase.classList.remove('hidden');
      document.getElementById('input-texto-conteudo').required = true;
    } else {
      containerTextoBase.classList.add('hidden');
      document.getElementById('input-texto-conteudo').required = false;
    }
  });

  // Submit do Form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnSalvar = document.getElementById('btn-salvar');
    const originalText = btnSalvar.innerHTML;
    btnSalvar.disabled = true;
    btnSalvar.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Salvando...`;

    try {
      // Coletar Alternativas
      const alternativas = letras.map(letra => {
        return {
          letra: letra,
          texto: document.getElementById(`alt-${letra}`).value
        };
      });

      // Pegar a correta
      const correta = document.querySelector('input[name="radio-correta"]:checked').value;

      // Montar Payload
      const payload = {
        isInterpretacao: checkInterpretacao.checked,
        disciplina: document.getElementById('input-disciplina').value,
        assunto: document.getElementById('input-assunto').value,
        fonteProva: document.getElementById('input-fonte').value,
        anoProva: document.getElementById('input-ano').value,
        dificuldade: "Médio", // Pode adicionar select depois
        enunciado: document.getElementById('input-enunciado').value,
        alternativas: alternativas,
        alternativaCorreta: correta,
        explicacaoResolucao: document.getElementById('input-resolucao').value,
        // Texto Base
        textoBaseTitulo: document.getElementById('input-texto-titulo').value,
        textoBaseConteudo: document.getElementById('input-texto-conteudo').value
      };

      const response = await fetch('http://localhost:3000/api/engenharia/questoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ ' + result.mensagem);
        // Limpar partes do form, mas manter disciplina e texto base para facilitar cadastro em massa
        document.getElementById('input-enunciado').value = '';
        letras.forEach(letra => document.getElementById(`alt-${letra}`).value = '');
        document.getElementById('input-resolucao').value = '';
        
        // Se quiser manter o texto base atrelado (ID), precisaríamos adicionar essa lógica no front
        // Mas por ora, para UX simples, limpamos o texto base também:
        if (!confirm("Deseja manter o mesmo texto base para a próxima questão?")) {
           document.getElementById('input-texto-conteudo').value = '';
           document.getElementById('input-texto-titulo').value = '';
        }
        
      } else {
        alert('❌ Erro: ' + result.erro);
      }

    } catch (error) {
      console.error(error);
      alert('❌ Falha de comunicação com o servidor.');
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.innerHTML = originalText;
    }
  });

  // Limpar form
  document.getElementById('btn-limpar').addEventListener('click', () => {
    if(confirm('Limpar todo o formulário?')) form.reset();
  });

  // Inicialização
  renderizarAlternativas();
});
