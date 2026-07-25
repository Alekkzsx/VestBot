import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare const katex: any;

@Pipe({
    name: 'latex',
    standalone: true
})
export class LatexPipe implements PipeTransform {
    private sanitizer = inject(DomSanitizer);

    transform(value: string | null | undefined): SafeHtml {
        if (!value) return '';

        let text = value;

        // 1. Proteger marcadores de moeda (R$, US$) para não serem interpretados como delimitadores do KaTeX $...$
        const RS_MARKER = '___CURRENCY_RS___';
        const USS_MARKER = '___CURRENCY_USS___';

        text = text.replace(/R\$/g, RS_MARKER);
        text = text.replace(/US\$/g, USS_MARKER);
        text = text.replace(/r\$/g, RS_MARKER);
        text = text.replace(/us\$/g, USS_MARKER);

        // 2. Escapar HTML para evitar XSS
        let processed = this.escapeHtml(text);

        // 3. Processar blocos de fórmula LaTeX $...$
        const latexRegex = /\$([^$]+)\$/g;

        if (typeof katex === 'undefined') {
            // KaTeX ainda não carregado: substituição simples de símbolos matemáticos
            processed = processed.replace(latexRegex, (_match: string, latex: string) => {
                if (this.isPlainText(latex)) {
                    return `$${latex}$`;
                }
                return this.fallbackCleanLatex(latex);
            });
        } else {
            // KaTeX disponível: renderiza fórmulas
            processed = processed.replace(latexRegex, (_match: string, latex: string) => {
                if (this.isPlainText(latex)) {
                    return `$${latex}$`;
                }

                try {
                    let unescapedLatex = latex
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"');

                    // Corrigir % não escapado dentro do LaTeX (para não ser tratado como comentário no KaTeX)
                    unescapedLatex = unescapedLatex.replace(/(?<!\\)%/g, '\\%');

                    return katex.renderToString(unescapedLatex, {
                        throwOnError: false,
                        displayMode: false,
                        output: 'html'
                    });
                } catch (e) {
                    return latex;
                }
            });
        }

        // 4. Restaurar marcadores de moeda R$ e US$
        processed = processed
            .replace(new RegExp(RS_MARKER, 'g'), 'R$')
            .replace(new RegExp(USS_MARKER, 'g'), 'US$');

        return this.sanitizer.bypassSecurityTrustHtml(processed);
    }

    private isPlainText(content: string): boolean {
        // Se o conteúdo tiver palavras com espaço e nenhum símbolo matemático ou comando LaTeX, é texto comum
        const hasSpaceAndWords = /\s[a-zA-ZáàâãéèêíïóôõöúçÑñ]{3,}\s/.test(content);
        const hasMathOrLatex = /[\\^_{}=+<>/\u0370-\u03FF]/.test(content);
        return hasSpaceAndWords && !hasMathOrLatex;
    }

    private fallbackCleanLatex(latex: string): string {
        return latex
            .replace(/\\cdot/g, '·')
            .replace(/\\times/g, '×')
            .replace(/\\to/g, '→')
            .replace(/\\Delta/g, 'Δ')
            .replace(/\\approx/g, '≈')
            .replace(/\\pi/g, 'π')
            .replace(/\\leq/g, '≤')
            .replace(/\\geq/g, '≥')
            .replace(/\\neq/g, '≠')
            .replace(/\\,/g, ' ')
            .replace(/_\{([^}]+)\}/g, '$1')
            .replace(/_([a-zA-Z0-9])/g, '$1')
            .replace(/\^{([^}]+)}/g, '$1')
            .replace(/\^([a-zA-Z0-9])/g, '$1')
            .replace(/\\\\/g, '');
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}
