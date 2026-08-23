import json
import os
import shutil
from collections import Counter

DIR_ATUAL = os.path.dirname(os.path.abspath(__file__))
ARQUIVO_ORIGINAL = os.path.join(DIR_ATUAL, "questions", "Questões-Simulado.json")
ARQUIVO_BACKUP = os.path.join(DIR_ATUAL, "questions", "Questões-Simulado.json.bak")

VALID_MATERIAS = {
    "Língua Portuguesa",
    "Matemática",
    "Ciências — Biologia",
    "Ciências — Química",
    "Ciências — Física",
    "História",
    "Geografia"
}

def mapear_materia(q):
    m = q.get("materia", "").strip()
    if m in VALID_MATERIAS:
        return m
        
    t = q.get("tema", "").lower()
    e = q.get("enunciado", "").lower()
    ml = m.lower()
    
    # Matemática
    if any(k in t or k in e for k in ["teoria dos conjuntos", "função afim", "função quadrática", "equação", "porcentagem", "probabilidade", "estatística", "média aritmética", "trigonometria", "triângulo", "geometria plana", "geometria espacial", "volume do prisma", "área da figura", "regra de três", "juros simples", "juros compostos", "escala cartográfica", "progressão aritmética", "progressão geométrica", "anos-luz", "notação científica"]):
        if any(k in e for k in ["calcule", "determine o valor", "qual é o valor", "qual é a área", "qual é o volume", "a probabilidade", "porcentagem", "número de indivíduos", "razão entre"]):
            return "Matemática"
    
    # Física
    if any(k in t or k in e for k in ["cinemática", "velocidade média", "aceleração", "leis de newton", "força de atrito", "energia mecânica", "energia cinética", "energia potencial", "trabalho e potência", "eletrostática", "corrente elétrica", "primeira lei de ohm", "resistores", "potência elétrica", "consumo de energia", "calorimetria", "trocas de calor", "pressão hidrostática", "princípio de arquimedes", "óptica geométrica", "reflexão da luz", "refração", "ondas sonoras", "termodinâmica", "máquinas térmicas", "empuxo"]):
        if any(k in e for k in ["potência", "velocidade", "resistência", "tensão", "corrente", "quilowatt", "joule", "aceleração", "newton", "energia mecânica", "calor"]):
            return "Ciências — Física"
    
    # Química
    if any(k in t or k in e for k in ["reação química", "reações de oxirredução", "balanceamento", "tabela periódica", "ligação química", "ligação iônica", "ligação covalente", "separação de misturas", "destilação", "filtração", "decantação", "ácidos e bases", "escala de ph", "chuva ácida", "combustão completa", "termoquímica", "densidade dos materiais", "gás carbônico", "poluição atmosférica por nox", "oxidação", "pilhas"]):
        return "Ciências — Química"
    
    # Biologia
    if any(k in t or k in e for k in ["célula", "organelas", "mitocôndria", "cloroplasto", "fotossíntese", "respiração celular", "mitose", "meiose", "genética", "hereditariedade", "ecologia", "cadeia alimentar", "teia alimentar", "relações ecológicas", "bioma", "biodiversidade", "agroflorestal", "vírus", "bactéria", "sistema circulatório", "sistema digestório", "sistema respiratório", "imunologia", "vacina", "soro", "fisiologia"]):
        return "Ciências — Biologia"
    
    # Língua Portuguesa
    if any(k in t or k in e for k in ["figuras de linguagem", "metáfora", "metonímia", "coesão textual", "coerência", "conjunção", "pronomes", "regência", "crase", "concordância", "pontuação", "funções da linguagem", "tipologia textual", "gênero textual", "crônica", "poema", "charge", "ambiguidade", "ironia", "sinonímia"]):
        return "Língua Portuguesa"
    
    # História
    if any(k in t or k in e for k in ["brasil colônia", "ciclo do açúcar", "ciclo do ouro", "escravidão", "abolição", "independência", "primeiro reinado", "segundo reinado", "era vargas", "ditadura militar", "república oligárquica", "revolução industrial", "primeira guerra", "segunda guerra", "guerra fria", "revolução francesa", "iluminismo", "feudalismo", "antiguidade clássica", "grécia antiga", "roma antiga", "revolta da vacina", "revolta de canudos", "cangaço", "modernismo de 1922"]):
        return "História"
    
    # Geografia
    if any(k in t or k in e for k in ["urbanização", "migração", "demografia", "população", "clima", "relevo", "bacias hidrográficas", "cartografia", "fusos horários", "geopolítica", "globalização", "industrialização brasileira", "fronteira agrícola", "cerrado", "amazônia", "caatinga", "impactos socioambientais", "desmatamento", "matriz energética"]):
        return "Geografia"
        
    # Mapeamento com base no prefixo/sufixo do nome composto da matéria
    if "física" in ml:
        return "Ciências — Física"
    if "química" in ml:
        return "Ciências — Química"
    if "biologia" in ml:
        return "Ciências — Biologia"
    if "portuguesa" in ml or "literatura" in ml:
        return "Língua Portuguesa"
    if "matemática" in ml:
        return "Matemática"
    if "história" in ml:
        return "História"
    if "geografia" in ml:
        return "Geografia"
        
    return "Língua Portuguesa"

