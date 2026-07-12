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

print(f"🔍 Analisando {len(data)} questões...")
print("📝 Detalhe das questões com matérias fora do padrão da ETEC:\n")

count = 0
for idx, q in enumerate(data):
    mat = q.get("materia", "")
    if mat not in MATERIAS_VALIDAS:
        count += 1
        print(f"{count}. ID: {q.get('id')} | Matéria Atual: '{mat}'")
        print(f"   Tema: {q.get('tema')}")
        print(f"   Enunciado: {q.get('enunciado')[:100]}...")
        print("-" * 80)

print(f"\n📊 Total de questões com matéria incorreta: {count}")
