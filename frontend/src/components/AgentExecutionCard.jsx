import { Cpu, CheckCircle2, Layers, Activity } from "lucide-react";

function AgentExecutionCard({ darkMode, execution, className = "" }) {
  const agents = execution
    ? Object.entries(execution)
    : [
        ["Customer Understanding Agent", "Standby"],
        ["Knowledge Agent (RAG)", "Standby"],
        ["Escalation Risk Agent", "Standby"],
        ["AI Coaching Agent", "Standby"],
        ["Summary Agent", "Standby"]
      ];

  const isExecuted = Boolean(execution);

  return (
    <div
      className={`rounded-2xl p-6 shadow-md border transition-all duration-300 flex flex-col ${className} ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white shadow">
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Multi-Agent Pipeline</h2>
            <p className="text-xs text-slate-400">Parallel agent orchestration status</p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          isExecuted ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-400"
        }`}>
          {isExecuted ? "5/5 Completed" : "Ready"}
        </span>
      </div>

      <div className="space-y-2.5">
        {agents.map(([name, status], idx) => {
          const completed = status.toLowerCase() === "completed";
          return (
            <div
              key={name}
              className={`p-3 rounded-xl border flex items-center justify-between transition ${
                darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                <span className="text-xs font-semibold">{name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-500">Completed</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-medium text-slate-500">{status}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AgentExecutionCard;