document.addEventListener('DOMContentLoaded', () => {
  const btnAbrir = document.getElementById('btn-abrir-chamado');
  const btnFechar = document.getElementById('btn-fechar-chamado');
  const modal = document.getElementById('modal-chamado');
  const form = document.getElementById('form-chamado');
  
  const radioExplicacao = document.querySelector('input[value="explicacao"]');
  const radioRevisao = document.querySelector('input[value="revisao"]');
  const blocoExplicacao = document.getElementById('bloco-explicacao');
  const blocoRevisao = document.getElementById('bloco-revisao');
  const inputDuvida = document.getElementById('input-duvida');
  
  const listaPendentes = document.getElementById('lista-pendentes');
  const badgePendentes = document.getElementById('badge-pendentes');

  // Inicializar e carregar chamados
  carregarChamados();

  // Lógica do Modal
  if (btnAbrir && modal && btnFechar) {
    btnAbrir.addEventListener('click', () => {
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
      }, 10);
    });

    const fecharModal = () => {
      modal.classList.add('opacity-0');
      modal.querySelector('div').classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    };

    btnFechar.addEventListener('click', fecharModal);
  }

  // Alternar entre Explicação e Revisão (Mostrar/Ocultar campos)
  function alternarCampos() {
    if (radioExplicacao.checked) {
      blocoExplicacao.classList.remove('hidden');
      blocoRevisao.classList.add('hidden');
      inputDuvida.required = true;
    } else {
      blocoExplicacao.classList.add('hidden');
      blocoRevisao.classList.remove('hidden');
      inputDuvida.required = false;
    }
  }

  radioExplicacao.addEventListener('change', alternarCampos);
  radioRevisao.addEventListener('change', alternarCampos);

  // Submissão do Formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tipo = radioExplicacao.checked ? 'explicacao' : 'revisao';
    const assunto = document.getElementById('input-assunto-chamado').value;
    const descricao = inputDuvida.value;
    const fonte = document.getElementById('input-fonte-revisao') ? document.getElementById('input-fonte-revisao').value : null;
    const qtd = document.getElementById('input-qtd-revisao') ? document.getElementById('input-qtd-revisao').value : null;

    const novoChamado = {
      tipo: tipo,
      assunto: assunto,
      descricao: tipo === 'explicacao' ? descricao : null,
      fonte_revisao: tipo === 'revisao' ? fonte : null,
      quantidade_questoes: tipo === 'revisao' ? qtd : null,
      status: 'pendente',
      data_criacao: new Date().toISOString()
    };

    try {
      await db.chamados.add(novoChamado);
      form.reset();
      alternarCampos();
      if (typeof fecharModal !== 'undefined') fecharModal();
      
      // Forçar fechamento caso fecharModal não esteja no escopo correto
      modal.classList.add('opacity-0');
      modal.querySelector('div').classList.add('scale-95');
      setTimeout(() => modal.classList.add('hidden'), 300);

      carregarChamados();
    } catch (erro) {
      console.error("Erro ao salvar chamado:", erro);
      alert("Não foi possível criar o chamado.");
    }
  });

  // Renderizar Chamados na Tela
  async function carregarChamados() {
    try {
      const chamados = await db.chamados.toArray();
      const pendentes = chamados.filter(c => c.status === 'pendente');
      
      badgePendentes.textContent = pendentes.length;

      if (pendentes.length === 0) {
        listaPendentes.innerHTML = `
          <div class="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <i class="fas fa-inbox text-3xl text-slate-300 mb-3 block"></i>
            <p class="text-slate-400 text-sm font-medium">Nenhum chamado pendente.</p>
          </div>
        `;
        return;
      }

      // Ordenar do mais recente pro mais antigo
      pendentes.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));

      listaPendentes.innerHTML = pendentes.map(chamado => {
        const isExplicacao = chamado.tipo === 'explicacao';
        const icone = isExplicacao ? 'fa-comment-dots text-indigo-500 bg-indigo-50' : 'fa-tasks text-emerald-500 bg-emerald-50';
        const badge = isExplicacao ? '<span class="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Explicação</span>' : '<span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Revisão</span>';
        
        const dataFormatada = new Date(chamado.data_criacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

        let infoAdicional = '';
        if (isExplicacao) {
          infoAdicional = chamado.descricao;
        } else {
          const formatFonte = {
            'simulado': 'Simulado',
            'interpretacao': 'Interpretação',
            'ambos': 'Misto'
          };
          const f = formatFonte[chamado.fonte_revisao] || chamado.fonte_revisao;
          infoAdicional = `Fonte: ${f} • ${chamado.quantidade_questoes || 10} Questões`;
        }

        return `
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-1.5 h-full ${isExplicacao ? 'bg-indigo-500' : 'bg-emerald-500'}"></div>
            <div class="flex items-start gap-3 pl-2">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${icone}">
                <i class="fas ${icone.split(' ')[0]}"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  ${badge}
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${dataFormatada}</span>
                </div>
                <h4 class="font-bold text-slate-800 text-sm truncate" title="${chamado.assunto}">${chamado.assunto}</h4>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">
                  ${infoAdicional}
                </p>
              </div>
            </div>
            
            <!-- Ações -->
            <div class="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between pl-2">
              <span class="text-xs font-bold text-amber-500 flex items-center gap-1">
                <i class="fas fa-circle text-[8px] animate-pulse"></i> Aguardando Atendimento
              </span>
              <button class="btn-excluir text-slate-300 hover:text-red-500 transition-colors" data-id="${chamado.id}" title="Cancelar Pedido">
                <i class="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Adicionar evento para excluir/cancelar chamado
      document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', async function() {
          const id = parseInt(this.dataset.id);
          if (confirm('Tem certeza que deseja cancelar este pedido?')) {
            await db.chamados.delete(id);
            carregarChamados();
          }
        });
      });

    } catch (e) {
      console.error("Erro ao carregar chamados:", e);
    }
  }
});
