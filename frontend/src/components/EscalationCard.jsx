import { ShieldAlert, AlertTriangle, CheckCircle2, Zap, AlertCircle } from "lucide-react";

function getRiskConfig(level, score) {
  const normalized = (level || "").toLowerCase();
  if (normalized.includes("critical") || score >= 80) {
    return {
      bg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
      bar: "bg-rose-500",
      pill: "bg-rose-600 text-white",
      label: "Critical Risk",
      icon: AlertCircle
    };
  }
  if (normalized.includes("high") || score >= 60) {
    return {
      bg: "bg-red-500/15 border-red-500/30 text-red-400",
      bar: "bg-red-500",
      pill: "bg-red-600 text-white",
      label: "High Risk",
      icon: AlertTriangle
    };
  }
  if (normalized.includes("medium") || score >= 35) {
    return {
      bg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      bar: "bg-amber-500",
      pill: "bg-amber-600 text-white",
      label: "Medium Risk",
      icon: Zap
    };
  }
  return {
    bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    bar: "bg-emerald-500",
    pill: "bg-emerald-600 text-white",
    label: "Low Risk",
    icon: CheckCircle2
  };
}

function EscalationCard({ darkMode, escalation }) {
  const score = Number(escalation?.risk_score || (escalation?.risk_level?.toLowerCase() === "high" ? 75 : escalation?.risk_level?.toLowerCase() === "medium" ? 45 : 15));
  const config = getRiskConfig(escalation?.risk_level, score);
  const IconComponent = config.icon;

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
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-600 to-red-500 text-white shadow">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Escalation Radar</h2>
            <p className="text-xs text-slate-400">Churn risk & supervisor escalation prevention</p>
          </div>
        </div>

        {escalation && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.pill} shadow-sm`}>
            {config.label}
          </span>
        )}
      </div>

      {!escalation ? (
        <div className="text-center py-8">
          <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-slate-500 animate-pulse" />
          <h3 className="text-sm font-semibold mb-1">Escalation Monitor Active</h3>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Awaiting conversation analysis to measure churn & escalation probability.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Risk Score Progress Bar */}
          <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <IconComponent className="w-3.5 h-3.5" /> Escalation Probability
              </span>
              <span className="text-base font-extrabold">{score}%</span>
            </div>

            <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${config.bar}`}
                style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
              />
            </div>
          </div>

          {/* Trigger Reason */}
          {escalation.reason && (
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/70 border-slate-100"}`}>
              <div className="font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>⚠️</span> Escalation Trigger
              </div>
              <p className={darkMode ? "text-slate-200" : "text-slate-700"}>
                {escalation.reason}
              </p>
            </div>
          )}

          {/* Recommended Action */}
          {escalation.action && (
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${darkMode ? "bg-indigo-950/20 border-indigo-800/40 text-indigo-200" : "bg-indigo-50 border-indigo-100 text-indigo-900"}`}>
              <div className="font-semibold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>🚀</span> Recommended Action
              </div>
              <p>
                {escalation.action}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EscalationCard;