def run():
    print(f"📂 Arquivo original: {ARQUIVO_ORIGINAL}")

    # 1. Backup de segurança
    try:
        shutil.copy2(ARQUIVO_ORIGINAL, ARQUIVO_BACKUP)
        print(f"💾 Backup gerado em: {ARQUIVO_BACKUP}")
    except Exception as e:
        print(f"⚠️ Erro ao tentar criar backup: {e}")
        exit(1)

    # 2. Ler arquivo e extrair questões com segurança
    with open(ARQUIVO_ORIGINAL, "r", encoding="utf-8") as f:
        raw = f.read()

    decoder = json.JSONDecoder()
    pos = 0
    questions = []

    while pos < len(raw):
        start = raw.find("{", pos)
        if start == -1:
            break
        try:
            obj, end_offset = decoder.raw_decode(raw, start)
            if isinstance(obj, dict) and "enunciado" in obj and "alternativas" in obj:
                questions.append(obj)
            pos = end_offset
        except json.JSONDecodeError:
            pos = start + 1

    total_encontrado = len(questions)
    print(f"🔍 Total de questões extraídas: {total_encontrado}")

    # 3. Aplicar mapeamento e corrigir IDs
    QTD_ORIGINAIS = 870
    max_original_id = 875
    novas_count = 0
    corrigidas_materias = 0

    for idx, q in enumerate(questions):
        # Mapeamento da matéria
        mat_original = q.get("materia", "")
        if mat_original not in VALID_MATERIAS:
            nova_mat = mapear_materia(q)
            q["materia"] = nova_mat
            corrigidas_materias += 1
            
        # Manutenção de ID para originais
        if idx < QTD_ORIGINAIS:
            continue
            
        # Atribuir ID sequencial para as novas
        novo_id = max_original_id + (idx - QTD_ORIGINAIS) + 1
        q["id"] = novo_id
        if "grupo_id" in q:
            q["grupo_id"] = novo_id
        novas_count += 1

    print(f"🔄 {novas_count} questões novas receberam IDs sequenciais (de {max_original_id + 1} a {max_original_id + novas_count}).")
    print(f"✏️ {corrigidas_materias} questões tiveram a matéria ajustada baseada no seu script avançado.")

    # 4. Validar IDs Únicos e Matérias
    ids = [q["id"] for q in questions]
    if len(ids) != len(set(ids)):
        print(f"❌ Erro: IDs duplicados encontrados!")
        exit(1)

    materias_finais = {q.get("materia") for q in questions}
    problemas_materias = materias_finais - VALID_MATERIAS
    if problemas_materias:
        print(f"❌ Erro: Matérias inválidas persistiram: {problemas_materias}")
        exit(1)

    # 5. Salvar arquivo
    output = json.dumps(questions, ensure_ascii=False, indent=2) + "\\n"
    with open(ARQUIVO_ORIGINAL, "w", encoding="utf-8") as f:
        f.write(output)

    print(f"\\n✨ Questões-Simulado.json consertado e unificado perfeitamente!")
    print(f"📊 Total final: {len(questions)} questões ativas.")

if __name__ == "__main__":
    run()
