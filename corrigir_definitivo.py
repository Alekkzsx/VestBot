#!/usr/bin/env python3
"""
Script definitivo para corrigir o arquivo Questões-Simulado.json.
1. Faz backup de segurança do arquivo original.
2. Extrai todas as questões varrendo objetos `{}` válidos contendo 'enunciado' e 'alternativas'.
3. As primeiras 870 questões correspondem ao primeiro bloco (originais) e mantêm seus IDs.
4. Todas as questões a partir do índice 870 (questão 871 em diante) são novas e recebem IDs a partir de 876.
5. Salva o resultado diretamente sobre o arquivo original Questões-Simulado.json de forma limpa.
"""
import json
import os
import shutil

DIR_ATUAL = os.path.dirname(os.path.abspath(__file__))
ARQUIVO_ORIGINAL = os.path.join(DIR_ATUAL, "questions", "Questões-Simulado.json")
ARQUIVO_BACKUP = os.path.join(DIR_ATUAL, "questions", "Questões-Simulado.json.bak")

print(f"📂 Arquivo original: {ARQUIVO_ORIGINAL}")

# 1. Fazer backup de segurança antes de qualquer alteração
try:
    shutil.copy2(ARQUIVO_ORIGINAL, ARQUIVO_BACKUP)
    print(f"💾 Backup de segurança gerado em: {ARQUIVO_BACKUP}")
except Exception as e:
    print(f"⚠️ Erro ao tentar criar backup: {e}")
    print("Execução interrompida por segurança.")
    exit(1)

# 2. Ler arquivo original
with open(ARQUIVO_ORIGINAL, "r", encoding="utf-8") as f:
    raw = f.read()

# 3. Extrair objetos de questões
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

# O primeiro bloco de questões originais tem exatamente 870 questões
QTD_ORIGINAIS = 870
max_original_id = 875

# 4. Aplicar correção de IDs
print(f"📋 Preservando IDs originais das primeiras {QTD_ORIGINAIS} questões...")

novas_count = 0
for idx, q in enumerate(questions):
    if idx < QTD_ORIGINAIS:
        # Mantém ID original intacto
        continue
    
    # Questão nova! Atribui ID sequencial a partir de 876
    novo_id = max_original_id + (idx - QTD_ORIGINAIS) + 1
    q["id"] = novo_id
    if "grupo_id" in q:
        q["grupo_id"] = novo_id
    novas_count += 1

print(f"🔄 Corrigidas {novas_count} questões novas. Elas receberam IDs de {max_original_id + 1} a {max_original_id + novas_count}")

# 5. Validar unicidade dos IDs
ids = [q["id"] for q in questions]
unique_ids = set(ids)
if len(ids) == len(unique_ids):
    print("✅ Sucesso: Todos os IDs gerados são exclusivos!")
else:
    print(f"❌ Erro: Existem IDs duplicados após a correção! ({len(ids)} total vs {len(unique_ids)} únicos)")
    from collections import Counter
    dupes = {k: v for k, v in Counter(ids).items() if v > 1}
    print(f"   Detalhe dos duplicados: {dupes}")
    exit(1)

# 6. Salvar de volta no arquivo original
output = json.dumps(questions, ensure_ascii=False, indent=2) + "\n"
with open(ARQUIVO_ORIGINAL, "w", encoding="utf-8") as f:
    f.write(output)

print(f"\n✨ Arquivo original corrigido e atualizado com sucesso!")
print(f"📊 Total final: {len(questions)} questões formatadas perfeitamente.")
print(f"🔢 Range de IDs no arquivo: {min(ids)} a {max(ids)}")
