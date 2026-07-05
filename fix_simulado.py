#!/usr/bin/env python3
"""
Corrige Questões-Simulado.json:
- Primeiro array (linhas 1-16532): questões originais, IDs mantidos (1-875)  
- Tudo após linha 16532: questões NOVAS → recebem IDs sequenciais a partir de 876
- Remove ```json e ``` (markdown)
- Remove linhas em branco extras
- Salva como um único JSON válido (sobrescreve o original)
"""
import json
import os

ARQUIVO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "questions", "Questões-Simulado.json")

print(f"📂 Arquivo: {ARQUIVO}")

with open(ARQUIVO, "r", encoding="utf-8") as f:
    raw = f.read()

print(f"📏 Tamanho original: {len(raw):,} bytes, {raw.count(chr(10)):,} linhas")

# Extrair TODOS os arrays JSON separadamente
arrays = []
pos = 0
decoder = json.JSONDecoder()

while pos < len(raw):
    start = raw.find('[', pos)
    if start == -1:
        break
    try:
        obj, end_offset = decoder.raw_decode(raw, start)
        if isinstance(obj, list):
            arrays.append(obj)
            pos = start + end_offset
        else:
            pos = start + 1
    except json.JSONDecodeError:
        pos = start + 1

print(f"🔍 Arrays JSON encontrados: {len(arrays)}")
for i, arr in enumerate(arrays):
    ids = [q.get("id") for q in arr]
    print(f"   Array {i+1}: {len(arr)} questões, IDs: {min(ids)}-{max(ids)}")

# Primeiro array = originais (manter IDs)
original = arrays[0]
max_id = max(q["id"] for q in original)
print(f"\n📋 Originais (array 1): {len(original)} questões, IDs 1-{max_id}")

# Todos os outros arrays = questões NOVAS
novas = []
for arr in arrays[1:]:
    novas.extend(arr)
print(f"📋 Novas (arrays 2-{len(arrays)}): {len(novas)} questões (todas com IDs errados)")

# Atribuir IDs sequenciais a TODAS as questões novas
next_id = max_id + 1
for q in novas:
    q["id"] = next_id
    if "grupo_id" in q:
        q["grupo_id"] = next_id
    next_id += 1

print(f"🔄 Novos IDs atribuídos: {max_id + 1} → {next_id - 1}")

# Combinar
todos = original + novas
print(f"\n📋 TOTAL FINAL: {len(todos)} questões")

# Verificar unicidade
ids = [q["id"] for q in todos]
assert len(ids) == len(set(ids)), "ERRO: IDs duplicados!"
print(f"✅ Todos os {len(ids)} IDs são únicos!")

# Salvar
output = json.dumps(todos, ensure_ascii=False, indent=2) + "\n"
with open(ARQUIVO, "w", encoding="utf-8") as f:
    f.write(output)

print(f"\n✅ Arquivo salvo!")
print(f"   📏 Novo tamanho: {len(output):,} bytes")
print(f"   🔢 IDs: 1 → {max(ids)}")

# Verificação
with open(ARQUIVO, "r", encoding="utf-8") as f:
    check = json.load(f)
print(f"✅✅ JSON válido confirmado: {len(check)} questões!")
