#!/usr/bin/env python3
import json
import os
from collections import Counter

DIR_ATUAL = os.path.dirname(os.path.abspath(__file__))
ARQUIVO = os.path.join(DIR_ATUAL, "questions", "Questões-Simulado.json")

with open(ARQUIVO, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"📊 Total de questões no arquivo: {len(data)}")
print("\n📝 Lista de matérias encontradas e quantidade de questões:")
print("-" * 60)

materias = [q.get("materia", "SEM MATÉRIA") for q in data]
for mat, count in sorted(Counter(materias).items(), key=lambda x: (-x[1], x[0])):
    print(f"🔹 {mat:<45} | {count:>4} questões")

print("-" * 60)
