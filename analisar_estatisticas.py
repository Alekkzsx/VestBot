import json
import os
from collections import Counter

ARQUIVO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "questions", "Questões-Simulado.json")

with open(ARQUIVO, "r", encoding="utf-8") as f:
    questoes = json.load(f)

total = len(questoes)

# Contadores
materias = Counter()
dificuldades = Counter()
temas = Counter()
com_imagem = 0
com_texto_referencia = 0
qts_alternativas = Counter()
tamanho_enunciado = []

for q in questoes:
    # Matéria
    materia = q.get("materia", "Sem Matéria")
    materias[materia] += 1
    
    # Dificuldade
    dificuldade = q.get("dificuldade", "Não definida")
    dificuldades[dificuldade] += 1
    
    # Imagem
    img1 = q.get("imagem")
    img2 = q.get("image_id")
    if (img1 and str(img1).strip()) or (img2 and str(img2).strip()):
        com_imagem += 1
        
    # Texto de Referência
    ref = q.get("texto_referencia")
    if ref and str(ref).strip():
        com_texto_referencia += 1
        
    # Tema
    tema = q.get("tema", "Sem Tema")
    if tema:
        temas[tema] += 1
        
    # Quantidade de Alternativas
    alts = q.get("alternativas", [])
    qts_alternativas[len(alts)] += 1
    
    # Tamanho do enunciado
    tamanho_enunciado.append(len(q.get("enunciado", "")))

print(f"📊 RELATÓRIO DE ESTATÍSTICAS DO BANCO DE QUESTÕES")
print(f"=" * 50)
print(f"Total de Questões: {total}")
print(f"Questões com Imagem: {com_imagem} ({com_imagem/total*100:.1f}%)")
print(f"Questões com Texto de Apoio: {com_texto_referencia} ({com_texto_referencia/total*100:.1f}%)")
print(f"Média de caracteres por enunciado: {sum(tamanho_enunciado)/total:.0f} caracteres")
print(f"=" * 50)

print(f"\\n📚 DIVISÃO POR MATÉRIAS:")
for m, count in materias.most_common():
    print(f"  - {m}: {count} ({count/total*100:.1f}%)")

print(f"\\n📈 DIVISÃO POR DIFICULDADE:")
for d, count in dificuldades.most_common():
    print(f"  - {d}: {count} ({count/total*100:.1f}%)")

print(f"\\n🔢 QUANTIDADE DE ALTERNATIVAS POR QUESTÃO:")
for qts, count in qts_alternativas.most_common():
    print(f"  - {qts} alternativas: {count} questões")

print(f"\\n🏷️ TOP 10 TEMAS MAIS FREQUENTES:")
for t, count in temas.most_common(10):
    if t != "Sem Tema":
        print(f"  - {t}: {count}")

