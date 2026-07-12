#!/usr/bin/env python3
"""
Script unificado para corrigir o arquivo Questões-Simulado.json.
Resolve de uma só vez:
1. Formatação incorreta (marcações markdown, múltiplos arrays, linhas vazias).
2. IDs e grupo_ids duplicados/errados (preserva os primeiros 870 IDs originais, corrige todos os novos de 876 em diante).
3. Matérias com nomes errados ou interdisciplinares (mapeia de forma inteligente para as 7 matérias oficiais da ETEC).
4. Sobrescreve o arquivo original de forma limpa após validação.
"""
import json
import os
import shutil

DIR_ATUAL = os.path.dirname(os.path.abspath(__file__))
ARQUIVO_ORIGINAL = os.path.join(DIR_ATUAL, "questions", "Questões-Simulado.json")
ARQUIVO_BACKUP = os.path.join(DIR_ATUAL, "questions", "Questões-Simulado.json.bak")

MATERIAS_VALIDAS = {
    'Língua Portuguesa',
    'Matemática',
    'Ciências — Biologia',
    'Ciências — Química',
    'Ciências — Física',
    'História',
    'Geografia'
}

print(f"📂 Arquivo original: {ARQUIVO_ORIGINAL}")

# 1. Backup de segurança do arquivo original
try:
    shutil.copy2(ARQUIVO_ORIGINAL, ARQUIVO_BACKUP)
    print(f"💾 Backup de segurança gerado em: {ARQUIVO_BACKUP}")
except Exception as e:
    print(f"⚠️ Erro ao tentar criar backup: {e}")
    exit(1)

# 2. Ler arquivo
with open(ARQUIVO_ORIGINAL, "r", encoding="utf-8") as f:
    raw = f.read()

# 3. Extrair todas as questões de forma robusta
decoder = json.JSONDecoder()
pos = 0
questions = []

while pos < len(raw):
    start = raw.find('{', pos)
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

if total_encontrado == 0:
    print("❌ Nenhuma questão encontrada!")
    exit(1)

# 4. Mapeamento inteligente de matérias
def mapear_materia(materia, tema, enunciado):
    m = materia.lower()
    t = tema.lower() if tema else ""
    e = enunciado.lower() if enunciado else ""
    
    # 1. Regras de Ciências específicas
    if "biologia" in m or "biologia" in t:
        return "Ciências — Biologia"
    if "química" in m or "quimica" in m or "química" in t or "quimica" in t:
        return "Ciências — Química"
    if "física" in m or "fisica" in m or "física" in t or "fisica" in t:
        return "Ciências — Física"
        
    # 2. Se a matéria isolada for Ciências (ex: "Geografia / Ciências")
    if "ciências" in m or "ciencias" in m:
        if any(w in t or w in e for w in ["agroflorestal", "ecossistema", "ecologia", "planta", "célula", "celula", "bioma", "biodiversidade", "sustentabilidade", "florestal"]):
            return "Ciências — Biologia"
        if any(w in t or w in e for w in ["relação", "relação química", "átomo", "substância", "mistura", "reação", "combustão", "ph", "ácido", "soluto", "solução"]):
            return "Ciências — Química"
        if any(w in t or w in e for w in ["energia", "potência", "consumo", "movimento", "velocidade", "calor", "trabalho", "mecânica", "física", "cinemática"]):
            return "Ciências — Física"
        return "Ciências — Biologia"

    # 3. Literatura / Língua Portuguesa
    if "portuguesa" in m or "literatura" in m or "linguagem" in t or "poema" in t or "crônica" in t or "sintaxe" in t or "leitura" in t or "vocabulário" in t:
        return "Língua Portuguesa"
        
    # 4. História
    if "história" in m or "historia" in m or "história" in t or "historia" in t or "ditadura" in t or "revolução" in t or "vargas" in t or "era vargas" in t:
        return "História"
        
    # 5. Geografia
    if "geografia" in m or "geografia" in t or "cartografia" in t or "clima" in t or "urbanização" in t or "demográfica" in t or "migração" in t:
        return "Geografia"
        
    # 6. Matemática
    if "matemática" in m or "matematica" in m or "matemática" in t or "matematica" in t or "cálculo" in t or "geometria" in t or "porcentagem" in t or "juros" in t or "regra de três" in t or "fração" in t:
        return "Matemática"

    # 7. Divisão por barra '/' para os interdisciplinares restantes
    if "/" in materia:
        partes = [p.strip() for p in materia.split("/")]
        for p in partes:
            if p == "Física":
                return "Ciências — Física"
            if p == "Química":
                return "Ciências — Química"
            if p == "Biologia":
                return "Ciências — Biologia"
            if p in ["Língua Portuguesa", "Matemática", "História", "Geografia"]:
                return p
        
    # 8. Mapeamentos estritos residuais
    if materia == "Física":
        return "Ciências — Física"
    if materia == "Química":
        return "Ciências — Química"
    if materia == "Biologia":
        return "Ciências — Biologia"
        
    # Casos especiais residuais
    if "atualidades" in m or "sociologia" in m or "humanas" in m:
        if "história" in t or "historia" in t or "era" in t or "século" in t:
            return "História"
        return "Geografia"

    return materia

# 5. Aplicar correção de IDs e Matérias
QTD_ORIGINAIS = 870
max_original_id = 875

print(f"📋 Corrigindo e processando dados...")
corrigidas_materias = 0
novas_count = 0

for idx, q in enumerate(questions):
    # Correção da Matéria (aplica para todas, antigas e novas, se estiverem erradas)
    mat_original = q.get("materia", "")
    if mat_original not in MATERIAS_VALIDAS:
        mat_nova = mapear_materia(mat_original, q.get("tema", ""), q.get("enunciado", ""))
        q["materia"] = mat_nova
        corrigidas_materias += 1
    
    # Correção do ID e grupo_id (apenas para as novas)
    if idx < QTD_ORIGINAIS:
        continue
        
    novo_id = max_original_id + (idx - QTD_ORIGINAIS) + 1
    q["id"] = novo_id
    if "grupo_id" in q:
        q["grupo_id"] = novo_id
    novas_count += 1

print(f"🔄 {novas_count} questões novas receberam IDs sequenciais (de {max_original_id + 1} a {max_original_id + novas_count}).")
print(f"✏️ {corrigidas_materias} questões tiveram a matéria ajustada para o padrão oficial.")

# 6. Validar unicidade dos IDs
ids = [q["id"] for q in questions]
unique_ids = set(ids)
if len(ids) != len(unique_ids):
    print(f"❌ Erro: Existem IDs duplicados após o processamento! ({len(ids)} total vs {len(unique_ids)} únicos)")
    from collections import Counter
    dupes = {k: v for k, v in Counter(ids).items() if v > 1}
    print(f"   Detalhe dos duplicados: {dupes}")
    exit(1)

# 7. Validar matérias finais
materias_finais = {q.get("materia") for q in questions}
problemas_materias = materias_finais - MATERIAS_VALIDAS
if problemas_materias:
    print(f"❌ Erro: Algumas matérias finais ainda são inválidas! {problemas_materias}")
    exit(1)

print("✅ Validações de IDs e Matérias concluídas com sucesso!")

# 8. Gravar arquivo corrigido
output = json.dumps(questions, ensure_ascii=False, indent=2) + "\n"
with open(ARQUIVO_ORIGINAL, "w", encoding="utf-8") as f:
    f.write(output)

print(f"\n✨ Arquivo original corrigido, limpo e atualizado!")
print(f"📊 Total final: {len(questions)} questões ativas.")
print(f"🔢 Range de IDs: {min(ids)} a {max(ids)}")
