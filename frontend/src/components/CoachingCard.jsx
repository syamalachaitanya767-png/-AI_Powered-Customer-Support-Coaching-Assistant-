import { useState } from "react";
import { Sparkles, Copy, Check, ArrowDownLeft, ShieldCheck, HeartHandshake } from "lucide-react";

function CoachingCard({ darkMode, suggestion, onApply }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!suggestion) return;
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl p-6 shadow-md border transition-all duration-300 ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              AI Coaching Suggestion
            </h2>
            <p className="text-xs text-slate-400">
              Live empathetic coaching & response guidance
            </p>
          </div>
        </div>

        {suggestion && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                darkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              title="Copy suggestion"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>

            {onApply && (
              <button
                onClick={() => onApply(suggestion)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Apply to Box
              </button>
            )}
          </div>
        )}
      </div>

      {/* Suggestion Content */}
      <div
        className={`rounded-xl p-4 border transition-all ${
          darkMode
            ? "bg-slate-950/60 border-slate-800"
            : "bg-emerald-50/40 border-emerald-100"
        }`}
      >
        {suggestion ? (
          <div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 mt-1">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1.5">
                  Recommended Phrasing
                </div>
                <div
                  className={`leading-relaxed text-sm whitespace-pre-wrap font-normal ${
                    darkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {suggestion}
                </div>
              </div>
            </div>

            <div
              className={`mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${
                darkMode ? "border-slate-800 text-slate-400" : "border-emerald-100 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Policy Compliant & Empathetic</span>
              </div>
              <span className="text-slate-500">Visible only to support agent</span>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-500 animate-pulse" />
            <h3 className="text-sm font-semibold mb-1">AI Coach Ready</h3>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Click <span className="text-indigo-400 font-semibold">Analyze Conversation</span> to generate real-time coaching assistance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoachingCard;