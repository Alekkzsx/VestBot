import json
import re

with open('/home/alekkzsx/Documentos/GitHub/VestBot/questions/Questões-Simulado.json', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix syntax errors: replace multiple adjacent `]` and `[` with `,`
# This handles matching like `]\n[\n`, `]\n\n[`, `][` anywhere in the file.
text = re.sub(r'\]\s*\[', ',', text)

try:
    data = json.loads(text)
    
    # Check subjects
    for q in data:
        m = q.get('materia', '')
        if m == 'Ciências - Química':
            q['materia'] = 'Ciências — Química'
        elif m == 'Ciências':
            t = (q.get('tema', '') + ' ' + q.get('enunciado', '') + ' ' + q.get('texto_referencia', '')).lower()
            if 'fotossíntese' in t or 'célula' in t or 'biologia' in t or 'organela' in t or 'mitocôndria' in t or 'ecossistema' in t:
                q['materia'] = 'Ciências — Biologia'
            elif 'química' in t or 'substância' in t or 'carbono' in t or 'oxigênio' in t or 'efeito estufa' in t or 'hélio' in t or 'hidrogênio' in t:
                q['materia'] = 'Ciências — Química'
            elif 'física' in t or 'cinética' in t or 'calor' in t or 'energia' in t or 'movimento' in t:
                q['materia'] = 'Ciências — Física'
            else:
                q['materia'] = 'Ciências — Biologia'
                
    with open('/home/alekkzsx/Documentos/GitHub/VestBot/questions/Questões-Simulado.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("DONE_SUCCESS")

except Exception as e:
    print(f"FAILED: {e}")

