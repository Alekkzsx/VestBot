#!/usr/bin/env python3
"""
Script para padronizar arquivos JSON de questões do VestBot.
Adiciona campos: grupo_id, tema, texto_referencia, image_id
"""

import json
import os
import sys
from pathlib import Path

# Diretório de questões
QUESTIONS_DIR = Path("/home/alekkzsx/Documentos/VestBot/VestBot/questions")

# Campos obrigatórios na estrutura expandida
REQUIRED_FIELDS = ["grupo_id", "tema", "texto_referencia", "image_id", "id", "materia", "dificuldade", "enunciado", "alternativas", "correta", "explicacao_base"]

def extract_tema_from_question(question):
    """Extrai um tema básico baseado na matéria e enunciado."""
    materia = question.get("materia", "Geral")
    enunciado = question.get("enunciado", "")
    
    # Pega primeiras palavras-chave do enunciado
    palavras = enunciado.split()[:5]
    tema_base = " ".join(palavras)
    
    # Limita tamanho
    if len(tema_base) > 40:
        tema_base = tema_base[:37] + "..."
    
    return f"{materia}: {tema_base}" if tema_base else materia

def standardize_question(question):
    """Adiciona campos faltantes a uma questão."""
    # Se já tem todos os campos, retorna sem modificar
    if all(field in question for field in ["grupo_id", "tema", "texto_referencia", "image_id"]):
        return question
    
    # Adiciona campos faltantes com valores padrão
    if "grupo_id" not in question:
        question["grupo_id"] = question.get("id", 0)
    
    if "tema" not in question:
        question["tema"] = extract_tema_from_question(question)
    
    if "texto_referencia" not in question:
        question["texto_referencia"] = ""
    
    if "image_id" not in question:
        question["image_id"] = ""
    
    # Reordena campos para manter consistência
    ordered_question = {}
    field_order = ["grupo_id", "tema", "texto_referencia", "image_id", "id", "materia", "dificuldade", "enunciado", "alternativas", "correta", "explicacao_base"]
    
    for field in field_order:
        if field in question:
            ordered_question[field] = question[field]
    
    # Adiciona quaisquer campos extras que não estão na ordem padrão
    for key, value in question.items():
        if key not in ordered_question:
            ordered_question[key] = value
    
    return ordered_question

def process_file(filepath):
    """Processa um arquivo de questões."""
    print(f"\n📄 Processando: {filepath.name}")
    
    try:
        # Lê o arquivo
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            print(f"  ⚠️ Arquivo não é uma lista JSON, pulando...")
            return False
        
        # Conta questões modificadas
        modified = 0
        total = len(data)
        
        # Padroniza cada questão
        standardized_data = []
        for question in data:
            original_keys = set(question.keys())
            standardized = standardize_question(question)
            new_keys = set(standardized.keys())
            
            if new_keys != original_keys:
                modified += 1
            
            standardized_data.append(standardized)
        
        # Salva o arquivo padronizado
        if modified > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(standardized_data, f, ensure_ascii=False, indent=2)
            
            print(f"  ✅ {modified}/{total} questões modificadas")
            return True
        else:
            print(f"  ✓ Arquivo já estava padronizado ({total} questões)")
            return False
    
    except json.JSONDecodeError as e:
        print(f"  ❌ Erro ao ler JSON: {e}")
        return False
    except Exception as e:
        print(f"  ❌ Erro inesperado: {e}")
        return False

def main():
    """Função principal."""
    print("=" * 60)
    print("🔧 PADRONIZADOR DE ARQUIVOS JSON DE QUESTÕES VESTBOT")
    print("=" * 60)
    
    # Lista todos os arquivos .txt na pasta questions
    question_files = sorted(QUESTIONS_DIR.glob("*.txt"))
    
    if not question_files:
        print("\n⚠️ Nenhum arquivo .txt encontrado na pasta questions/")
        return 1
    
    print(f"\n📁 Encontrados {len(question_files)} arquivos para processar\n")
    
    # Processa cada arquivo
    modified_files = 0
    for filepath in question_files:
        if process_file(filepath):
            modified_files += 1
    
    # Resumo final
    print("\n" + "=" * 60)
    print("📊 RESUMO")
    print("=" * 60)
    print(f"Total de arquivos processados: {len(question_files)}")
    print(f"Arquivos modificados: {modified_files}")
    print(f"Arquivos já padronizados: {len(question_files) - modified_files}")
    print("\n✨ Padronização concluída!")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
