document.addEventListener('DOMContentLoaded', async () => {
  const containerSemanas = document.getElementById('container-semanas');
  const btnGerarIA = document.getElementById('btn-gerar-ia');
  
  const diasDaSemana = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
    'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
  ];

  // Templates de atividades geradas pela "IA"
  const atividadesTemplate = [
    { dia: 'Segunda-feira', materia: 'Matemática', topico: 'Equação de 2º Grau e Bhaskara', duracao: '1h 30min', tipo: 'estudo', color: 'blue' },
    { dia: 'Segunda-feira', materia: 'História', topico: 'Revolução Industrial', duracao: '1h 00min', tipo: 'estudo', color: 'amber' },
    { dia: 'Terça-feira', materia: 'Português', topico: 'Figuras de Linguagem', duracao: '1h 30min', tipo: 'estudo', color: 'blue' },
    { dia: 'Terça-feira', materia: 'Simulado', topico: 'Simulado Rápido (15 Questões)', duracao: '45min', tipo: 'pratica', color: 'purple' },
    { dia: 'Quarta-feira', materia: 'Ciências', topico: 'Genética e Leis de Mendel', duracao: '1h 30min', tipo: 'estudo', color: 'emerald' },
    { dia: 'Quarta-feira', materia: 'Geografia', topico: 'Biomas Brasileiros', duracao: '1h 00min', tipo: 'estudo', color: 'amber' },
    { dia: 'Quinta-feira', materia: 'Matemática', topico: 'Regra de Três Simples e Composta', duracao: '1h 30min', tipo: 'estudo', color: 'blue' },
    { dia: 'Quinta-feira', materia: 'Física', topico: 'Cinemática: Velocidade Média', duracao: '1h 00min', tipo: 'estudo', color: 'emerald' },
    { dia: 'Sexta-feira', materia: 'Português', topico: 'Interpretação de Textos', duracao: '1h 30min', tipo: 'pratica', color: 'blue' },
    { dia: 'Sexta-feira', materia: 'Química', topico: 'Tabela Periódica e Ligações', duracao: '1h 00min', tipo: 'estudo', color: 'emerald' },
    { dia: 'Sábado', materia: 'Simulado', topico: 'Simulado Completo ETEC', duracao: '4h 00min', tipo: 'pratica', color: 'purple' },
    { dia: 'Domingo', materia: 'Descanso', topico: 'Dia Livre para Lazer', duracao: '24h', tipo: 'descanso', color: 'slate' }
  ];

  // Inicializar Tela
  await carregarCronograma();

  // Função para renderizar o Cronograma
  async function carregarCronograma() {
    try {
      const atividades = await db.cronograma.toArray();
      
      if (atividades.length === 0) {
        renderizarEstadoVazio();
        return;
      }

      renderizarVisaoSemanal(atividades);
      atualizarProgressoGlobal(atividades);
    } catch (e) {
      console.error("Erro ao carregar cronograma:", e);
    }
  }

  function renderizarEstadoVazio() {
    containerSemanas.innerHTML = `
      <div class="col-span-full bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 shadow-sm">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 text-3xl">
          <i class="fas fa-magic"></i>
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-2">Seu Cronograma está vazio</h3>
        <p class="text-slate-500 mb-8 max-w-md mx-auto">Não perca tempo configurando manualmente. Deixe nossa IA montar a trilha ideal de estudos baseada nos assuntos que mais caem na ETEC.</p>
        <button id="btn-gerar-vazio" class="bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          <i class="fas fa-bolt text-yellow-400 mr-2"></i> Gerar Cronograma Inteligente
        </button>
      </div>
    `;

    document.getElementById('btn-gerar-vazio').addEventListener('click', gerarCronogramaInteligente);
  }

  function renderizarVisaoSemanal(atividades) {
    containerSemanas.innerHTML = '';

    diasDaSemana.forEach(dia => {
      const atividadesDoDia = atividades.filter(a => a.dia_semana === dia);
      const total = atividadesDoDia.length;
      const concluidas = atividadesDoDia.filter(a => a.concluido).length;
      const porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;
      
      const isHoje = false; // Lógica de hoje pode ser adicionada depois (pegando o getDay do JS)

      let htmlDia = `
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full opacity-0 animate-fade-in" style="animation-delay: ${diasDaSemana.indexOf(dia) * 0.1}s">
          <div class="p-5 border-b border-slate-100 ${isHoje ? 'bg-black text-white' : 'bg-slate-50'}">
            <div class="flex justify-between items-center mb-3">
              <h4 class="font-bold text-lg ${isHoje ? 'text-white' : 'text-slate-900'}">${dia}</h4>
              <span class="text-[10px] font-bold uppercase tracking-widest ${isHoje ? 'text-slate-300' : 'text-slate-400'}">${concluidas}/${total}</span>
            </div>
            <!-- Progress Bar Diária -->
            <div class="w-full h-1.5 ${isHoje ? 'bg-white/20' : 'bg-slate-200'} rounded-full overflow-hidden">
              <div class="h-full bg-${porcentagem === 100 ? 'green' : 'blue'}-500 transition-all duration-500" style="width: ${porcentagem}%"></div>
            </div>
          </div>
          <div class="p-4 flex-1 space-y-3 bg-white">
      `;

      if (total === 0) {
        htmlDia += `
          <div class="text-center py-6">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Livre</span>
          </div>
        `;
      } else {
        atividadesDoDia.forEach(ativ => {
          htmlDia += `
            <div class="p-4 rounded-2xl border ${ativ.concluido ? 'border-green-200 bg-green-50/50' : 'border-slate-100 hover:border-slate-300 bg-white hover:shadow-sm'} transition-all cursor-pointer group card-atividade" data-id="${ativ.id}">
              <div class="flex items-start gap-3">
                <div class="mt-0.5 checkbox-btn shrink-0 w-5 h-5 rounded-md border-2 ${ativ.concluido ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 text-transparent group-hover:border-slate-400'} flex items-center justify-center transition-all">
                  <i class="fas fa-check text-[10px]"></i>
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-${getColorByMateria(ativ.materia)}-600">${ativ.materia}</span>
                    <span class="text-[10px] font-bold text-slate-400"><i class="far fa-clock mr-1"></i>${ativ.duracao}</span>
                  </div>
                  <h5 class="font-bold text-sm ${ativ.concluido ? 'text-slate-500 line-through' : 'text-slate-800'}">${ativ.topico}</h5>
                </div>
              </div>
            </div>
          `;
        });
      }

      htmlDia += `
          </div>
        </div>
      `;

      containerSemanas.insertAdjacentHTML('beforeend', htmlDia);
    });

    // Adicionar eventos de clique para marcar como concluído
    document.querySelectorAll('.card-atividade').forEach(card => {
      card.addEventListener('click', async function() {
        const id = parseInt(this.dataset.id);
        const atividade = await db.cronograma.get(id);
        if (atividade) {
          await db.cronograma.update(id, { concluido: !atividade.concluido });
          carregarCronograma(); // re-renderiza
        }
      });
    });
  }

  function getColorByMateria(materia) {
    const map = {
      'Matemática': 'blue',
      'Português': 'blue',
      'História': 'amber',
      'Geografia': 'amber',
      'Ciências': 'emerald',
      'Física': 'emerald',
      'Química': 'emerald',
      'Simulado': 'purple',
      'Descanso': 'slate'
    };
    return map[materia] || 'slate';
  }

  function atualizarProgressoGlobal(atividades) {
    const total = atividades.filter(a => a.materia !== 'Descanso').length;
    const concluidas = atividades.filter(a => a.concluido && a.materia !== 'Descanso').length;
    const porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    const elPorcentagem = document.getElementById('progresso-semanal-texto');
    const elBarra = document.getElementById('progresso-semanal-barra');
    
    if (elPorcentagem) elPorcentagem.textContent = `${porcentagem}% Concluído`;
    if (elBarra) elBarra.style.width = `${porcentagem}%`;
  }

  async function gerarCronogramaInteligente() {
    // Confirmação para não sobrescrever se já tiver
    const contagem = await db.cronograma.count();
    if (contagem > 0) {
      if (!confirm("Isso irá apagar seu cronograma atual e gerar um novo. Deseja continuar?")) {
        return;
      }
      await db.cronograma.clear();
    }

    // "Efeito IA" - Loading
    btnGerarIA.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Gerando trilha...';
    btnGerarIA.disabled = true;

    setTimeout(async () => {
      // Prepara as atividades com data de geração
      const paraInserir = atividadesTemplate.map(a => ({
        dia_semana: a.dia,
        materia: a.materia,
        topico: a.topico,
        duracao: a.duracao,
        concluido: false,
        tipo: a.tipo,
        data_geracao: new Date().toISOString()
      }));

      await db.cronograma.bulkAdd(paraInserir);
      
      btnGerarIA.innerHTML = '<i class="fas fa-bolt text-yellow-400 mr-2"></i> Gerar Novo';
      btnGerarIA.disabled = false;
      
      carregarCronograma();
    }, 1200); // delay fake de "IA pensando"
  }

  // Evento do botão principal do cabeçalho
  if(btnGerarIA) {
    btnGerarIA.addEventListener('click', gerarCronogramaInteligente);
  }

  // --- LÓGICA DO MODAL DE CUSTOMIZAÇÃO ---
  const btnAbrirModal = document.getElementById('btn-abrir-modal');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const modalAtividade = document.getElementById('modal-atividade');
  const formAtividade = document.getElementById('form-atividade');

  if (btnAbrirModal && modalAtividade && btnFecharModal) {
    btnAbrirModal.addEventListener('click', () => {
      modalAtividade.classList.remove('hidden');
      // Timeout para permitir transição do opacity
      setTimeout(() => {
        modalAtividade.classList.remove('opacity-0');
        modalAtividade.querySelector('div').classList.remove('scale-95');
      }, 10);
    });

    const fecharModal = () => {
      modalAtividade.classList.add('opacity-0');
      modalAtividade.querySelector('div').classList.add('scale-95');
      setTimeout(() => {
        modalAtividade.classList.add('hidden');
      }, 300);
    };

    btnFecharModal.addEventListener('click', fecharModal);

    formAtividade.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const dia = document.getElementById('input-dia').value;
      const materia = document.getElementById('input-materia').value;
      const topico = document.getElementById('input-topico').value;
      const duracao = document.getElementById('input-duracao').value;

      const novaAtividade = {
        dia_semana: dia,
        materia: materia,
        topico: topico,
        duracao: duracao,
        concluido: false,
        tipo: 'custom',
        data_geracao: new Date().toISOString()
      };

      try {
        await db.cronograma.add(novaAtividade);
        fecharModal();
        formAtividade.reset();
        carregarCronograma(); // Atualiza a tela automaticamente
      } catch (erro) {
        console.error("Erro ao salvar atividade customizada:", erro);
        alert("Não foi possível salvar a atividade.");
      }
    });
  }
});
