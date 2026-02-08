#!/usr/bin/env python3
"""
Script para adicionar campo image_id ao padrao.txt
"""

import json

# Caminho do arquivo
PADRAO_FILE = "/home/alekkzsx/Documentos/VestBot/VestBot/questions/padrao.txt"

def add_image_id_field():
    """Adiciona campo image_id a todas as questões do padrao.txt"""
    print("📄 Processando padrao.txt...")
    
    # Lê o arquivo
    with open(PADRAO_FILE, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f"   Total de questões: {len(questions)}")
    
    # Adiciona image_id em cada questão (após texto_referencia)
    modified = 0
    for question in questions:
        if "image_id" not in question:
            # Cria nova questão com ordem correta dos campos
            new_question = {}
            for key in question.keys():
                new_question[key] = question[key]
                # Adiciona image_id logo após texto_referencia
                if key == "texto_referencia":
                    new_question["image_id"] = ""
            
            # Substitui a questão pela versão com image_id
            question.clear()
            question.update(new_question)
            modified += 1
    
    # Salva o arquivo
    with open(PADRAO_FILE, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f"   ✅ {modified} questões modificadas")
    print(f"   ✓ Campo 'image_id' adicionado com sucesso!")

if __name__ == "__main__":
    add_image_id_field()
