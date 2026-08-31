document.addEventListener('DOMContentLoaded', () => {
  
  // === MOCK DE DADOS COMPLETO ===
  const textosBase = [
    {
      id: "txt_01",
      tema: "Artigo de Opinião",
      titulo: "A Inteligência Artificial na Educação: Aliada ou Ameaça?",
      texto: `
        <p>Nos últimos anos, o avanço desenfreado das tecnologias de inteligência artificial gerou intensos debates sobre o papel do professor em sala de aula. Muitos temem que a automação substitua a figura humana, transformando a educação em uma linha de montagem fria e impessoal.</p>
        <br>
        <p>Entretanto, pedagogos modernos argumentam que ferramentas algorítmicas devem ser vistas como extensões da capacidade didática. Elas são capazes de auxiliar na personalização do ensino, adaptando o ritmo de aprendizado para cada aluno, e liberando o educador das tarefas burocráticas, como a correção massiva de provas de múltipla escolha.</p>
        <br>
        <p>A verdadeira questão não é <i>se</i> a tecnologia vai transformar a escola, mas <i>como</i> iremos direcionar essa transformação para mitigar desigualdades em vez de agravá-las. Afinal, uma IA avançada nas mãos de uma escola de elite pode aumentar o abismo educacional se as escolas públicas não tiverem o mesmo acesso.</p>
        <br>
        <p>Conclui-se, portanto, que o professor do futuro não será um transmissor de conteúdo, mas um curador de conhecimento e um mentor emocional, algo que as máquinas, até o presente momento, são incapazes de replicar.</p>
      `,
      questoes: [
        {
          id: "q_int_01",
          enunciado: "Qual é a tese principal defendida pelos pedagogos modernos, segundo o texto?",
          alternativas: [
            { letra: "A", texto: "A IA irá inevitavelmente substituir a figura do professor em poucos anos." },
            { letra: "B", texto: "A tecnologia deve ser usada como suporte didático e libertação burocrática." },
            { letra: "C", texto: "A escola deve barrar o uso de tecnologias para evitar o aumento das desigualdades." },
            { letra: "D", texto: "O professor do futuro focará apenas em tarefas burocráticas." }
          ],
          correta: "B"
        },
        {
          id: "q_int_02",
          enunciado: "O autor do texto alerta para um risco social caso a implementação da IA na educação não seja bem direcionada. Que risco é esse?",
          alternativas: [
            { letra: "A", texto: "A perda total da capacidade de raciocínio lógico dos alunos." },
            { letra: "B", texto: "A extinção imediata das escolas públicas." },
            { letra: "C", texto: "O agravamento das desigualdades entre escolas de elite e públicas." },
            { letra: "D", texto: "A substituição dos curadores de conhecimento por robôs." }
          ],
          correta: "C"
        }
      ]
    },
    {
      id: "txt_02",
      tema: "Poesia Moderna",
      titulo: "Retrato",
      texto: `
        <p class="italic font-serif">"Eu não tinha este rosto de hoje,<br>
        Assim calmo, assim triste, assim magro,<br>
        Nem estes olhos tão vazios,<br>
        Nem o lábio amargo.</p>
        <br>
        <p class="italic font-serif">Eu não dei por esta mudança,<br>
        Tão simples, tão certa, tão fácil: —<br>
        Em que espelho ficou perdida<br>
        A minha face?"</p>
        <br>
        <p class="text-sm text-slate-500 text-right mt-4">- Cecília Meireles</p>
      `,
      questoes: [
        {
          id: "q_int_03",
          enunciado: "No poema 'Retrato', o eu lírico expressa principalmente um sentimento de:",
          alternativas: [
            { letra: "A", texto: "Alegria pelas mudanças trazidas pela maturidade." },
            { letra: "B", texto: "Indiferença perante a passagem do tempo." },
            { letra: "C", texto: "Perplexidade e estranhamento diante do envelhecimento." },
            { letra: "D", texto: "Raiva pela perda da juventude." }
          ],
          correta: "C"
        },
        {
          id: "q_int_04",
          enunciado: "A pergunta final 'Em que espelho ficou perdida / A minha face?' sugere que:",
          alternativas: [
            { letra: "A", texto: "O eu lírico perdeu seu espelho favorito." },
            { letra: "B", texto: "A verdadeira essência do eu lírico se perdeu de forma sutil ao longo do tempo." },
            { letra: "C", texto: "A beleza física foi roubada por alguém." },
            { letra: "D", texto: "Houve uma mudança repentina e drástica causada por uma doença." }
          ],
          correta: "B"
        }
      ]
    }
  ];

  // === ESTADO GLOBAL ===
  let estadoAtual = 'LOBBY'; 
  let materiaSelecionada = '';
  
  // Game State
  let textoAtualIndex = 0;
  let questaoAtualIndex = 0;
  let respostasUsuario = {};
  
  // Timer State
  let tempoTotalSegundos = 45 * 60; // 45 minutos
  let tempoRestante = tempoTotalSegundos;
  let timerInterval = null;

  const appContainer = document.getElementById('interpretacao-app');

  // === RENDERIZAÇÃO PRINCIPAL ===
  function render() {
    if (estadoAtual === 'LOBBY') {
      renderLobby();
    } else if (estadoAtual === 'IN_GAME') {
      renderInGame();
    } else if (estadoAtual === 'FEEDBACK') {
      renderFeedback();
    }
  }

  // === LOBBY ===
  function renderLobby() {
    const materias = [
      { id: 'portugues', nome: 'Língua Portuguesa', icone: 'fa-book' },
      { id: 'historia', nome: 'História', icone: 'fa-monument' },
      { id: 'geografia', nome: 'Geografia', icone: 'fa-globe-americas' },
      { id: 'biologia', nome: 'Biologia', icone: 'fa-leaf' },
      { id: 'inter', nome: 'Interdisciplinar', icone: 'fa-brain' }
    ];

    let html = `
      <div class="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in mt-6">
        
        <div class="p-8 md:p-12 text-center border-b border-slate-100 bg-slate-50">
          <div class="w-16 h-16 bg-black rounded-2xl mx-auto flex items-center justify-center text-white text-3xl mb-6">
            <i class="fas fa-search-plus"></i>
          </div>
          <h2 class="text-3xl font-black text-slate-900 mb-4">Missão de Interpretação</h2>
          <p class="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Neste modo, sua capacidade de leitura ativa e retenção será testada ao limite.
          </p>
        </div>

        <div class="p-8 md:p-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
              <i class="fas fa-file-alt text-2xl text-indigo-500 mb-3"></i>
              <h4 class="font-bold text-slate-900">5 Textos Âncora</h4>
              <p class="text-xs text-slate-600 mt-1">Textões complexos</p>
            </div>
            <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
              <i class="fas fa-list-ol text-2xl text-emerald-500 mb-3"></i>
              <h4 class="font-bold text-slate-900">1 a 4 Questões</h4>
              <p class="text-xs text-slate-600 mt-1">Por texto lido</p>
            </div>
            <div class="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
              <i class="fas fa-stopwatch text-2xl text-amber-500 mb-3"></i>
              <h4 class="font-bold text-slate-900">45 Minutos</h4>
              <p class="text-xs text-slate-600 mt-1">Tempo regressivo</p>
            </div>
          </div>

          <h3 class="font-bold text-slate-900 text-xl mb-4">Escolha a Disciplina:</h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10" id="materia-grid">
            ${materias.map(m => `
              <button data-materia="${m.id}" class="materia-btn py-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-slate-200 text-slate-500 hover:border-black hover:text-black transition-colors">
                <i class="fas ${m.icone} text-2xl"></i>
                <span class="text-[10px] font-bold uppercase tracking-wider">${m.nome}</span>
              </button>
            `).join('')}
          </div>

          <button id="btn-iniciar" disabled class="w-full bg-slate-300 text-slate-500 font-bold py-5 rounded-2xl transition-all text-lg">
            Selecione uma disciplina
          </button>
        </div>
      </div>
    `;

    appContainer.innerHTML = html;

    const btns = document.querySelectorAll('.materia-btn');
    const btnIniciar = document.getElementById('btn-iniciar');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => {
          b.classList.remove('border-black', 'text-black', 'bg-slate-50');
          b.classList.add('border-slate-200', 'text-slate-500');
        });
        btn.classList.remove('border-slate-200', 'text-slate-500');
        btn.classList.add('border-black', 'text-black', 'bg-slate-50');
        
        materiaSelecionada = btn.getAttribute('data-materia');
        
        btnIniciar.disabled = false;
        btnIniciar.className = "w-full bg-black text-white font-bold py-5 rounded-2xl hover:bg-slate-800 hover:shadow-lg transition-all text-lg";
        btnIniciar.textContent = "Iniciar Missão";
      });
    });

    if (btnIniciar) {
      btnIniciar.addEventListener('click', () => {
        if (!materiaSelecionada) return;
        estadoAtual = 'IN_GAME';
        iniciarTimer();
        render();
      });
    }
  }

  // === TIMER ===
  function iniciarTimer() {
    tempoRestante = tempoTotalSegundos;
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
      tempoRestante--;
      atualizarTimerUI();
      if (tempoRestante <= 0) {
        clearInterval(timerInterval);
        estadoAtual = 'FEEDBACK';
        render();
      }
    }, 1000);
  }

  function atualizarTimerUI() {
    const min = Math.floor(tempoRestante / 60).toString().padStart(2, '0');
    const sec = (tempoRestante % 60).toString().padStart(2, '0');
    const el = document.getElementById('hud-timer');
    if (el) {
      el.textContent = `${min}:${sec}`;
      if (tempoRestante < 300) el.classList.add('text-red-500', 'animate-pulse');
    }
  }

  // === IN GAME (Split Screen) ===
  function renderInGame() {
    const textoObj = textosBase[textoAtualIndex];
    const questaoObj = textoObj.questoes[questaoAtualIndex];
    
    const min = Math.floor(tempoRestante / 60).toString().padStart(2, '0');
    const sec = (tempoRestante % 60).toString().padStart(2, '0');

    let html = `
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[75vh] animate-fade-in mt-6">
        
        <!-- Top HUD -->
        <div class="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shrink-0">
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Texto ${textoAtualIndex + 1} de 5</span>
            <span class="bg-white/10 px-3 py-1 rounded text-xs font-bold">${materiaSelecionada.toUpperCase()}</span>
          </div>
          <div class="flex items-center gap-2 font-mono text-lg font-bold">
            <i class="far fa-clock text-slate-400"></i>
            <span id="hud-timer">${min}:${sec}</span>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          <!-- Lado Esquerdo: TEXTO (Rolável) -->
          <div class="lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-slate-200 bg-amber-50/30 overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between mb-6">
              <span class="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">${textoObj.tema}</span>
            </div>
            <h3 class="font-bold text-2xl text-slate-900 mb-6 font-serif leading-snug">${textoObj.titulo}</h3>
            <div class="prose prose-slate text-base leading-loose text-slate-700">
              ${textoObj.texto}
            </div>
          </div>

          <!-- Lado Direito: QUIZ -->
          <div class="lg:w-1/2 p-8 bg-white flex flex-col overflow-y-auto custom-scrollbar relative">
            
            <div class="flex items-center justify-between mb-6">
              <span class="text-indigo-500 font-black text-sm uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                Questão ${questaoAtualIndex + 1} de ${textoObj.questoes.length}
              </span>
            </div>
            
            <p class="font-bold text-slate-900 text-lg mb-6 leading-snug">${questaoObj.enunciado}</p>
            
            <div class="space-y-3 mb-8">
              ${questaoObj.alternativas.map(alt => {
                const isSelected = respostasUsuario[questaoObj.id] === alt.letra;
                return `
                  <label class="flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer 
                    ${isSelected ? 'border-black bg-slate-50 shadow-sm' : 'border-slate-200 hover:border-slate-400 bg-white'}">
                    <input type="radio" name="${questaoObj.id}" value="${alt.letra}" class="mt-1" ${isSelected ? 'checked' : ''}>
                    <span class="text-sm ${isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}">${alt.texto}</span>
                  </label>
                `;
              }).join('')}
            </div>

            <!-- Navegação -->
            <div class="flex gap-4 mt-auto pt-6 border-t border-slate-100">
              <button id="btn-ant" class="flex-1 bg-white text-slate-700 border border-slate-200 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-arrow-left mr-2"></i> Anterior
              </button>
              
              <button id="btn-prox" class="flex-1 bg-black text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                ${isUltimaQuestaoGlobal() ? '<i class="fas fa-check-circle mr-2"></i> Finalizar Missão' : 'Próxima <i class="fas fa-arrow-right ml-2"></i>'}
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    appContainer.innerHTML = html;
    atualizarTimerUI(); 
    bindGameEvents(questaoObj.id);
  }

  function isUltimaQuestaoGlobal() {
    const isUltimoTexto = textoAtualIndex === textosBase.length - 1;
    const isUltimaQuestaoDoTexto = questaoAtualIndex === textosBase[textoAtualIndex].questoes.length - 1;
    return isUltimoTexto && isUltimaQuestaoDoTexto;
  }

  function bindGameEvents(questaoId) {
    const radios = document.querySelectorAll(`input[name="${questaoId}"]`);
    radios.forEach(r => {
      r.addEventListener('change', (e) => {
        respostasUsuario[questaoId] = e.target.value;
        renderInGame();
      });
    });

    const btnAnt = document.getElementById('btn-ant');
    const btnProx = document.getElementById('btn-prox');

    if (textoAtualIndex === 0 && questaoAtualIndex === 0) {
      btnAnt.disabled = true;
    }

    btnAnt.addEventListener('click', () => {
      if (questaoAtualIndex > 0) {
        questaoAtualIndex--;
      } else if (textoAtualIndex > 0) {
        textoAtualIndex--;
        questaoAtualIndex = textosBase[textoAtualIndex].questoes.length - 1;
      }
      render();
    });

    btnProx.addEventListener('click', () => {
      if (!respostasUsuario[questaoId]) {
        alert('Por favor, selecione uma alternativa.');
        return;
      }

      if (isUltimaQuestaoGlobal()) {
        if(timerInterval) clearInterval(timerInterval);
        estadoAtual = 'FEEDBACK';
        render();
        return;
      }

      if (questaoAtualIndex < textosBase[textoAtualIndex].questoes.length - 1) {
        questaoAtualIndex++;
      } else {
        textoAtualIndex++;
        questaoAtualIndex = 0;
      }
      render();
    });
  }

  // === FEEDBACK ===
  async function renderFeedback() {
    const tempoGastoSecs = tempoTotalSegundos - Math.max(0, tempoRestante);
    const minGasto = Math.floor(tempoGastoSecs / 60);
    
    let acertos = 0;
    let totalQ = 0;
    let questoesFlatten = [];

    textosBase.forEach(txt => {
      txt.questoes.forEach(q => {
        totalQ++;
        questoesFlatten.push(q);
        if (respostasUsuario[q.id] === q.correta) {
          acertos++;
        }
      });
    });

    const pct = Math.round((acertos / totalQ) * 100) || 0;
    const tempoPorQuestao = Math.floor(tempoGastoSecs / totalQ);

    let html = `
      <div class="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in text-center p-12 mt-6">
        <div class="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 border-4 ${pct >= 70 ? 'border-green-500' : (pct >= 40 ? 'border-amber-500' : 'border-red-500')}">
          <i class="fas fa-trophy text-4xl ${pct >= 70 ? 'text-green-500' : (pct >= 40 ? 'text-amber-500' : 'text-red-500')}"></i>
        </div>
        
        <h2 class="text-3xl font-black text-slate-900 mb-2">Missão Concluída!</h2>
        <p class="text-slate-500 mb-8">Aqui está o seu desempenho em ${materiaSelecionada.toUpperCase()}</p>

        <div class="grid grid-cols-3 gap-4 mb-10">
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div class="text-slate-400 text-sm font-bold uppercase mb-2">Acertos</div>
            <div class="text-3xl font-black text-slate-900">${acertos}<span class="text-lg text-slate-400">/${totalQ}</span></div>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div class="text-slate-400 text-sm font-bold uppercase mb-2">Aproveitamento</div>
            <div class="text-3xl font-black ${pct >= 70 ? 'text-green-500' : (pct >= 40 ? 'text-amber-500' : 'text-red-500')}">${pct}%</div>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div class="text-slate-400 text-sm font-bold uppercase mb-2">Tempo Gasto</div>
            <div class="text-3xl font-black text-slate-900">${minGasto}m</div>
          </div>
        </div>

        <div class="text-left bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 mb-10">
          <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
          <div>
            <h4 class="font-bold text-blue-900 text-sm">Dados Sincronizados</h4>
            <p class="text-blue-700 text-xs mt-1">O seu tempo médio (${tempoPorQuestao}s por questão) e seus acertos foram salvos no cofre offline. Eles irão atualizar sua aba Analítica.</p>
          </div>
        </div>

        <button onclick="window.location.reload()" class="bg-black text-white font-bold py-4 px-10 rounded-2xl hover:bg-slate-800 hover:shadow-lg transition-all">
          Retornar ao Lobby
        </button>
      </div>
    `;

    appContainer.innerHTML = html;

    for (const q of questoesFlatten) {
      const marcada = respostasUsuario[q.id] || null;
      const acertou = marcada === q.correta;
      if (window.registrarResolucaoLocal && marcada) {
        await window.registrarResolucaoLocal(
          q.id,
          marcada,
          acertou,
          tempoPorQuestao,
          null,
          null
        );
      }
    }
  }

  // === START APP ===
  render();

});
