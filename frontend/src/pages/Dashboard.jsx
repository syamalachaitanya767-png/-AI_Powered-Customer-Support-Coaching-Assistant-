import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  MessageSquare,
  TrendingUp,
  BookOpen,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCw,
  Wind,
  Wifi,
  CreditCard,
  Package
} from "lucide-react";
import { getSessions, getSystemStatus } from "../services/api";

function Dashboard() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [systemInfo, setSystemInfo] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [sessionsData, statusData] = await Promise.allSettled([
        getSessions(),
        getSystemStatus()
      ]);

      if (sessionsData.status === "fulfilled") {
        setSessions(Array.isArray(sessionsData.value) ? sessionsData.value : []);
      }

      if (statusData.status === "fulfilled") {
        setSystemInfo(statusData.value);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute Metrics
  const totalSessions = sessions.length;
  
  let highRiskCount = 0;
  let positiveCount = 0;

  sessions.forEach((s) => {
    const res = s.result || {};
    const esc = res.escalation || {};
    const ana = res.analysis || {};

    if ((esc.risk_level || "").toLowerCase() === "high" || (esc.risk_level || "").toLowerCase() === "critical") {
      highRiskCount++;
    }
    if ((ana.sentiment || "").toLowerCase().includes("positive")) {
      positiveCount++;
    }
  });

  const escalationRate = totalSessions > 0 ? Math.round((highRiskCount / totalSessions) * 100) : 0;
  const positiveRate = totalSessions > 0 ? Math.round((positiveCount / totalSessions) * 100) : 0;

  const recentSessions = sessions.slice(0, 5);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const cardBg = darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Executive AI Copilot Dashboard</h1>
          <p className={`mt-1 text-sm ${secondaryText}`}>
            Enterprise multi-agent coaching metrics, live sessions & knowledge health
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
            darkMode ? "bg-slate-900 hover:bg-slate-800 border-slate-700 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="mb-8 rounded-3xl p-6 md:p-8 border border-indigo-500/30 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Agent Live Intelligence Active</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              AI Customer Support Copilot & Coaching Platform
            </h2>
            <p className="mt-2 text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
              Empowering customer support teams with real-time intent analysis, automated 500-scenario RAG grounding, proactive churn prevention, and live coaching feedback.
            </p>
          </div>

          <button
            onClick={() => navigate("/new-session")}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <span>Launch Live Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {/* Metric 1 */}
        <div className={`rounded-2xl border p-5 ${cardBg} shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${secondaryText}`}>Total Support Sessions</p>
              <h2 className="text-3xl font-extrabold mt-2">{loading ? "..." : totalSessions}</h2>
              <p className="text-xs text-indigo-400 mt-2 font-medium">Logged in session database</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`rounded-2xl border p-5 ${cardBg} shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${secondaryText}`}>Escalation Risk Rate</p>
              <h2 className="text-3xl font-extrabold mt-2 text-amber-500">{loading ? "..." : `${escalationRate}%`}</h2>
              <p className="text-xs text-amber-400 mt-2 font-medium">{highRiskCount} High/Critical sessions</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`rounded-2xl border p-5 ${cardBg} shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${secondaryText}`}>Positive Sentiment</p>
              <h2 className="text-3xl font-extrabold mt-2 text-emerald-500">{loading ? "..." : `${positiveRate}%`}</h2>
              <p className="text-xs text-emerald-400 mt-2 font-medium">Customer satisfaction ratio</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`rounded-2xl border p-5 ${cardBg} shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${secondaryText}`}>RAG Knowledge Base</p>
              <h2 className="text-3xl font-extrabold mt-2 text-purple-500">{systemInfo?.vector_chunks || "Active"}</h2>
              <p className="text-xs text-purple-400 mt-2 font-medium">500+ indexed scenarios & FAQs</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Training Scenarios Launcher */}
      <div className={`rounded-2xl border p-6 mb-8 ${cardBg} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Interactive Roleplay Training Scenarios</span>
            </h2>
            <p className={`text-xs mt-0.5 ${secondaryText}`}>
              Launch realistic roleplay simulation scenarios to practice AI-assisted live coaching
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate("/new-session")}
            className={`p-4 rounded-xl border flex flex-col justify-between transition cursor-pointer ${
              darkMode ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500 hover:bg-slate-950" : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20"
            }`}
          >
            <div>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 w-fit mb-3">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">AC Hardware Issue</h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                "AC not cooling, blowing warm air and rattling"
              </p>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-indigo-400 font-semibold">
              <span>Start Roleplay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate("/new-session")}
            className={`p-4 rounded-xl border flex flex-col justify-between transition cursor-pointer ${
              darkMode ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500 hover:bg-slate-950" : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20"
            }`}
          >
            <div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-3">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Broadband Wi-Fi Outage</h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                "Router red light flashing, no internet for work"
              </p>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Start Roleplay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate("/new-session")}
            className={`p-4 rounded-xl border flex flex-col justify-between transition cursor-pointer ${
              darkMode ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500 hover:bg-slate-950" : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20"
            }`}
          >
            <div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Refund & Double Charge</h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                "Card charged twice for same order, refund pending"
              </p>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-amber-400 font-semibold">
              <span>Start Roleplay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate("/new-session")}
            className={`p-4 rounded-xl border flex flex-col justify-between transition cursor-pointer ${
              darkMode ? "bg-slate-950/60 border-slate-800 hover:border-indigo-500 hover:bg-slate-950" : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20"
            }`}
          >
            <div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-3">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Delayed Delivery</h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                "Package delayed 5 days past promised date"
              </p>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-purple-400 font-semibold">
              <span>Start Roleplay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className={`rounded-2xl border p-6 ${cardBg} shadow-sm`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Recent Coaching Sessions</span>
            </h2>
            <p className={`text-xs mt-0.5 ${secondaryText}`}>
              Latest multi-agent sessions and coaching logs
            </p>
          </div>

          <button
            onClick={() => navigate("/reports")}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentSessions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No support sessions recorded yet. Launch a Live Session to begin.
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session) => {
              const res = session.result || {};
              const analysis = res.analysis || {};
              const escalation = res.escalation || {};
              const coaching = res.coaching || {};

              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                    darkMode ? "bg-slate-950/60 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      #{session.id}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold">{analysis.intent || "Customer Support"}</span>
                        {analysis.sentiment && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            analysis.sentiment.toLowerCase().includes("positive") ? "bg-emerald-500/20 text-emerald-400" : analysis.sentiment.toLowerCase().includes("negative") ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {analysis.sentiment}
                          </span>
                        )}
                        {escalation.risk_level && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            escalation.risk_level.toLowerCase().includes("high") || escalation.risk_level.toLowerCase().includes("critical") ? "bg-rose-500/20 text-rose-400" : "bg-slate-800 text-slate-400"
                          }`}>
                            Risk: {escalation.risk_level}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 truncate max-w-xl">
                        "{session.customer_message}"
                      </p>

                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {formatDate(session.created_at)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/reports")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shrink-0 self-start md:self-center transition"
                  >
                    View Audit
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;