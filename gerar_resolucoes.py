#!/usr/bin/env python3
"""
Script para preencher automaticamente as resoluções faltantes em Resolução-Simulados.json.
1. Carrega todas as questões de Questões-Simulado.json.
2. Carrega as resoluções existentes de Resolução-Simulados.json.
3. Identifica as questões que não possuem resolução.
4. Gera uma resolução em 3 passos estruturados para cada questão faltante:
   - Passo 1: Identificação do Problema (com base na matéria e tema).
   - Passo 2: Análise e Desenvolvimento (com base na explicacao_base).
   - Passo 3: Conclusão da Resposta (com base na alternativa correta).
5. Salva o arquivo de resoluções atualizado e perfeitamente formatado.
"""
import json
import os
import shutil

DIR_ATUAL = os.path.dirname(os.path.abspath(__file__))
ARQUIVO_QUESTOES = os.path.join(DIR_ATUAL, "questions", "Questões-Simulado.json")
ARQUIVO_RESOLUCOES = os.path.join(DIR_ATUAL, "questions", "Resolução-Simulados.json")
ARQUIVO_BACKUP = os.path.join(DIR_ATUAL, "questions", "Resolução-Simulados.json.bak")

print(f"📂 Arquivo de Questões: {ARQUIVO_QUESTOES}")
print(f"📂 Arquivo de Resoluções: {ARQUIVO_RESOLUCOES}")

# 1. Backup de segurança das resoluções
if os.path.exists(ARQUIVO_RESOLUCOES):
    try:
        shutil.copy2(ARQUIVO_RESOLUCOES, ARQUIVO_BACKUP)
        print(f"💾 Backup de segurança gerado em: {ARQUIVO_BACKUP}")
    except Exception as e:
        print(f"⚠️ Erro ao tentar criar backup: {e}")
        exit(1)
else:
    print("ℹ️ Arquivo de resoluções não existia. Será criado do zero.")

# 2. Carregar questões
with open(ARQUIVO_QUESTOES, "r", encoding="utf-8") as f:
    questoes = json.load(f)

print(f"📋 Total de questões no simulado: {len(questoes)}")

# 3. Carregar resoluções existentes
resolucoes = []
if os.path.exists(ARQUIVO_RESOLUCOES):
    with open(ARQUIVO_RESOLUCOES, "r", encoding="utf-8") as f:
        try:
            resolucoes = json.load(f)
        except json.JSONDecodeError:
            print("⚠️ Erro ao ler arquivo de resoluções existente. Começando com lista vazia.")
            resolucoes = []

print(f"📋 Total de resoluções existentes: {len(resolucoes)}")

# Criar conjunto de IDs que já possuem resolução de forma robusta
ids_com_resolucao = set()
for idx, r in enumerate(resolucoes):
    qid = r.get("questionId")
    if qid is not None:
        ids_com_resolucao.add(qid)
    else:
        # Se tiver id em vez de questionId
        alt_id = r.get("id")
        if alt_id is not None:
            ids_com_resolucao.add(alt_id)
            # Corrigir a chave no próprio objeto
            r["questionId"] = alt_id
            del r["id"]
        else:
            print(f"⚠️ Alerta: Objeto no índice {idx} do JSON de resoluções não possui 'questionId' nem 'id': {r}")

# 4. Encontrar as resoluções faltantes e gerá-las
novas_resolucoes = 0

for q in questoes:
    qid = q.get("id")
    if qid is None:
        continue
    
    if qid not in ids_com_resolucao:
        # Extrair dados da questão
        materia = q.get("materia", "Geral")
        tema = q.get("tema", "Interdisciplinar")
        enunciado = q.get("enunciado", "")
        correta = q.get("correta", "")
        explicacao = q.get("explicacao_base", "Análise detalhada das alternativas.")
        
        # Garantir limites de tamanho de enunciado na intro
        enunciado_resumo = enunciado[:150].strip() + "..." if len(enunciado) > 150 else enunciado
        
        # Gerar os 3 passos
        passo1 = {
            "title": "🔍 Passo 1 — Identificação do Problema",
            "content": f"Esta questão de {materia} aborda o tema '{tema}'. O enunciado nos solicita analisar o seguinte problema: {enunciado_resumo}"
        }
        
        passo2 = {
            "title": "💡 Passo 2 — Análise e Desenvolvimento",
            "content": explicacao
        }
        
        passo3 = {
            "title": "🛠️ Passo 3 — Conclusão da Resposta",
            "content": f"Considerando a análise teórica e os dados fornecidos, concluímos que a alternativa correta é: '{correta}'."
        }
        
        # Criar objeto da resolução
        resolucao = {
            "questionId": qid,
            "steps": [passo1, passo2, passo3]
        }
        
        resolucoes.append(resolucao)
        novas_resolucoes += 1

print(f"🔄 Geradas {novas_resolucoes} novas resoluções estruturadas.")

# 5. Ordenar resoluções pelo questionId para manter o arquivo organizado
resolucoes.sort(key=lambda r: r["questionId"])

# 6. Salvar resoluções
output = json.dumps(resolucoes, ensure_ascii=False, indent=4) + "\n"
with open(ARQUIVO_RESOLUCOES, "w", encoding="utf-8") as f:
    f.write(output)

print(f"\n✨ Sucesso! {len(resolucoes)} resoluções gravadas em: {ARQUIVO_RESOLUCOES}")
