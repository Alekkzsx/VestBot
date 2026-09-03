document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // BANCO DE TEXTÕES & QUESTÕES DE INTERPRETAÇÃO
  // Cada textão possui exatamente 4 questões analíticas
  // ==========================================
  const bancoTextos = [
    // ----------------------------------------------------
    // LÍNGUA PORTUGUESA
    // ----------------------------------------------------
    {
      id: "txt_port_01",
      materia: "portugues",
      tema: "Artigo de Opinião / Tecnologia",
      titulo: "A Inteligência Artificial na Educação: Aliada ou Ameaça?",
      fonte: "Revista Educação & Sociedade / Adaptado para Vestibulinho",
      texto: `
        <p>Nos últimos anos, o avanço desenfreado das tecnologias de inteligência artificial generativa provocou intensos debates sobre o papel do educador em sala de aula. Setores mais conservadores temem que a automação substitua a figura humana, convertendo o processo pedagógico em uma linha de montagem impessoal e algorítmica.</p>
        <br>
        <p>Entretanto, pedagogos contemporâneos argumentam que essas ferramentas devem ser encaradas como extensões das faculdades didáticas. Elas possuem capacidade sem precedentes para auxiliar na personalização das trilhas de aprendizagem, respeitando o ritmo cognitivo de cada indivíduo e desonerando o docente de tarefas mecânicas, como a elaboração padronizada e correção em massa de exames objetivos.</p>
        <br>
        <p>A questão premente, portanto, não reside em indagar <i>se</i> a tecnologia transformará a escola, mas <i>como</i> a sociedade direcionará essa metamorfose para dirimir desigualdades em vez de aprofundá-las. Afinal, a concentração dessas ferramentas nas mãos de colégios de elite agravaria o abismo educacional brasileiro se a rede pública permanecer à margem da inclusão digital.</p>
        <br>
        <p>Conclui-se que o professor do porvir não deixará de existir; sua função primordial migrará da mera transmissão enciclopédica para a curadoria crítica do saber e o acolhimento socioemocional — atributos que os modelos probabilísticos de linguagem são incapazes de emular.</p>
      `,
      questoes: [
        {
          id: "q_port_01",
          enunciado: "De acordo com o primeiro e segundo parágrafos, qual é a principal vantagem pedagógica atribuída à inteligência artificial pelos educadores contemporâneos?",
          alternativas: [
            { letra: "A", texto: "A substituição gradativa dos professores por tutores virtuais infalíveis." },
            { letra: "B", texto: "A personalização do ritmo de aprendizagem do aluno e o alívio de tarefas repetitivas." },
            { letra: "C", texto: "A extinção definitiva de exames e avaliações diagnósticas nas escolas." },
            { letra: "D", texto: "A padronização uniforme de todo o currículo nacional sem intervenção humana." }
          ],
          correta: "B",
          explicacao: "O texto afirma categoricamente que as ferramentas auxiliam na 'personalização das trilhas de aprendizagem' e liberam o professor de tarefas mecânicas."
        },
        {
          id: "q_port_02",
          enunciado: "No terceiro parágrafo, o autor expressa preocupação explícita com qual dos seguintes aspectos?",
          alternativas: [
            { letra: "A", texto: "O custo financeiro excessivo para licenciar softwares de linguagem nas universidades." },
            { letra: "B", texto: "O risco de aversão dos alunos jovens às tecnologias digitais." },
            { letra: "C", texto: "O agravamento do abismo educacional caso as escolas públicas não tenham o mesmo acesso." },
            { letra: "D", texto: "A incapacidade técnica dos computadores em processar dados em tempo real." }
          ],
          correta: "C",
          explicacao: "O texto ressalta que o acesso restrito a colégios de elite pode aumentar o abismo educacional se a rede pública for excluída."
        },
        {
          id: "q_port_03",
          enunciado: "No trecho '...sua função primordial migrará da mera transmissão enciclopédica para a curadoria crítica do saber...', a palavra 'curadoria' assume o sentido de:",
          alternativas: [
            { letra: "A", texto: "Cura médica de distúrbios cognitivos em sala." },
            { letra: "B", texto: "Seleção, filtragem, validação e mediação responsável das informações." },
            { letra: "C", texto: "Memorização exaustiva de fórmulas e datas históricas." },
            { letra: "D", texto: "Fiscalização punitiva do comportamento disciplinar dos alunos." }
          ],
          correta: "B",
          explicacao: "No contexto educacional e cultural, curadoria significa selecionar criteriosamente, analisar criticamente e guiar o acesso ao conhecimento."
        },
        {
          id: "q_port_04",
          enunciado: "Assinale a alternativa que expressa a tese central do texto como um todo:",
          alternativas: [
            { letra: "A", texto: "A tecnologia na educação é um mal inevitável que desumaniza as relações escolares." },
            { letra: "B", texto: "O futuro da educação exige rejeição à inteligência artificial em prol de métodos tradicionais." },
            { letra: "C", texto: "A inteligência artificial ressignifica o papel do educador como mediador humano essencial e exige políticas de equidade." },
            { letra: "D", texto: "Os algoritmos modernos já conseguem substituir a sensibilidade e o acolhimento socioemocional humano." }
          ],
          correta: "C",
          explicacao: "O texto conclui que o professor se torna curador crítico e mentor emocional, ressaltando a importância de não aprofundar desigualdades."
        }
      ]
    },
    {
      id: "txt_port_02",
      materia: "portugues",
      tema: "Poesia Moderna & Passagem do Tempo",
      titulo: "Retrato",
      fonte: "Cecília Meireles, 'Viagem' (1939)",
      texto: `
        <p class="italic font-serif text-lg leading-loose">
          "Eu não tinha este rosto de hoje,<br>
          Assim calmo, assim triste, assim magro,<br>
          Nem estes olhos tão vazios,<br>
          Nem o lábio amargo.<br><br>
          Eu não tinha estas mãos sem força,<br>
          Tão paradas e frias e mortas;<br>
          Eu não tinha este coração<br>
          Que nem se mostra.<br><br>
          Eu não dei por esta mudança,<br>
          Tão simples, tão certa, tão fácil: —<br>
          Em que espelho ficou perdida<br>
          A minha face?"
        </p>
      `,
      questoes: [
        {
          id: "q_port_05",
          enunciado: "Na primeira estrofe, a repetição da conjunção comparativa/enfática 'assim' ('assim calmo, assim triste, assim magro') cumpre o papel estilístico de:",
          alternativas: [
            { letra: "A", texto: "Enfatizar a surpresa alegre do eu lírico com a serenidade da velhice." },
            { letra: "B", texto: "Intensificar gradativamente a caracterização do estado de melancolia e desgaste físico." },
            { letra: "C", texto: "Descrever com exatidão científica os sintomas de uma moléstia passageira." },
            { letra: "D", texto: "Demonstrar desprezo pelas transformações ocorridas em sua fisionomia." }
          ],
          correta: "B",
          explicacao: "A repetição de 'assim' intensifica os adjetivos de teor decadente e melancólico, reforçando o impacto das marcas do tempo."
        },
        {
          id: "q_port_06",
          enunciado: "Nos versos 'Eu não dei por esta mudança, / Tão simples, tão certa, tão fácil', a expressão 'não dei por' expressa:",
          alternativas: [
            { letra: "A", texto: "A desatenção voluntária perante conselhos médicos." },
            { letra: "B", texto: "A imperceptibilidade da passagem inexorável do tempo, que opera de modo sutil." },
            { letra: "C", texto: "A recusa em aceitar heranças financeiras do passado." },
            { letra: "D", texto: "A facilidade de retornar à aparência jovem através da memória." }
          ],
          correta: "B",
          explicacao: "'Não dar por' significa não perceber conscientemente; o envelhecimento ocorreu de maneira tão contínua que passou despercebido dia a dia."
        },
        {
          id: "q_port_07",
          enunciado: "O verso interrogativo final 'Em que espelho ficou perdida / A minha face?' carrega um tom predominante de:",
          alternativas: [
            { letra: "A", texto: "Perplexidade existencial diante da alienação de si mesmo gerada pelo tempo." },
            { letra: "B", texto: "Irritação pelo extravio material de um objeto doméstico." },
            { letra: "C", texto: "Conformismo alegre com o destino natural de todos os seres vivos." },
            { letra: "D", texto: "Dúvida pragmática sobre qual espelho da casa reflete melhor a luz." }
          ],
          correta: "A",
          explicacao: "A perda da face no espelho é uma metáfora poética para o estranhamento de não mais reconhecer a própria imagem da juventude."
        },
        {
          id: "q_port_08",
          enunciado: "Em relação à estrutura formal e temática do poema de Cecília Meireles, é correto afirmar:",
          alternativas: [
            { letra: "A", texto: "Trata-se de uma exaltação cívica do progresso urbano industrial brasileiro." },
            { letra: "B", texto: "É um poema de temática intimista e lírica, centrado na efemeridade da vida e na transitoriedade do corpo." },
            { letra: "C", texto: "Constitui uma narrativa épica com heróis, batalhas e conquistas territoriais." },
            { letra: "D", texto: "Apresenta tom humorístico e satírico para ridicularizar a vaidade feminina." }
          ],
          correta: "B",
          explicacao: "O poema é lírico e reflexivo, voltado para temas universais da existência: tempo, perda, finitude e memória."
        }
      ]
    },

    // ----------------------------------------------------
    // HISTÓRIA
    // ----------------------------------------------------
    {
      id: "txt_hist_01",
      materia: "historia",
      tema: "Documento Histórico / Era Vargas",
      titulo: "A Carta-Testamento e o Nacional-Desenvolvimentismo",
      fonte: "Extrato histórico da Carta-Testamento de Getúlio Vargas (24 de agosto de 1954)",
      texto: `
        <p class="font-serif">"Mais uma vez as forças e os interesses contra o povo coordenaram-se e se desencadeiam sobre mim. Não me acusam, insultam; não me combatem, caluniam; e não me dão o direito de defesa. Precisam sufocar a minha voz e impedir a minha ação, para que eu não continue a defender, como sempre defendi, o povo e principalmente os humildes.</p>
        <br>
        <p class="font-serif">Sigo o destino que me é imposto. Depois de decênios de domínio e espoliação dos grupos econômicos e financeiros internacionais, fiz-me chefe de uma revolução e venci. Iniciei o trabalho de libertação e instaurei o regime de liberdade social. Tive de renunciar. Voltei ao governo nos braços do povo. A campanha subterrânea dos grupos internacionais aliou-se à dos grupos nacionais revoltados contra o regime de garantia do trabalho. Quis criar a liberdade nacional na potencialização das nossas riquezas através da Petrobras e, mal começa esta a funcionar, a onda de agitação se avoluma.</p>
        <br>
        <p class="font-serif">Era o povo de quem fui escravo e ninguém mais será senhor do meu destino. Eu vos dei a minha vida. Agora vos ofereço a minha morte. Nada receio. Serenamente dou o primeiro passo no caminho da eternidade e saio da vida para entrar na História."</p>
      `,
      questoes: [
        {
          id: "q_hist_01",
          enunciado: "Na Carta-Testamento, Getúlio Vargas atribui a violenta oposição contra o seu segundo governo principalmente:",
          alternativas: [
            { letra: "A", texto: "À aliança entre grupos financeiros internacionais e setores nacionais descontentes com a legislação trabalhista e o monopólio estatal do petróleo." },
            { letra: "B", texto: "Ao seu alinhamento irrestrito com a União Soviética durante a Guerra Fria." },
            { letra: "C", texto: "À tentativa de restaurar a monarquia constitucional e o voto censitário." },
            { letra: "D", texto: "À extinção arbitrária das Forças Armadas brasileiras por decreto presidencial." }
          ],
          correta: "A",
          explicacao: "O texto denuncia explicitamente a 'campanha subterrânea dos grupos internacionais aliada aos grupos nacionais revoltados contra o regime de garantia do trabalho' e a criação da Petrobras."
        },
        {
          id: "q_hist_02",
          enunciado: "Quando o texto menciona a criação da Petrobras como marco de 'potencialização das nossas riquezas', ele expressa o projeto político-econômico denominado:",
          alternativas: [
            { letra: "A", texto: "Neoliberalismo de privatização total." },
            { letra: "B", texto: "Nacional-desenvolvimentismo com intervenção estatal na indústria de base." },
            { letra: "C", texto: "Mercantilismo colonial agroexportador." },
            { letra: "D", texto: "Feudalismo agrário sem participação urbana." }
          ],
          correta: "B",
          explicacao: "A criação de estatais estratégicas (como CSN, Vale e Petrobras) é o pilar clássico do nacional-desenvolvimentismo getulista."
        },
        {
          id: "q_hist_03",
          enunciado: "A frase célebre 'Voltei ao governo nos braços do povo' faz alusão direta a qual episódio da história brasileira?",
          alternativas: [
            { letra: "A", texto: "Ao Golpe de Estado do Estado Novo em 1937." },
            { letra: "B", texto: "À Revolução Constitucionalista de 1932 em São Paulo." },
            { letra: "C", texto: "À sua vitória nas eleições democráticas diretas de 1950 com amplo apoio popular." },
            { letra: "D", texto: "À Proclamação da República pelo Marechal Deodoro da Fonseca." }
          ],
          correta: "C",
          explicacao: "Após deixar o poder em 1945, Vargas concorreu às eleições livres de 1950 e venceu pelo voto direto nos 'braços do povo'."
        },
        {
          id: "q_hist_04",
          enunciado: "O impacto político imediato do suicídio de Vargas e da divulgação de sua Carta-Testamento foi:",
          alternativas: [
            { letra: "A", texto: "A posse imediata de Carlos Lacerda na presidência da República." },
            { letra: "B", texto: "Uma comoção popular maciça que desarticulou o golpe planejado pela oposição e adiou a tomada militar do poder." },
            { letra: "C", texto: "A anulação imediata da Consolidação das Leis do Trabalho (CLT)." },
            { letra: "D", texto: "A imediata venda das refinarias de petróleo ao capital estrangeiro." }
          ],
          correta: "B",
          explicacao: "A commeção popular nas ruas gerou uma onda nacionalista que neutralizou a oposição golpista liderada pela UDN naquele momento."
        }
      ]
    },

    // ----------------------------------------------------
    // GEOGRAFIA
    // ----------------------------------------------------
    {
      id: "txt_geo_01",
      materia: "geografia",
      tema: "Domínios Morfoclimáticos & Sustentabilidade",
      titulo: "O Sertão da Caatinga: Resiliência e Desertificação",
      fonte: "Boletim Geográfico do Semiárido Brasileiro / IBGE & INPE",
      texto: `
        <p>A Caatinga é o único domínio morfoclimático de ocorrência exclusivamente brasileira, estendendo-se por cerca de 844 mil km² no interior nordestino e norte de Minas Gerais. Caracterizado por um regime pluviométrico irregular com secas prolongadas, o bioma desenvolveu adaptações morfológicas ímpares: plantas caducifólias que perdem folhas na estiagem, caules armazenadores de água e folhas modificadas em espinhos (xerófitas) para conter a transpiração excessiva.</p>
        <br>
        <p>Apesar de sua riqueza endêmica e biodiversidade singular, a Caatinga enfrenta um acelerado processo de degradação antrópica. O desmatamento descontrolado para fornecimento de lenha e carvão a indústrias de cerâmica e siderúrgicas, somado ao sobrepastoreio bovino e caprino, desprotege o solo raso contra a intensa insolação tropical.</p>
        <br>
        <p>Com as chuvas torrenciais concentradas que ocorrem ao final da seca, as camadas superiores de matéria orgânica são lixiviadas e erodidas. O resultado é a expansão de núcleos de desertificação no semiárido, fenômeno socioambiental grave que compromete a segurança alimentar das populações tradicionais sertanejas e agrava a crise hídrica regional.</p>
      `,
      questoes: [
        {
          id: "q_geo_01",
          enunciado: "De acordo com o texto, qual é a principal razão pela qual a vegetação da Caatinga perde suas folhas durante o período de estiagem?",
          alternativas: [
            { letra: "A", texto: "Para absorver maior radiação solar diretamente no caule clorofilado." },
            { letra: "B", texto: "Mecanismo adaptativo para reduzir a perda de água por evapotranspiração." },
            { letra: "C", texto: "Ataque generalizado de pragas agrícolas durante o inverno." },
            { letra: "D", texto: "Sobrecarga de nutrientes minerais absorvidos do lençol freático." }
          ],
          correta: "B",
          explicacao: "A perda de folhas (caducifolia) é uma estratégia para diminuir a área foliar exposta e estancar a perda de vapor de água."
        },
        {
          id: "q_geo_02",
          enunciado: "O texto classifica as causas da degradação da Caatinga como 'antrópicas'. Esse termo significa que o processo decorre de:",
          alternativas: [
            { letra: "A", texto: "Fatores puramente cósmicos e alinhamentos planetários." },
            { letra: "B", texto: "Ação direta e modificadora das atividades humanas sobre a natureza." },
            { letra: "C", texto: "Ciclos glaciais naturais de congelamento dos polos." },
            { letra: "D", texto: "Movimento tectônico das placas continentais sul-americanas." }
          ],
          correta: "B",
          explicacao: "Ação antrópica é aquela decorrente da intervenção humana (desmatamento, pastoreio, queima de carvão)."
        },
        {
          id: "q_geo_03",
          enunciado: "Qual é a relação causal descrita no terceiro parágrafo entre as chuvas concentradas e a desertificação?",
          alternativas: [
            { letra: "A", texto: "As chuvas recuperam o solo imediatamente, anulando qualquer vestígio de seca." },
            { letra: "B", texto: "A ausência de cobertura vegetal faz com que as águas torrenciais lavem e erodam a fina camada orgânica do solo." },
            { letra: "C", texto: "A água da chuva transforma a areia do sertão em granito impermeável." },
            { letra: "D", texto: "As chuvas impedem o crescimento de espécies xerófitas nativas." }
          ],
          correta: "B",
          explicacao: "Sem a copa das árvores e raízes para fixar a terra, a enxurrada remove os nutrientes superficiais (erosão laminar e lixiviação)."
        },
        {
          id: "q_geo_04",
          enunciado: "Assinale a alternativa que indica uma medida sustentável compatível com a preservação descrita no texto:",
          alternativas: [
            { letra: "A", texto: "A substituição total da Caatinga por eucalipto de rápido crescimento." },
            { letra: "B", texto: "O manejo agroflorestal sustentável com convivência com o semiárido e captação de água de chuva." },
            { letra: "C", texto: "O incentivo à queima indiscriminada de vegetação nativa para pastagem." },
            { letra: "D", texto: "A pavimentação asfáltica das áreas de preservação permanente." }
          ],
          correta: "B",
          explicacao: "Manejo agroecológico, cisternas de captação e conservação das espécies nativas são as soluções comprovadas para o semiárido."
        }
      ]
    },

    // ----------------------------------------------------
    // BIOLOGIA / CIÊNCIAS
    // ----------------------------------------------------
    {
      id: "txt_bio_01",
      materia: "biologia",
      tema: "Ecologia & Impactos Ambientais",
      titulo: "Eutrofização: O Sufocamento dos Mananciais Urbanos",
      fonte: "Cadernos de Biologia Aplicada / CETESB",
      texto: `
        <p>A expansão desordenada das metrópoles sem o devido acompanhamento de infraestrutura sanitária converteu represas e rios urbanos em depósitos de efluentes domésticos não tratados. O despejo contínuo de esgoto rico em compostos fosfatados e nitrogenados deflagra uma sucessão ecológica desequilibrada denominada eutrofização artificial.</p>
        <br>
        <p>Em um primeiro momento, a superabundância de nutrientes estimula a proliferação explosiva de algas unicelulares e cianobactérias na superfície aquática (floração). Essa biomassa verde forma uma camada espessa que bloqueia a penetração da luz solar nas camadas mais profundas do corpo d'água, impedindo a fotossíntese dos vegetais submersos, que acabam sucumbindo.</p>
        <br>
        <p>Com o acúmulo colossal de matéria orgânica morta no fundo, ocorre a multiplicação vertiginosa de bactérias decompositoras aeróbicas. Esses microrganismos consomem aceleradamente o oxigênio dissolvido na água (DBO elevada). Quando o teor de O₂ se aproxima de zero (hipóxia ou anóxia), peixes e outros organismos que respiram aerobicamente morrem por asfixia, instalando-se a decomposição anaeróbica que libera gases fétidos como o sulfeto de hidrogênio (H₂S).</p>
      `,
      questoes: [
        {
          id: "q_bio_01",
          enunciado: "Qual é o evento desencadeador primário do processo de eutrofização artificial descrito no texto?",
          alternativas: [
            { letra: "A", texto: "O aumento espontâneo da temperatura das águas profundas dos oceanos." },
            { letra: "B", texto: "O despejo contínuo de esgoto doméstico rico em compostos de fósforo e nitrogênio." },
            { letra: "C", texto: "A migração de peixes predadores exóticos vindos de outros continentes." },
            { letra: "D", texto: "A construção de usinas hidrelétricas com vazão controlada." }
          ],
          correta: "B",
          explicacao: "O texto afirma que a entrada massiva de nutrientes fosfatados e nitrogenados do esgoto deflagra a eutrofização."
        },
        {
          id: "q_bio_02",
          enunciado: "Por que as plantas aquáticas submersas morrem logo após a proliferação das algas superficiais?",
          alternativas: [
            { letra: "A", texto: "Porque as algas devoram fisicamente as raízes das plantas aquáticas." },
            { letra: "B", texto: "Porque a camada superficial de algas bloqueia a incidência de luz solar necessária para a fotossíntese." },
            { letra: "C", texto: "Porque a água fica ácida demais para a absorção de sais minerais." },
            { letra: "D", texto: "Porque o congelamento repentino da superfície impede a circulação de água." }
          ],
          correta: "B",
          explicacao: "A floração das algas forma uma barreira física opaca que impede a passagem da luz, interrompendo a fotossíntese submersa."
        },
        {
          id: "q_bio_03",
          enunciado: "A morte em massa dos peixes em ambientes eutrofizados é consequência direta de:",
          alternativas: [
            { letra: "A", texto: "Falta de alimento vegetal na superfície da represa." },
            { letra: "B", texto: "Queda drástica do oxigênio dissolvido causada pelo consumo intenso das bactérias decompositoras aeróbicas." },
            { letra: "C", texto: "Aumento exagerado da pressão hidrostática na coluna d'água." },
            { letra: "D", texto: "Ataque fulminante de vírus transmitidos pelo ar." }
          ],
          correta: "B",
          explicacao: "A decomposição da biomassa consome todo o oxigênio da água, sufocando os animais de respiração branquial."
        },
        {
          id: "q_bio_04",
          enunciado: "Para conter e reverter o quadro de eutrofização de uma bacia hidrográfica, a política de saneamento mais eficaz é:",
          alternativas: [
            { letra: "A", texto: "Aplicar herbicidas químicos em larga escala em toda a extensão do rio." },
            { letra: "B", texto: "Implementar redes coletoras e estações de tratamento terciário de efluentes (ETE) antes do descarte nos rios." },
            { letra: "C", texto: "Cobrir a represa com lonas plásticas para impedir a evaporação da água." },
            { letra: "D", texto: "Aumentar a introdução de peixes carnívoros no manancial degradado." }
          ],
          correta: "B",
          explicacao: "O tratamento eficaz dos efluentes para remover nutrientes antes de chegar ao rio corta a raiz do problema."
        }
      ]
    },

    // ----------------------------------------------------
    // INTERDISCIPLINAR
    // ----------------------------------------------------
    {
      id: "txt_inter_01",
      materia: "inter",
      tema: "Ciência, Sociedade & Meio Ambiente",
      titulo: "Transição Energética e Injustiça Climática Global",
      fonte: "Painel Intergovernamental de Mudanças Climáticas (IPCC) / Síntese",
      texto: `
        <p>A urgência de mitigar o aquecimento global impôs ao planeta a meta de descarbonização até meados do século XXI. A substituição gradual dos combustíveis fósseis (carvão, petróleo e gás natural) por matrizes limpas — como energia solar fotovoltaica, eólica e biocombustíveis — é o núcleo das metas estabelecidas nos Acordos de Paris.</p>
        <br>
        <p>Entretanto, analistas sociais alertam para o conceito de 'injustiça climática'. Historicamente, os países industrializados do Norte Global foram os maiores responsáveis pelo acúmulo de gases de efeito estufa na atmosfera desde a Primeira Revolução Industrial. Contudo, são as nações periféricas e comunidades vulneráveis do Sul Global que arcam desproporcionalmente com os desastres ecológicos mais devastadores: secas extremas, elevação do nível do mar e quebras de safras agrícolas.</p>
        <br>
        <p>Ademais, a fabricação em massa de baterias elétricas e painéis solares demanda minerais estratégicos como lítio, cobalto e terras raras, cujas cadeias de extração frequentemente reproduzem lógicas predatórias em territórios vulneráveis. Uma transição energética genuinamente ética não pode se resumir à troca de tecnologias motrizes; deve abarcar justiça redistributiva, soberania alimentar e reparação socioambiental aos povos mais atingidos.</p>
      `,
      questoes: [
        {
          id: "q_inter_01",
          enunciado: "O conceito de 'injustiça climática' apresentado no segundo parágrafo evidencia que:",
          alternativas: [
            { letra: "A", texto: "Todos os países do mundo poluem igualmente e sofrem os mesmos impactos sem distinção de renda." },
            { letra: "B", texto: "Os países que historicamente menos contribuíram para as emissões são os que mais sofrem as consequências dos eventos extremos." },
            { letra: "C", texto: "As mudanças climáticas decorrem apenas da queima de biomassa em aldeias isoladas." },
            { letra: "D", texto: "O aquecimento global é uma farsa criada para prejudicar a indústria automobilística." }
          ],
          correta: "B",
          explicacao: "Injustiça climática retrata a disparidade histórica: quem emitiu menos arca com a pior fatura de desastres ambientais."
        },
        {
          id: "q_inter_02",
          enunciado: "No terceiro parágrafo, qual é a contradição apontada em relação à expansão das energias renováveis?",
          alternativas: [
            { letra: "A", texto: "Painéis solares gastam mais energia do que produzem ao longo de sua vida útil." },
            { letra: "B", texto: "A extração de matérias-primas críticas (como lítio e cobalto) pode reproduzir impactos predatórios em países do Sul Global." },
            { letra: "C", texto: "A energia eólica consome milhões de barris de petróleo em cada aerogerador." },
            { letra: "D", texto: "As baterias recarregáveis geram emissões maiores que termoelétricas a carvão." }
          ],
          correta: "B",
          explicacao: "O texto adverte que a corrida por minerais de baterias pode reincidir em explorações predatórias em nações vulneráveis."
        },
        {
          id: "q_inter_03",
          enunciado: "Em termos físicos e químicos, qual é a principal vantagem dos biocombustíveis (como o etanol de cana-de-açúcar) em relação à gasolina derivada do petróleo?",
          alternativas: [
            { letra: "A", texto: "O etanol não gera nenhum tipo de gás durante sua combustão interna." },
            { letra: "B", texto: "A fotossíntese da cana captura o CO₂ atmosférico durante seu ciclo de crescimento, compensando parte das emissões." },
            { letra: "C", texto: "O etanol é um combustível mineral infinito que nunca se esgota nas jazidas." },
            { letra: "D", texto: "O etanol impede o aquecimento do motor e elimina o atrito das peças metálicas." }
          ],
          correta: "B",
          explicacao: "O ciclo biológico do vegetal captura carbono atmosférico enquanto cresce, tornando o balanço de carbono muito mais limpo que combustíveis fósseis."
        },
        {
          id: "q_inter_04",
          enunciado: "A conclusão do texto defende que uma 'transição energética genuinamente ética' deve:",
          alternativas: [
            { letra: "A", texto: "Concentrar os investimentos somente nos países de alta renda da Europa e América do Norte." },
            { letra: "B", texto: "Associar o avanço tecnológico à equidade social, preservação de direitos e reparação aos mais afetados." },
            { letra: "C", texto: "Suspender imediatamente o uso de eletricidade em todas as cidades do mundo." },
            { letra: "D", texto: "Priorizar os lucros das multinacionais extrativistas de lítio." }
          ],
          correta: "B",
          explicacao: "O autor conclui que a transição não pode ser apenas troca de motor; precisa conter justiça redistributiva e proteção socioambiental."
        }
      ]
    }
  ];

  // ==========================================
  // ESTADO DA SESSÃO DE INTERPRETAÇÃO
  // ==========================================
  let estadoAtual = 'LOBBY'; 
  let materiaSelecionada = 'portugues';
  let textaoSelecionadoId = bancoTextos[0].id;
  let qtdQuestoesSelecionada = 2; // Usuário escolhe de 1 até 4 questões do textão!
  
  // Game State
  let questaoAtualIndex = 0;
  let respostasUsuario = {};
  let questaoAtualObj = null;
  let questoesDaSessao = [];
  let textaoAtivo = null;
  
  // Timer State
  let tempoTotalSegundos = 6 * 60; // 6 minutos por padrão
  let tempoRestante = tempoTotalSegundos;
  let timerInterval = null;
  let fonteTamanho = 'base'; // 'sm' | 'base' | 'lg' | 'xl'

  const appContainer = document.getElementById('interpretacao-app');

  // ==========================================
  // RENDERIZADOR PRINCIPAL
  // ==========================================
  function render() {
    if (estadoAtual === 'LOBBY') {
      renderLobby();
    } else if (estadoAtual === 'IN_GAME') {
      renderInGame();
    } else if (estadoAtual === 'FEEDBACK') {
      renderFeedback();
    }
  }

  // ==========================================
  // 1. LOBBY: ESCOLHA DE MATÉRIA, TEXTÃO E DE 1 A 4 QUESTÕES
  // ==========================================
  function renderLobby() {
    const materias = [
      { id: 'portugues', nome: 'Português', icone: 'fa-book', cor: 'rose' },
      { id: 'historia', nome: 'História', icone: 'fa-landmark', cor: 'amber' },
      { id: 'geografia', nome: 'Geografia', icone: 'fa-globe-americas', cor: 'orange' },
      { id: 'biologia', nome: 'Biologia', icone: 'fa-leaf', cor: 'emerald' },
      { id: 'inter', nome: 'Interdisciplinar', icone: 'fa-brain', cor: 'purple' }
    ];

    // Filtra textões da disciplina selecionada
    const textosFiltrados = bancoTextos.filter(t => t.materia === materiaSelecionada);
    
    // Garante que o textão selecionado pertença à matéria
    if (!textosFiltrados.some(t => t.id === textaoSelecionadoId)) {
      textaoSelecionadoId = textosFiltrados[0]?.id || bancoTextos[0].id;
    }

    const textaoAtualInfo = bancoTextos.find(t => t.id === textaoSelecionadoId) || textosFiltrados[0];

    // Estimativa de tempo baseada na quantidade escolhida (3 min por questão)
    const tempoEstimadoMinutos = qtdQuestoesSelecionada * 3;

    let html = `
      <div class="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in mt-6">
        
        <!-- Header do Lobby -->
        <div class="p-8 md:p-12 text-center border-b border-slate-100 bg-slate-900 text-white relative overflow-hidden">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-600 rounded-full blur-[90px] opacity-20"></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600 rounded-full blur-[90px] opacity-20"></div>
          
          <div class="relative z-10">
            <span class="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
              Treino de Leitura Ativa & ETEC
            </span>
            <h2 class="text-3xl md:text-4xl font-black mb-3 tracking-tight text-white">Laboratório de Interpretação Textual</h2>
            <p class="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              As provas da ETEC exigem leitura atenta de textos complexos. Escolha um textão e defina exatamente quantas questões deseja destrinchar dele.
            </p>
          </div>
        </div>

        <div class="p-6 md:p-10 space-y-8">
          
          <!-- PASSO 1: ESCOLHA DA DISCIPLINA -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">1</span>
                Eixo Temático / Disciplina:
              </h3>
              <span class="text-xs text-slate-400 font-medium">Selecione para filtrar os textos</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5" id="container-materias">
              ${materias.map(m => {
                const isSelected = materiaSelecionada === m.id;
                return `
                  <button data-materia="${m.id}" class="btn-select-materia p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer text-center
                    ${isSelected ? 'border-black bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-400 text-slate-700'}">
                    <i class="fas ${m.icone} text-lg"></i>
                    <span class="text-xs font-bold">${m.nome}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- PASSO 2: QUANTIDADE DE QUESTÕES DO TEXTÃO (1 A 4 QUESTÕES) -->
          <div class="border-t border-slate-100 pt-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">2</span>
                Quantas Questões deseja responder do Textão sorteado?
              </h3>
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Disponíveis: até 4 questões
              </span>
            </div>

            <p class="text-xs text-slate-500 mb-4">
              Você pode fazer um treino rápido de 1 questão pontual ou o raio-x exaustivo de 4 questões completas baseadas no texto selecionado.
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              ${[1, 2, 3, 4].map(num => {
                const isSelected = qtdQuestoesSelecionada === num;
                const labels = {
                  1: '1 Questão',
                  2: '2 Questões',
                  3: '3 Questões',
                  4: '4 Questões'
                };
                const descricoes = {
                  1: 'Treino Relâmpago • 3m',
                  2: 'Padrão ETEC • 6m',
                  3: 'Aprofundado • 9m',
                  4: 'Raio-X Máximo • 12m'
                };
                return `
                  <button type="button" data-qtd="${num}" class="btn-select-qtd p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer
                    ${isSelected ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-400 text-slate-700'}">
                    <span class="text-lg font-black">${labels[num]}</span>
                    <span class="text-[10px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}">${descricoes[num]}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Resumo da Seleção -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-700 font-medium">
              <div class="flex items-center gap-2">
                <i class="fas fa-info-circle text-blue-600 text-sm"></i>
                <span>Configurado: <strong>1 Textão</strong> com <strong>${qtdQuestoesSelecionada} questão(ões)</strong> associada(s).</span>
              </div>
              <span class="font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                <i class="far fa-clock mr-1 text-slate-400"></i> Estimativa: ${tempoEstimadoMinutos} minutos
              </span>
            </div>
          </div>

          <!-- BOTÃO INICIAR -->
          <div class="pt-4 border-t border-slate-100">
            <button id="btn-iniciar-missao" class="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all text-base md:text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-3">
              <i class="fas fa-play-circle text-xl text-yellow-400"></i> Iniciar Leitura e Resolver ${qtdQuestoesSelecionada} Questão(ões)
            </button>
          </div>

        </div>
      </div>
    `;

    appContainer.innerHTML = html;

    // Eventos de seleção de matéria
    document.querySelectorAll('.btn-select-materia').forEach(btn => {
      btn.addEventListener('click', () => {
        materiaSelecionada = btn.getAttribute('data-materia');
        renderLobby();
      });
    });

    // (A seleção do textão agora é aleatória, no momento de iniciar)

    // Eventos de quantidade de questões (1 a 4)
    document.querySelectorAll('.btn-select-qtd').forEach(btn => {
      btn.addEventListener('click', () => {
        qtdQuestoesSelecionada = parseInt(btn.getAttribute('data-qtd'), 10) || 2;
        renderLobby();
      });
    });

    // Início da Missão
    const btnIniciar = document.getElementById('btn-iniciar-missao');
    if (btnIniciar) {
      btnIniciar.addEventListener('click', () => {
        iniciarSessaoInterpretação();
      });
    }
  }

  // ==========================================
  // INICIAR SESSÃO DE INTERPRETAÇÃO
  // ==========================================
  function iniciarSessaoInterpretação() {
    const textosFiltrados = bancoTextos.filter(t => t.materia === materiaSelecionada);
    // Seleciona um textão aleatório dentre os disponíveis para a matéria
    const textoSorteado = textosFiltrados[Math.floor(Math.random() * textosFiltrados.length)] || bancoTextos[0];
    
    textaoAtivo = textoSorteado;
    
    // Pega exatamente a quantidade de questões escolhida pelo usuário (1 a 4)
    questoesDaSessao = textaoAtivo.questoes.slice(0, qtdQuestoesSelecionada);
    
    questaoAtualIndex = 0;
    respostasUsuario = {};
    
    // 3 minutos por questão selecionada
    tempoTotalSegundos = Math.max(3 * 60, qtdQuestoesSelecionada * 3 * 60);
    tempoRestante = tempoTotalSegundos;
    
    estadoAtual = 'IN_GAME';
    iniciarTimer();
    render();
  }

  // ==========================================
  // CONTROLE DO TIMER
  // ==========================================
  function iniciarTimer() {
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
    const min = Math.floor(Math.max(0, tempoRestante) / 60).toString().padStart(2, '0');
    const sec = (Math.max(0, tempoRestante) % 60).toString().padStart(2, '0');
    const el = document.getElementById('hud-timer');
    if (el) {
      el.textContent = `${min}:${sec}`;
      if (tempoRestante < 120) {
        el.classList.add('text-rose-400', 'animate-pulse');
      }
    }
  }

  // ==========================================
  // 2. IN GAME: SPLIT SCREEN (TEXTÃO + QUESTÃO ATUAL)
  // ==========================================
  function renderInGame() {
    if (!textaoAtivo || questoesDaSessao.length === 0) {
      estadoAtual = 'LOBBY';
      render();
      return;
    }

    questaoAtualObj = questoesDaSessao[questaoAtualIndex];

    const min = Math.floor(Math.max(0, tempoRestante) / 60).toString().padStart(2, '0');
    const sec = (Math.max(0, tempoRestante) % 60).toString().padStart(2, '0');

    // Mapeamento de tamanhos de fonte do textão para acessibilidade
    const tamanhosFonte = {
      'sm': 'text-sm leading-relaxed',
      'base': 'text-base leading-loose',
      'lg': 'text-lg leading-loose',
      'xl': 'text-xl leading-loose'
    };
    const classeFonte = tamanhosFonte[fonteTamanho] || tamanhosFonte['base'];

    let html = `
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[82vh] animate-fade-in mt-4">
        
        <!-- TOP HUD -->
        <div class="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 shrink-0 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <span class="bg-blue-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
              1 Textão Selecionado
            </span>
            <span class="text-xs font-bold text-slate-300 truncate max-w-xs md:max-w-md">
              ${textaoAtivo.titulo}
            </span>
          </div>

          <div class="flex items-center gap-4">
            <!-- Controle de Fonte -->
            <div class="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs">
              <button id="btn-font-smaller" title="Diminuir fonte" class="w-7 h-7 rounded-lg hover:bg-slate-700 flex items-center justify-center font-bold text-slate-300">A-</button>
              <button id="btn-font-bigger" title="Aumentar fonte" class="w-7 h-7 rounded-lg hover:bg-slate-700 flex items-center justify-center font-bold text-slate-300">A+</button>
            </div>

            <!-- Timer -->
            <div class="flex items-center gap-2 font-mono text-base font-bold bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <i class="far fa-clock text-yellow-400"></i>
              <span id="hud-timer">${min}:${sec}</span>
            </div>

            <!-- Botão Sair / Abandonar -->
            <button id="btn-abandonar" class="text-xs text-slate-400 hover:text-white transition-colors">
              <i class="fas fa-times"></i> Sair
            </button>
          </div>
        </div>

        <!-- SPLIT VIEW -->
        <div class="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          <!-- COLUNA ESQUERDA: O TEXTÃO COMPLETO (Rolável e estilizado) -->
          <div class="lg:w-1/2 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 bg-amber-50/25 overflow-y-auto custom-scrollbar flex flex-col">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-amber-200/50">
              <span class="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                ${textaoAtivo.tema}
              </span>
              <span class="text-[11px] text-slate-500 italic">
                ${textaoAtivo.fonte}
              </span>
            </div>

            <h3 class="font-bold text-xl md:text-2xl text-slate-900 mb-6 font-serif leading-snug">
              ${textaoAtivo.titulo}
            </h3>

            <!-- Corpo do Texto -->
            <div id="corpo-textao" class="prose prose-slate font-serif text-slate-800 ${classeFonte} flex-1">
              ${textaoAtivo.texto}
            </div>

            <div class="mt-8 pt-4 border-t border-amber-200/60 text-center text-xs text-slate-400 italic">
              — Fim do texto base. Consulte-o sempre que necessário durante a resolução.
            </div>
          </div>

          <!-- COLUNA DIREITA: QUESTÃO ATUAL (1 a 4 do textão) -->
          <div class="lg:w-1/2 p-6 md:p-8 bg-white flex flex-col overflow-y-auto custom-scrollbar relative justify-between">
            
            <div>
              <!-- Indicador de Questão Atual -->
              <div class="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <span class="text-blue-700 font-black text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                  Questão ${questaoAtualIndex + 1} de ${questoesDaSessao.length}
                </span>

                <div class="flex items-center gap-1.5">
                  ${questoesDaSessao.map((q, idx) => {
                    const respondida = respostasUsuario[q.id] !== undefined;
                    const isAtual = idx === questaoAtualIndex;
                    let dotClass = 'w-2.5 h-2.5 rounded-full ';
                    if (isAtual) dotClass += 'bg-blue-600 ring-2 ring-blue-300';
                    else if (respondida) dotClass += 'bg-slate-800';
                    else dotClass += 'bg-slate-200';
                    return `<span class="${dotClass}" title="Questão ${idx + 1}"></span>`;
                  }).join('')}
                </div>
              </div>

              <!-- Enunciado -->
              <p class="font-bold text-slate-900 text-base md:text-lg mb-6 leading-relaxed">
                ${questaoAtualObj.enunciado}
              </p>

              <!-- Alternativas -->
              <div class="space-y-3 mb-8">
                ${questaoAtualObj.alternativas.map(alt => {
                  const isSelected = respostasUsuario[questaoAtualObj.id] === alt.letra;
                  return `
                    <label class="flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer 
                      ${isSelected ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-sm' : 'border-slate-200 hover:border-slate-400 bg-white'}">
                      <input type="radio" name="${questaoAtualObj.id}" value="${alt.letra}" class="sr-only" ${isSelected ? 'checked' : ''}>
                      <span class="w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 mt-0.5
                        ${isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}">
                        ${alt.letra}
                      </span>
                      <span class="text-sm ${isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-700'} leading-relaxed">
                        ${alt.texto}
                      </span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Navegação Inferior -->
            <div class="flex gap-3 pt-6 border-t border-slate-100 mt-6 shrink-0">
              <button id="btn-ant" class="px-5 py-3.5 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors text-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                <i class="fas fa-chevron-left"></i> Anterior
              </button>

              <button id="btn-prox" class="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-md">
                ${questaoAtualIndex === questoesDaSessao.length - 1 ? '<i class="fas fa-check-circle"></i> Finalizar Interpretação' : 'Próxima Questão <i class="fas fa-chevron-right"></i>'}
              </button>
            </div>

          </div>
        </div>

      </div>
    `;

    appContainer.innerHTML = html;
    atualizarTimerUI();
    bindInGameEvents();
  }

  function bindInGameEvents() {
    // Alternativas
    const radios = document.querySelectorAll(`input[name="${questaoAtualObj.id}"]`);
    radios.forEach(r => {
      r.addEventListener('change', (e) => {
        respostasUsuario[questaoAtualObj.id] = e.target.value;
        renderInGame();
      });
    });

    // Tamanho da Fonte
    const btnSmaller = document.getElementById('btn-font-smaller');
    const btnBigger = document.getElementById('btn-font-bigger');
    const fontes = ['sm', 'base', 'lg', 'xl'];

    if (btnSmaller) {
      btnSmaller.addEventListener('click', () => {
        const curIdx = fontes.indexOf(fonteTamanho);
        if (curIdx > 0) {
          fonteTamanho = fontes[curIdx - 1];
          renderInGame();
        }
      });
    }

    if (btnBigger) {
      btnBigger.addEventListener('click', () => {
        const curIdx = fontes.indexOf(fonteTamanho);
        if (curIdx < fontes.length - 1) {
          fonteTamanho = fontes[curIdx + 1];
          renderInGame();
        }
      });
    }

    // Navegação Anterior
    const btnAnt = document.getElementById('btn-ant');
    if (btnAnt) {
      if (questaoAtualIndex === 0) btnAnt.disabled = true;
      btnAnt.addEventListener('click', () => {
        if (questaoAtualIndex > 0) {
          questaoAtualIndex--;
          renderInGame();
        }
      });
    }

    // Próxima ou Finalizar
    const btnProx = document.getElementById('btn-prox');
    if (btnProx) {
      btnProx.addEventListener('click', () => {
        if (!respostasUsuario[questaoAtualObj.id]) {
          alert('Por favor, assinale uma alternativa antes de prosseguir.');
          return;
        }

        if (questaoAtualIndex < questoesDaSessao.length - 1) {
          questaoAtualIndex++;
          renderInGame();
        } else {
          if (timerInterval) clearInterval(timerInterval);
          estadoAtual = 'FEEDBACK';
          render();
        }
      });
    }

    // Abandonar
    const btnAbandonar = document.getElementById('btn-abandonar');
    if (btnAbandonar) {
      btnAbandonar.addEventListener('click', () => {
        if (confirm('Deseja cancelar o treino e voltar ao lobby?')) {
          if (timerInterval) clearInterval(timerInterval);
          estadoAtual = 'LOBBY';
          render();
        }
      });
    }
  }

  // ==========================================
  // 3. FEEDBACK & RESOLUÇÃO COMENTADA
  // ==========================================
  async function renderFeedback() {
    const tempoGastoSecs = Math.max(1, tempoTotalSegundos - Math.max(0, tempoRestante));
    const minGasto = Math.floor(tempoGastoSecs / 60);
    const segGasto = tempoGastoSecs % 60;
    
    let acertos = 0;
    const totalQ = questoesDaSessao.length;

    questoesDaSessao.forEach(q => {
      if (respostasUsuario[q.id] === q.correta) {
        acertos++;
      }
    });

    const percentualAcerto = Math.round((acertos / totalQ) * 100) || 0;
    const tempoPorQuestao = Math.floor(tempoGastoSecs / totalQ);

    let html = `
      <div class="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in text-center p-8 md:p-12 mt-6">
        
        <div class="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 border-4 ${percentualAcerto >= 70 ? 'border-emerald-500 text-emerald-500' : 'border-amber-500 text-amber-500'}">
          <i class="fas ${percentualAcerto >= 70 ? 'fa-trophy' : 'fa-graduation-cap'} text-3xl"></i>
        </div>
        
        <h2 class="text-3xl font-black text-slate-900 mb-2">Treino Concluído!</h2>
        <p class="text-slate-500 mb-8 text-sm">
          Você analisou o textão <strong>"${textaoAtivo.titulo}"</strong> e respondeu <strong>${totalQ} questão(ões)</strong>.
        </p>

        <!-- Métricas Rápidas -->
        <div class="grid grid-cols-3 gap-3 mb-8">
          <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Acertos</div>
            <div class="text-2xl md:text-3xl font-black text-slate-900">${acertos}<span class="text-sm text-slate-400">/${totalQ}</span></div>
          </div>
          <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Aproveitamento</div>
            <div class="text-2xl md:text-3xl font-black ${percentualAcerto >= 70 ? 'text-emerald-600' : 'text-amber-600'}">${percentualAcerto}%</div>
          </div>
          <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Tempo Gasto</div>
            <div class="text-2xl md:text-3xl font-black text-slate-900">${minGasto}m ${segGasto}s</div>
          </div>
        </div>

        <!-- Caderno de Correção Comentada -->
        <div class="text-left space-y-4 mb-8">
          <h4 class="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <i class="fas fa-list-check text-blue-600"></i> Gabarito Detalhado das ${totalQ} Questões:
          </h4>

          ${questoesDaSessao.map((q, idx) => {
            const marcada = respostasUsuario[q.id];
            const acertou = marcada === q.correta;
            return `
              <div class="p-5 rounded-2xl border ${acertou ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'} space-y-2">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-slate-900">Questão ${idx + 1}</span>
                  <span class="font-black px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${acertou ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}">
                    ${acertou ? '✓ Você Acertou' : '✗ Você Errou'}
                  </span>
                </div>

                <p class="text-xs font-semibold text-slate-800">${q.enunciado}</p>

                <div class="text-xs space-y-1 text-slate-700 pt-2 border-t border-slate-200/60">
                  <p>Sua resposta: <strong>Alternativa ${marcada || 'Em branco'}</strong></p>
                  <p class="text-emerald-800 font-bold">Gabarito oficial: Alternativa ${q.correta}</p>
                  <p class="text-slate-500 italic text-[11px] mt-1 bg-white/80 p-2.5 rounded-xl border border-slate-200/50">
                    💡 <strong>Justificativa:</strong> ${q.explicacao}
                  </p>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Banner de Sincronização -->
        <div class="text-left bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 mb-8 text-xs text-blue-900">
          <i class="fas fa-database text-blue-600 text-lg mt-0.5"></i>
          <div>
            <h5 class="font-bold">Desempenho Gravado no Cofre Offline</h5>
            <p class="text-blue-700 text-[11px] mt-0.5">
              Suas resoluções individuais foram gravadas com média de ${tempoPorQuestao}s por questão e serão sincronizadas com o Dashboard.
            </p>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button id="btn-refazer-textao" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-xl transition-all text-xs">
            Treinar Outras Questões Deste Textão
          </button>
          <button id="btn-novo-textao" class="flex-1 bg-black hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all text-xs shadow-md">
            Escolher Outro Textão / Matéria
          </button>
        </div>

      </div>
    `;

    appContainer.innerHTML = html;

    // Grava resoluções no Dexie local
    for (const q of questoesDaSessao) {
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

    document.getElementById('btn-refazer-textao')?.addEventListener('click', () => {
      estadoAtual = 'LOBBY';
      render();
    });

    document.getElementById('btn-novo-textao')?.addEventListener('click', () => {
      estadoAtual = 'LOBBY';
      render();
    });
  }

  // Inicialização
  render();

});
