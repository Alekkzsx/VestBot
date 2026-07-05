#!/usr/bin/env python3
import json
import os

ARQUIVO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "questions", "Questões-Simulado.json")

with open(ARQUIVO, "r", encoding="utf-8") as f:
    lines = f.readlines()

raw = "".join(lines)

print(f"Total de linhas no arquivo: {len(lines)}")

# Vamos encontrar as posições de todos os '[' no arquivo
pos = 0
decoder = json.JSONDecoder()
bracket_indices = []
while True:
    idx = raw.find('[', pos)
    if idx == -1:
        break
    bracket_indices.append(idx)
    pos = idx + 1

print(f"Encontrados {len(bracket_indices)} caracteres '[' no arquivo.")

for i, idx in enumerate(bracket_indices):
    # Calcular o número da linha correspondente a este '['
    line_no = raw[:idx].count('\n') + 1
    print(f"\n--- Analisando '[' na linha {line_no} (Índice de '[': {i+1}) ---")
    
    # Mostrar um pedaço do início do bloco
    snippet = raw[idx:idx+150].replace('\n', ' ')
    print(f"Início: {snippet}...")
    
    try:
        obj, end_offset = decoder.raw_decode(raw, idx)
        if isinstance(obj, list):
            print(f"✅ Sucesso ao decodificar array! Contém {len(obj)} questões.")
        else:
            print(f"⚠️ Decodificou algo que não é lista: {type(obj)}")
    except json.JSONDecodeError as e:
        print(f"❌ Falha de decodificação de JSON no bloco começando na linha {line_no}!")
        print(f"Erro: {e}")
        # Encontrar a linha exata do erro
        err_char_pos = idx + e.pos
        err_line = raw[:err_char_pos].count('\n') + 1
        err_col = err_char_pos - raw[:err_char_pos].rfind('\n')
        print(f"Localizado na linha do arquivo: {err_line}, coluna: {err_col}")
        # Mostrar o trecho de erro
        context_start = max(0, err_char_pos - 100)
        context_end = min(len(raw), err_char_pos + 100)
        context = raw[context_start:context_end]
        print("Trecho ao redor do erro:")
        print(">>>" + context + "<<<")
