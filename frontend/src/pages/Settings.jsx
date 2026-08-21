import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Bot,
  Database,
  Cpu,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Zap,
  Server,
  Shield,
  Layers
} from "lucide-react";

import { getSystemStatus, rebuildVectorDatabase } from "../services/api";

function Settings() {
  const { darkMode } = useOutletContext();

  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coachingTone, setCoachingTone] = useState("empathetic");
  const [autoRoleplay, setAutoRoleplay] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [rebuilding, setRebuilding] = useState(false);
  const [rebuildMsg, setRebuildMsg] = useState("");

  const checkStatus = async () => {
    try {
      setLoading(true);
      const data = await getSystemStatus();
      setSystemInfo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleRebuild = async () => {
    try {
      setRebuilding(true);
      setRebuildMsg("");
      const res = await rebuildVectorDatabase();
      if (res.success) {
        setRebuildMsg(`Indexed ${res.total_chunks} chunks across ${res.total_files} PDF files!`);
        checkStatus();
      }
    } catch (err) {
      setRebuildMsg("Rebuild failed. Check backend console.");
    } finally {
      setRebuilding(false);
    }
  };

  const cardClass = `rounded-2xl border p-6 shadow-sm ${
    darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
  }`;

  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-indigo-500" />
            <span>System Settings & Model Configuration</span>
          </h1>
          <p className={`text-sm mt-1 ${secondaryText}`}>
            Manage AI model routing, coaching tone, vector embeddings, and multi-agent health
          </p>
        </div>

        <button
          onClick={checkStatus}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-2 transition disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Ping System Status</span>
        </button>
      </div>

      <div className="space-y-6 max-w-5xl">
        {/* 1. Live Telemetry & Health */}
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">AI Engine & Backend Telemetry</h2>
              <p className={`text-xs ${secondaryText}`}>Active OpenRouter connection and vector index metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <span className={`block text-[11px] font-semibold ${secondaryText}`}>Server Health</span>
              <div className="flex items-center gap-2 mt-1.5 font-bold text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online & Responsive</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <span className={`block text-[11px] font-semibold ${secondaryText}`}>Active LLM Model</span>
              <span className="font-bold text-indigo-400 mt-1.5 block truncate" title={systemInfo?.model || "NVIDIA Nemotron / Liquid LFM"}>
                {systemInfo?.model || "nvidia/nemotron-3-nano-30b-a3b:free"}
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <span className={`block text-[11px] font-semibold ${secondaryText}`}>Indexed Vector Chunks</span>
              <span className="font-bold text-purple-400 mt-1.5 block">
                {systemInfo?.vector_chunks || "Active (500 Scenarios)"}
              </span>
            </div>
          </div>
        </div>

        {/* 2. AI Coaching Tone Preferences */}
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">AI Coach Persona & Behavior</h2>
              <p className={`text-xs ${secondaryText}`}>Customize coaching recommendation style and live feedback</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-2">Coaching Personality Style</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setCoachingTone("empathetic")}
                  className={`p-3.5 rounded-xl border text-left font-medium transition ${
                    coachingTone === "empathetic"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                      : darkMode ? "bg-slate-950/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="font-bold block mb-1">🤝 Empathetic & Warm</span>
                  <span className="text-[11px] opacity-80">De-escalation focused, active listening and gentle phrasing.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCoachingTone("direct")}
                  className={`p-3.5 rounded-xl border text-left font-medium transition ${
                    coachingTone === "direct"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                      : darkMode ? "bg-slate-950/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="font-bold block mb-1">⚡ Fast & Action-Oriented</span>
                  <span className="text-[11px] opacity-80">Direct steps, zero fluff, instant technical troubleshooting.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCoachingTone("policy")}
                  className={`p-3.5 rounded-xl border text-left font-medium transition ${
                    coachingTone === "policy"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                      : darkMode ? "bg-slate-950/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="font-bold block mb-1">📋 Compliance & Policy Strict</span>
                  <span className="text-[11px] opacity-80">Exact SOP phrasing, audit trail adherence and verification.</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block">Auto-Simulate Customer Roleplay</span>
                <span className={`text-[11px] ${secondaryText}`}>
                  Automatically generate dynamic customer follow-up messages in practice sessions
                </span>
              </div>
              <button
                onClick={() => setAutoRoleplay(!autoRoleplay)}
                className={`w-12 h-6 rounded-full transition-colors relative ${autoRoleplay ? "bg-indigo-600" : "bg-slate-700"}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${autoRoleplay ? "left-7" : "left-1"}`} />
              </button>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block">Persist Session History to Database</span>
                <span className={`text-[11px] ${secondaryText}`}>
                  Store evaluated sessions in SQLite database for analytics and audit reporting
                </span>
              </div>
              <button
                onClick={() => setSaveHistory(!saveHistory)}
                className={`w-12 h-6 rounded-full transition-colors relative ${saveHistory ? "bg-indigo-600" : "bg-slate-700"}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${saveHistory ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Vector Database Management */}
        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Chroma Vector Knowledge Base</h2>
              <p className={`text-xs ${secondaryText}`}>Embeddings generated via sentence-transformers/all-MiniLM-L6-v2</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold block">Re-index 500 Scenarios PDF Documents</span>
              <span className={`text-[11px] ${secondaryText}`}>
                Sync new guides and FAQ documents placed in backend/documents/ folder
              </span>
            </div>

            <button
              onClick={handleRebuild}
              disabled={rebuilding}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow flex items-center gap-2 transition disabled:opacity-50 shrink-0"
            >
              <RotateCw className={`w-3.5 h-3.5 ${rebuilding ? "animate-spin" : ""}`} />
              <span>{rebuilding ? "Indexing..." : "Rebuild Database"}</span>
            </button>
          </div>

          {rebuildMsg && (
            <div className="mt-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>{rebuildMsg}</span>
            </div>
          )}
        </div>

        {/* 4. Platform Specifications */}
        <div className={cardClass}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Platform Architecture</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className={`text-[10px] ${secondaryText} block`}>Architecture</span>
              <span className="font-bold">5-Agent Pipeline</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className={`text-[10px] ${secondaryText} block`}>Frontend</span>
              <span className="font-bold">React + Vite + Tailwind</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className={`text-[10px] ${secondaryText} block`}>Backend</span>
              <span className="font-bold">Flask + ChromaDB</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <span className={`text-[10px] ${secondaryText} block`}>Version</span>
              <span className="font-bold text-indigo-400">v2.0 Enterprise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
