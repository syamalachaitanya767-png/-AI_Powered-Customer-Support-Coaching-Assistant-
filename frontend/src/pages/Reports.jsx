import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FileText,
  Search,
  Download,
  Trash2,
  Eye,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  BookOpen,
  User,
  Clock,
  RotateCw,
  X,
  FileJson,
  FileSpreadsheet,
  Printer
} from "lucide-react";

import {
  getSessions,
  getSession,
  deleteSession,
} from "../services/api";

function Reports() {
  const { darkMode } = useOutletContext();

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSessions();
      if (Array.isArray(data)) {
        setSessions(data);
      } else if (Array.isArray(data?.sessions)) {
        setSessions(data.sessions);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error("Load sessions error:", err);
      setError("Failed to load saved sessions.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleView = async (id) => {
    try {
      const data = await getSession(id);
      setSelectedSession(data);
    } catch (err) {
      console.error("View session error:", err);
      alert("Failed to load session details.");
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this session audit?");
    if (!confirmed) return;

    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSession?.id === id) {
        setSelectedSession(null);
      }
    } catch (err) {
      console.error("Delete session error:", err);
      alert("Failed to delete session.");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (sessions.length === 0) return;

    const headers = ["ID", "Timestamp", "Customer Message", "Sentiment", "Urgency", "Intent", "Risk Level", "Coaching Suggestion"];
    const rows = sessions.map((s) => {
      const res = s.result || {};
      const ana = res.analysis || {};
      const esc = res.escalation || {};
      const coach = res.coaching || {};

      return [
        s.id,
        `"${s.created_at || ""}"`,
        `"${(s.customer_message || "").replace(/"/g, '""')}"`,
        `"${ana.sentiment || ""}"`,
        `"${ana.urgency || ""}"`,
        `"${ana.intent || ""}"`,
        `"${esc.risk_level || ""}"`,
        `"${(coach.suggestion || "").replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_support_audit_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (sessions.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(sessions, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `customer_support_audit_report_${Date.now()}.json`;
    link.click();
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    const res = s.result || {};
    const ana = res.analysis || {};
    const esc = res.escalation || {};

    const matchesSearch =
      (s.customer_message || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ana.intent || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSentiment =
      sentimentFilter === "all" ||
      (ana.sentiment || "").toLowerCase().includes(sentimentFilter.toLowerCase());

    const matchesRisk =
      riskFilter === "all" ||
      (esc.risk_level || "").toLowerCase().includes(riskFilter.toLowerCase());

    return matchesSearch && matchesSentiment && matchesRisk;
  });

  const cardBg = darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"}`}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-500" />
            <span>Audit & Compliance Reports</span>
          </h1>
          <p className={`text-sm mt-1 ${secondaryText}`}>
            Historical audit logs of customer interactions, coaching interventions & compliance records
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            disabled={sessions.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
            title="Download CSV report"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={sessions.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
            title="Download JSON audit log"
          >
            <FileJson className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={loadSessions}
            disabled={loading}
            className={`p-2 rounded-xl border text-xs font-semibold transition ${
              darkMode ? "bg-slate-900 hover:bg-slate-800 border-slate-700 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
            }`}
            title="Refresh list"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className={`rounded-2xl border p-4 mb-6 ${cardBg} shadow-sm flex flex-col md:flex-row items-center gap-3`}>
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer message or intent..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
              darkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
            }`}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none ${
              darkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-800"
            }`}
          >
            <option value="all">All Sentiments</option>
            <option value="pos">Positive</option>
            <option value="neu">Neutral</option>
            <option value="neg">Negative</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none ${
              darkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-800"
            }`}
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="med">Medium Risk</option>
            <option value="high">High / Critical</option>
          </select>
        </div>
      </div>

      {/* Sessions Grid / Table */}
      {loading ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading customer support audit logs...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBg}`}>
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold">No matching support sessions found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search filters or start a new live session.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredSessions.map((session) => {
            const res = session.result || {};
            const ana = res.analysis || {};
            const esc = res.escalation || {};
            const coach = res.coaching || {};

            return (
              <div
                key={session.id}
                onClick={() => handleView(session.id)}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition cursor-pointer ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900/90"
                    : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    #{session.id}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold">{ana.intent || "Customer Inquiry"}</span>
                      {ana.sentiment && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ana.sentiment.toLowerCase().includes("pos")
                            ? "bg-emerald-500/20 text-emerald-400"
                            : ana.sentiment.toLowerCase().includes("neg")
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {ana.sentiment}
                        </span>
                      )}
                      {esc.risk_level && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          esc.risk_level.toLowerCase().includes("high") || esc.risk_level.toLowerCase().includes("crit")
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-slate-800 text-slate-400"
                        }`}>
                          Risk: {esc.risk_level}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 truncate max-w-2xl">
                      "{session.customer_message}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.created_at ? new Date(session.created_at).toLocaleString() : "Recent"}
                      </span>
                      {coach.suggestion && (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> AI Coached
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <button
                    onClick={() => handleView(session.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Audit</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(session.id, e)}
                    className="p-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Audit Inspection Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={`w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col ${cardBg}`}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-950/40">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base">Session Audit Inspection #{selectedSession.id}</h3>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Customer Inquiry */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Original Customer Message</h4>
                <div className={`p-4 rounded-xl text-xs leading-relaxed ${darkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-800"}`}>
                  "{selectedSession.customer_message}"
                </div>
              </div>

              {/* Analysis & Empathy */}
              {selectedSession.result?.analysis && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Customer Understanding</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Sentiment</span>
                      <span className="font-bold text-emerald-400">{selectedSession.result.analysis.sentiment || "Neutral"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Urgency</span>
                      <span className="font-bold text-amber-400">{selectedSession.result.analysis.urgency || "Medium"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Primary Intent</span>
                      <span className="font-bold">{selectedSession.result.analysis.intent || "General"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Risk Level</span>
                      <span className="font-bold text-rose-400">{selectedSession.result?.escalation?.risk_level || "Low"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Coaching Suggestion */}
              {selectedSession.result?.coaching?.suggestion && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Coaching Recommendation Delivered</span>
                  </h4>
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-200 text-xs leading-relaxed">
                    {selectedSession.result.coaching.suggestion}
                  </div>
                </div>
              )}

              {/* Raw JSON Data Accordion */}
              <details className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <summary className="px-4 py-2.5 bg-slate-950/80 cursor-pointer font-semibold text-slate-400 hover:text-white">
                  Inspect Raw Multi-Agent JSON Output
                </summary>
                <pre className="p-4 bg-slate-950 text-emerald-400 overflow-x-auto text-[11px] max-h-48 leading-relaxed">
                  {JSON.stringify(selectedSession.result, null, 2)}
                </pre>
              </details>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t flex justify-end gap-2 bg-slate-950/40">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;