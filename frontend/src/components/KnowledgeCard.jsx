import { useState } from "react";
import { BookOpen, FileText, BrainCircuit, ExternalLink, X, ChevronRight, CheckCircle2 } from "lucide-react";

function KnowledgeCard({ darkMode, articles, answer }) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div
      className={`rounded-2xl p-6 shadow-md border transition-all duration-300 ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Knowledge Retrieval (RAG)</h2>
            <p className="text-xs text-slate-400">Grounded in 500+ verified scenarios & policies</p>
          </div>
        </div>

        {articles && articles.length > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {articles.length} Source Documents
          </span>
        )}
      </div>

      {/* AI Grounded Answer Box */}
      {answer && (
        <div
          className={`rounded-xl p-4 mb-5 border transition-all ${
            darkMode
              ? "bg-purple-950/20 border-purple-800/40 text-purple-200"
              : "bg-purple-50/70 border-purple-200 text-purple-900"
          }`}
        >
          <div className="flex items-center gap-2 mb-2 font-semibold text-xs text-purple-400 uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4" />
            <span>AI Synthesized Knowledge Solution</span>
          </div>
          <p className="text-sm leading-relaxed font-normal">{answer}</p>
        </div>
      )}

      {/* Retrieved Documents List */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Retrieved Knowledge Sources
        </h3>

        {articles && articles.length > 0 ? (
          <div className="space-y-3">
            {articles.map((article, index) => (
              <div
                key={index}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  darkMode
                    ? "bg-slate-950/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-950"
                    : "bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50/20"
                }`}
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2 font-semibold text-xs truncate max-w-[220px]">
                    <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{article.title}</span>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {article.score}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {article.content}
                </p>

                <div className="mt-2 flex items-center justify-end text-[11px] text-purple-400 font-medium hover:underline">
                  <span>View full excerpt</span>
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            Awaiting conversation to search the 500-scenario vector database.
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div
            className={`w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col ${
              darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base">{selectedArticle.title}</h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  Match Relevance: {selectedArticle.score}%
                </span>
              </div>

              <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                darkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-800"
              }`}>
                {selectedArticle.content}
              </div>
            </div>

            <div className="px-6 py-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Close Excerpt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KnowledgeCard;