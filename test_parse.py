#!/usr/bin/env python3
import json
import os

ARQUIVO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "questions", "Questões-Simulado.json")

with open(ARQUIVO, "r", encoding="utf-8") as f:
    raw = f.read()

decoder = json.JSONDecoder()
pos = 0
questions = []
ignored_objects = 0

print("🔍 Iniciando varredura por objetos de questões no arquivo...")

while pos < len(raw):
    # Procurar o início de um objeto JSON '{'
    start = raw.find('{', pos)
    if start == -1:
        break
    
    try:
        # Tenta decodificar o objeto a partir de '{'
        obj, end_offset = decoder.raw_decode(raw, start)
        
        # Verificar se é um dicionário e tem os campos característicos de uma questão
        if isinstance(obj, dict) and "enunciado" in obj and "alternativas" in obj:
            questions.append(obj)
        else:
            ignored_objects += 1
            
        pos = end_offset
    except json.JSONDecodeError:
        # Se falhar, avança apenas um caractere para tentar o próximo '{'
        pos = start + 1

print(f"\n📊 Resultados da extração:")
print(f"   - Total de questões encontradas: {len(questions)}")
print(f"   - Outros objetos JSON ignorados: {ignored_objects}")

if questions:
    print("\n📋 Amostra das primeiras questões encontradas:")
    for q in questions[:3]:
        print(f"     ID: {q.get('id')} | Matéria: {q.get('materia')} | Enunciado: {q.get('enunciado')[:60]}...")
    
    print("\n📋 Amostra das últimas questões encontradas (novas):")
    for q in questions[-5:]:
        print(f"     ID original: {q.get('id')} | Matéria: {q.get('materia')} | Enunciado: {q.get('enunciado')[:60]}...")
