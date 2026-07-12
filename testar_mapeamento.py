#!/usr/bin/env python3
import json
import os

DIR_ATUAL = os.path.dirname(os.path.abspath(__file__))
ARQUIVO = os.path.join(DIR_ATUAL, "questions", "Questões-Simulado.json")

with open(ARQUIVO, "r", encoding="utf-8") as f:
    data = json.load(f)

MATERIAS_VALIDAS = {
    'Língua Portuguesa',
    'Matemática',
    'Ciências — Biologia',
    'Ciências — Química',
    'Ciências — Física',
    'História',
    'Geografia'
}

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

print("🧪 Testando mapeamento para as questões com matéria fora do padrão:")
print("-" * 100)

alteradas = 0
for idx, q in enumerate(data):
    mat_original = q.get("materia", "")
    if mat_original not in MATERIAS_VALIDAS:
        mat_nova = mapear_materia(mat_original, q.get("tema", ""), q.get("enunciado", ""))
        alteradas += 1
        print(f"{alteradas}. ID: {q.get('id'):<4} | Tema: {q.get('tema')[:40]:<40}")
        print(f"    '{mat_original}'  ===>  '{mat_nova}'")
        if mat_nova not in MATERIAS_VALIDAS:
            print("    ⚠️  ALERTA: A matéria de destino ainda é inválida!")
        print("-" * 100)

print(f"\n📊 Total de questões mapeadas: {alteradas}")
