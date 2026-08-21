import { UserCheck, Tag, Heart, AlertTriangle, Package, Wrench, Clock, HelpCircle, Sparkles, CheckCircle2 } from "lucide-react";

function Badge({ darkMode, type, text }) {
  const colors = {
    red: darkMode ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-red-100 text-red-700 border-red-200",
    blue: darkMode ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-blue-100 text-blue-700 border-blue-200",
    yellow: darkMode ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-amber-100 text-amber-700 border-amber-200",
    green: darkMode ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border-emerald-200",
    purple: darkMode ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-purple-100 text-purple-700 border-purple-200",
    gray: darkMode ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[type] || colors.gray} transition inline-flex items-center gap-1`}>
      {text}
    </span>
  );
}

const getEmotionColor = (emotion) => {
  switch ((emotion || "").toLowerCase()) {
    case "frustration":
    case "anger":
    case "angry":
    case "very frustrated":
      return "red";
    case "urgency":
    case "anxiety":
    case "worried":
    case "impatient":
    case "concerned":
      return "yellow";
    case "happy":
    case "satisfied":
    case "polite":
      return "green";
    case "neutral":
    case "calm":
      return "blue";
    default:
      return "purple";
  }
};

const getIntentColor = (intent) => {
  const value = (intent || "").toLowerCase();
  if (value.includes("technical") || value.includes("internet") || value.includes("support")) return "blue";
  if (value.includes("refund") || value.includes("billing") || value.includes("payment")) return "yellow";
  if (value.includes("delivery") || value.includes("complaint") || value.includes("cancellation")) return "red";
  return "purple";
};

const getSentimentColor = (sentiment) => {
  const value = (sentiment || "").toLowerCase();
  if (value.includes("negative")) return "red";
  if (value.includes("positive")) return "green";
  if (value.includes("neutral")) return "blue";
  return "yellow";
};

const getPriorityColor = (priority) => {
  switch ((priority || "").toLowerCase()) {
    case "critical":
    case "high":
      return "red";
    case "medium":
      return "yellow";
    case "low":
      return "green";
    default:
      return "blue";
  }
};

function CustomerUnderstandingCard({ darkMode, analysis }) {
  const missingInfo = analysis?.missing_information || [];
  const entities = analysis?.entities || {};
  const product = entities.product || (analysis ? "General Service" : "");
  const issue = entities.issue || (analysis ? "Customer Inquiry" : "");
  const duration = entities.duration || (analysis ? "Not specified" : "");

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border transition-all duration-300 ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-1.5">
              <span>Customer Intelligence</span>
            </h2>
            <p className="text-[11px] text-slate-400">Emotion, Intent, Sentiment & Extracted Entities</p>
          </div>
        </div>

        <Badge
          darkMode={darkMode}
          type={analysis ? "green" : "blue"}
          text={analysis ? "Analyzed" : "Ready"}
        />
      </div>

      {!analysis ? (
        <div className={`p-4 rounded-xl border text-center ${darkMode ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
          <Sparkles className="w-6 h-6 mx-auto mb-2 text-indigo-400 animate-pulse" />
          <h4 className="text-xs font-bold mb-1">Customer Understanding Ready</h4>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Click <strong>"Analyze Conversation"</strong> in the chat to instantly extract customer emotions, intents, and product entities.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* 4 Essential Attribute Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[10px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" /> Emotion
              </span>
              <Badge darkMode={darkMode} type={getEmotionColor(analysis.emotion)} text={analysis.emotion || "Calm"} />
            </div>

            <div className={`p-2.5 rounded-xl border ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[10px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-blue-400" /> Intent
              </span>
              <Badge darkMode={darkMode} type={getIntentColor(analysis.intent)} text={analysis.intent || "Inquiry"} />
            </div>

            <div className={`p-2.5 rounded-xl border ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[10px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" /> Sentiment
              </span>
              <Badge darkMode={darkMode} type={getSentimentColor(analysis.sentiment)} text={analysis.sentiment || "Neutral"} />
            </div>

            <div className={`p-2.5 rounded-xl border ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[10px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Priority
              </span>
              <Badge darkMode={darkMode} type={getPriorityColor(analysis.priority)} text={analysis.priority || "Medium"} />
            </div>
          </div>

          {/* Extracted Entities Card */}
          <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/80 border-slate-200"}`}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Extracted Product & Issue Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded-lg border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Package className="w-3 h-3 text-indigo-400" /> Product/Topic:
                </span>
                <span className="font-bold text-indigo-400 truncate block">{product}</span>
              </div>

              <div className={`p-2 rounded-lg border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Wrench className="w-3 h-3 text-amber-400" /> Reported Issue:
                </span>
                <span className="font-bold text-slate-200 truncate block" title={issue}>{issue}</span>
              </div>

              <div className={`p-2 rounded-lg border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Clock className="w-3 h-3 text-purple-400" /> Timeline/Duration:
                </span>
                <span className="font-bold text-purple-400 truncate block">{duration}</span>
              </div>
            </div>
          </div>

          {/* Missing Information Checklist */}
          {missingInfo && missingInfo.length > 0 && (
            <div className={`p-3 rounded-xl border ${darkMode ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Suggested Follow-up Items to Inquire</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingInfo.map((info, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] bg-amber-500/20 border border-amber-500/30 text-amber-200 font-medium">
                    • {info}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerUnderstandingCard;