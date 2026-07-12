#!/usr/bin/env python3
"""
Script definitivo para corrigir as matérias no arquivo Questões-Simulado.json.
1. Faz backup de segurança do arquivo original.
2. Aplica o mapeamento inteligente de matérias para alinhar com o padrão ETEC do VestBot.
3. Salva de volta no arquivo original.
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

# 1. Backup de segurança
try:
    shutil.copy2(ARQUIVO_ORIGINAL, ARQUIVO_BACKUP)
    print(f"💾 Backup de segurança gerado em: {ARQUIVO_BACKUP}")
except Exception as e:
    print(f"⚠️ Erro ao tentar criar backup: {e}")
    exit(1)

# 2. Mapeamento inteligente
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

# 3. Ler arquivo
with open(ARQUIVO_ORIGINAL, "r", encoding="utf-8") as f:
    questions = json.load(f)

# 4. Corrigir matérias
print(f"🔍 Total de questões carregadas: {len(questions)}")
corrigidas = 0

for q in questions:
    mat_original = q.get("materia", "")
    if mat_original not in MATERIAS_VALIDAS:
        mat_nova = mapear_materia(mat_original, q.get("tema", ""), q.get("enunciado", ""))
        q["materia"] = mat_nova
        corrigidas += 1

print(f"🔄 Total de questões com matéria corrigida: {corrigidas}")

# 5. Validação final
materias_finais = {q.get("materia") for q in questions}
problemas = materias_finais - MATERIAS_VALIDAS
if problemas:
    print(f"❌ Erro: Algumas matérias ainda são inválidas! {problemas}")
    exit(1)
else:
    print("✅ Sucesso: Todas as matérias agora correspondem aos padrões oficiais da ETEC!")

# 6. Salvar
output = json.dumps(questions, ensure_ascii=False, indent=2) + "\n"
with open(ARQUIVO_ORIGINAL, "w", encoding="utf-8") as f:
    f.write(output)

print(f"\n✨ Arquivo original salvo com sucesso com as matérias corrigidas!")
print(f"📊 Total final: {len(questions)} questões.")
