import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  BookOpen,
  Search,
  RotateCw,
  FileText,
  BrainCircuit,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Wind,
  Wifi,
  CreditCard,
  Package,
  KeyRound,
  Grid
} from "lucide-react";

import { getKnowledge, rebuildVectorDatabase } from "../services/api";

const CATEGORIES = [
  { id: "all", label: "All Documents", icon: Grid, query: "" },
  { id: "ac", label: "AC & Appliances", icon: Wind, query: "AC not cooling or turning on" },
  { id: "internet", label: "Internet & Wi-Fi", icon: Wifi, query: "Internet connection down router troubleshooting" },
  { id: "billing", label: "Billing & Refunds", icon: CreditCard, query: "Refund policy delayed payment billing dispute" },
  { id: "delivery", label: "Orders & Delivery", icon: Package, query: "Delayed package delivery missing order item" },
  { id: "account", label: "Account & Security", icon: KeyRound, query: "Password reset account locked OTP not coming" }
];

function KnowledgeBase() {
  const { darkMode } = useOutletContext();

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rebuilding, setRebuilding] = useState(false);
  const [rebuildStatus, setRebuildStatus] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const handleSearch = async (queryToSearch = question) => {
    const q = queryToSearch.trim();
    if (!q) {
      setError("Please enter a search topic or question.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await getKnowledge(q);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve knowledge. Please ensure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.id);
    if (cat.query) {
      setQuestion(cat.query);
      handleSearch(cat.query);
    }
  };

  const handleRebuildDB = async () => {
    try {
      setRebuilding(true);
      setRebuildStatus(null);
      const res = await rebuildVectorDatabase();
      setRebuildStatus(res);
    } catch (err) {
      console.error(err);
      setRebuildStatus({ success: false, error: "Failed to rebuild vector database." });
    } finally {
      setRebuilding(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-all duration-300 ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-500" />
            <span>Knowledge Base Hub (RAG)</span>
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Dense semantic vector search across 500+ customer support scenarios and operating guides
          </p>
        </div>

        {/* Rebuild Vector DB Action */}
        <button
          onClick={handleRebuildDB}
          disabled={rebuilding}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-2 transition disabled:opacity-50"
          title="Rebuild Chroma vector database from all PDF documents"
        >
          <RotateCw className={`w-4 h-4 ${rebuilding ? "animate-spin" : ""}`} />
          <span>{rebuilding ? "Indexing PDFs..." : "Rebuild Vector DB"}</span>
        </button>
      </div>

      {/* Rebuild Notification Banner */}
      {rebuildStatus && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-xs transition ${
            rebuildStatus.success
              ? darkMode
                ? "bg-emerald-950/30 border-emerald-800 text-emerald-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
              : darkMode
              ? "bg-red-950/30 border-red-800 text-red-300"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {rebuildStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
            <span>
              {rebuildStatus.success
                ? `Vector DB Rebuilt Successfully! Indexed ${rebuildStatus.total_chunks} chunks across ${rebuildStatus.total_files} PDF files (${rebuildStatus.total_pages} pages).`
                : `Rebuild Error: ${rebuildStatus.error || "Failed to index documents."}`}
            </span>
          </div>

          <button onClick={() => setRebuildStatus(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Console Card */}
      <div
        className={`rounded-2xl border p-6 mb-6 shadow-sm transition-all ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <h2 className="text-base font-bold mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-400" />
          <span>Semantic AI Knowledge Retrieval</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search by symptom, issue, policy (e.g., 'AC making rattling noise', 'Refund timeline', 'Router red light')..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                darkMode
                  ? "bg-slate-950 border-slate-700 text-white placeholder-slate-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Searching Vector DB..." : "Search Knowledge"}</span>
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl text-xs bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Category Filters */}
        <div className="mt-5 pt-4 border-t flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0">
            Browse Category:
          </span>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium shrink-0 flex items-center gap-1.5 transition ${
                  active
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : darkMode
                    ? "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className={`rounded-2xl border p-12 text-center mb-6 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <BrainCircuit className="w-10 h-10 mx-auto text-indigo-500 animate-pulse mb-3" />
          <h3 className="text-base font-bold mb-1">Performing Dense Semantic Vector Search...</h3>
          <p className="text-xs text-slate-400">Embedding query and ranking relevant chunks with HuggingFace MiniLM...</p>
        </div>
      )}

      {/* Search Results Display */}
      {result && !loading && (
        <div className="space-y-6">
          {/* AI Grounded Answer Box */}
          {result.answer && (
            <div
              className={`rounded-2xl border p-6 shadow-sm transition ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                <BrainCircuit className="w-5 h-5 text-indigo-500" />
                <span>AI Knowledge Synthesized Solution</span>
              </div>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                {result.answer}
              </p>
            </div>
          )}

          {/* Retrieved Source Documents */}
          <div
            className={`rounded-2xl border p-6 shadow-sm ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Retrieved Knowledge Chunks ({result.articles?.length || 0})</span>
              </h3>
              <span className="text-xs text-slate-400">Ranked by Cosine Similarity</span>
            </div>

            {result.articles && result.articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.articles.map((article, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedArticle(article)}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition cursor-pointer ${
                      darkMode
                        ? "bg-slate-950/70 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-950"
                        : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-xs font-bold truncate max-w-[170px]" title={article.title}>
                          {article.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shrink-0">
                          {article.score}% Match
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed mb-3">
                        {article.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                      <span>Read full scenario</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No matching documents found for this query in the knowledge base.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div
          className={`rounded-2xl border shadow-sm p-12 text-center ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <BookOpen className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60" />
          <h2 className="text-lg font-bold">Search the Enterprise Knowledge Base</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Type any issue or select a category preset above to explore all 500 customer support scenarios and guidelines.
          </p>
        </div>
      )}

      {/* Article Detail Viewer Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div
            className={`w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col ${
              darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
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
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Semantic Relevance: {selectedArticle.score}%
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
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
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

export default KnowledgeBase;