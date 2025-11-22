import React, { useState } from 'react';
import { analyzeText } from '../services/geminiService';
import { TextAnalysis } from '../types';
import { PenTool, Send, Loader2, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react';
import { useToast } from './Toast';

const EssayModule: React.FC = () => {
  const { showToast } = useToast();
  const [theme, setTheme] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<TextAnalysis | null>(null);

  const handleGrade = async () => {
    if (!text.trim() || !theme.trim()) {
      showToast('warning', 'Por favor, preencha o tema e a redação.');
      return;
    }
    setLoading(true);
    try {
      const result = await analyzeText(text, theme);
      setFeedback(result);
      showToast('success', 'Análise concluída com sucesso!');
    } catch (e) {
      console.error('Error analyzing text:', e);
      showToast('error', 'Erro ao corrigir redação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col lg:flex-row gap-6">
      {/* Input Section */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <PenTool className="text-rose-600" />
          Análise de Texto
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tema do Texto</label>
            <input
              type="text"
              placeholder="Ex: A importância da educação técnica no Brasil"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>

          <div className="flex-1 mb-4 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seu Texto</label>
            <textarea
              className="w-full flex-1 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none font-serif text-lg leading-relaxed"
              placeholder="Escreva seu texto dissertativo aqui..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="text-right text-xs text-gray-400 mt-2">
              {text.length} caracteres
            </div>
          </div>

          <button
            onClick={handleGrade}
            disabled={loading || text.length < 100}
            className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Analisando texto...
              </>
            ) : (
              <>
                <Send size={18} /> Enviar para Análise
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div className="w-full lg:w-[500px] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 text-white p-6 text-center">
              <span className="uppercase tracking-wider text-xs font-semibold text-gray-400">Nota</span>
              <div className="text-6xl font-bold mt-2 text-rose-400">{feedback.score}</div>
              <div className="text-sm text-gray-400 mt-1">de 100 pontos</div>
            </div>

            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <BarChart3 size={18} /> Aspectos Avaliados
                </h3>
                <div className="space-y-3">
                  {feedback.aspects.map((aspect, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase">{aspect.name}</span>
                        <span className={`text-sm font-bold ${aspect.score >= 20 ? 'text-green-600' : aspect.score >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {aspect.score}/25
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-snug">{aspect.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Comentário Geral</h3>
                <p className="text-sm text-gray-600 italic border-l-2 border-rose-400 pl-3">
                  "{feedback.generalComment}"
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 text-sm flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} /> Pontos Fortes
                  </h4>
                  <ul className="list-disc list-inside text-xs text-green-700 space-y-1">
                    {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-bold text-amber-800 text-sm flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> Pontos de Melhoria
                  </h4>
                  <ul className="list-disc list-inside text-xs text-amber-700 space-y-1">
                    {feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayModule;