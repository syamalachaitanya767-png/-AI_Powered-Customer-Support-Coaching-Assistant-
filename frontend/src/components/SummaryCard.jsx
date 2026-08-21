import { FileText, CheckCircle2, PhoneCall, Target, Sparkles, Clock } from "lucide-react";

function SummaryCard({ darkMode, summary }) {
  const followUp = typeof summary?.follow_up === "string" ? summary.follow_up.toLowerCase() === "yes" : Boolean(summary?.follow_up);

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
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Session Summary</h2>
            <p className="text-xs text-slate-400">Automated CRM note & action items generation</p>
          </div>
        </div>

        {summary && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Generated
          </span>
        )}
      </div>

      {!summary ? (
        <div className="text-center py-8">
          <FileText className="w-8 h-8 mx-auto mb-2 text-slate-500 animate-pulse" />
          <h3 className="text-sm font-semibold mb-1">Summary Ready</h3>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Analyze the session to automatically compile CRM notes and resolution points.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Summary Text */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
            <div className="font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Overview</span>
            </div>
            <p className={`text-sm ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
              {summary.summary || summary.text || (typeof summary === "string" ? summary : "-")}
            </p>
          </div>

          {/* Issue & Resolution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/70 border-slate-100"}`}>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-medium uppercase tracking-wider">Key Issue</span>
              </div>
              <p className="text-xs font-semibold">{summary.issue || summary.key_issue || "-"}</p>
            </div>

            <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/70 border-slate-100"}`}>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium uppercase tracking-wider">Resolution Status</span>
              </div>
              <p className="text-xs font-semibold">{summary.resolution || summary.action_taken || "-"}</p>
            </div>
          </div>

          {/* Follow-up flag */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" /> Follow-up Required
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              followUp ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
            }`}>
              {followUp ? "Yes (Ticket Scheduled)" : "No (Resolved)"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryCard;