import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  HeartHandshake,
  Clock,
  AlertTriangle,
  RotateCw,
  Award,
  CheckCircle2,
  PieChart
} from "lucide-react";

import { getSessions, getSession } from "../services/api";

function Analytics() {
  const { darkMode } = useOutletContext();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const sessionList = await getSessions();
      if (!Array.isArray(sessionList)) {
        throw new Error("Invalid sessions response");
      }

      // If backend sessions list already contains .result, use it directly to save round-trips
      const completeSessions = sessionList.map((s) => ({
        ...s,
        result: s.result || {}
      }));

      const totalSessions = completeSessions.length;

      const sentiment = { Positive: 0, Neutral: 0, Negative: 0 };
      const urgency = { Low: 0, Medium: 0, High: 0 };
      const risk = { Low: 0, Medium: 0, High: 0, Critical: 0 };
      const intents = {};
      const issues = {};

      let coachingAvailable = 0;
      let followUpRequired = 0;
      const trendMap = {};

      completeSessions.forEach((session) => {
        const result = session?.result || {};
        const analysis = result?.analysis || {};
        const escalation = result?.escalation || {};
        const coaching = result?.coaching || {};
        const summary = result?.summary || {};

        // Sentiment
        if (analysis.sentiment) {
          const raw = analysis.sentiment.toLowerCase();
          if (raw.includes("pos")) sentiment.Positive++;
          else if (raw.includes("neg")) sentiment.Negative++;
          else sentiment.Neutral++;
        }

        // Urgency
        if (analysis.urgency) {
          const raw = analysis.urgency.toLowerCase();
          if (raw.includes("high")) urgency.High++;
          else if (raw.includes("med")) urgency.Medium++;
          else urgency.Low++;
        }

        // Risk
        if (escalation.risk_level) {
          const raw = escalation.risk_level.toLowerCase();
          if (raw.includes("crit")) risk.Critical++;
          else if (raw.includes("high")) risk.High++;
          else if (raw.includes("med")) risk.Medium++;
          else risk.Low++;
        }

        // Intent
        if (analysis.intent) {
          const intent = analysis.intent;
          intents[intent] = (intents[intent] || 0) + 1;
        }

        // Issue entity
        if (analysis.entities?.issue) {
          const issue = analysis.entities.issue;
          issues[issue] = (issues[issue] || 0) + 1;
        }

        // Coaching
        if (coaching.suggestion && coaching.suggestion.trim() !== "") {
          coachingAvailable++;
        }

        // Follow-up
        if (
          summary.follow_up_required === true ||
          summary.follow_up_required === "Yes" ||
          summary.follow_up_required === "yes"
        ) {
          followUpRequired++;
        }

        // Trend
        if (session.created_at) {
          const date = new Date(session.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          trendMap[date] = (trendMap[date] || 0) + 1;
        }
      });

      const topIssues = Object.entries(issues)
        .map(([issue, count]) => ({ issue, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      const topIntents = Object.entries(intents)
        .map(([intent, count]) => ({ intent, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      const sessionTrends = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

      setAnalytics({
        totalSessions,
        sentiment,
        urgency,
        risk,
        topIntents,
        topIssues,
        sessionTrends,
        coachingAvailable,
        followUpRequired,
      });
    } catch (err) {
      console.error("Analytics error:", err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const percentage = (value) => {
    if (!analytics?.totalSessions) return 0;
    return Math.round((value / analytics.totalSessions) * 100);
  };

  const cardBg = darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const secondaryText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            <span>AI Quality & Performance Analytics</span>
          </h1>
          <p className={`text-sm mt-1 ${secondaryText}`}>
            Deep metrics on customer sentiment, escalation risks, intent drivers, and agent coaching adherence
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
            darkMode ? "bg-slate-900 hover:bg-slate-800 border-slate-700 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {loading && (
        <div className={`rounded-2xl border p-12 text-center mb-6 ${cardBg}`}>
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Computing real-time analytics across all logged customer sessions...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {analytics && !loading && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Analyzed */}
            <div className={`rounded-2xl border p-5 ${cardBg} shadow-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${secondaryText}`}>Total Analyzed</span>
                  <h3 className="text-3xl font-black mt-1">{analytics.totalSessions}</h3>
                  <p className="text-[11px] text-indigo-400 mt-2 font-medium">100% evaluated by 5 agents</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Satisfaction Rate */}
            <div className={`rounded-2xl border p-5 ${cardBg} shadow-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${secondaryText}`}>Positive Sentiment</span>
                  <h3 className="text-3xl font-black mt-1 text-emerald-500">
                    {percentage(analytics.sentiment.Positive)}%
                  </h3>
                  <p className="text-[11px] text-emerald-400 mt-2 font-medium">{analytics.sentiment.Positive} Happy / Satisfied</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <HeartHandshake className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* High / Critical Risk */}
            <div className={`rounded-2xl border p-5 ${cardBg} shadow-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${secondaryText}`}>Escalation Risk</span>
                  <h3 className="text-3xl font-black mt-1 text-rose-500">
                    {percentage(analytics.risk.High + analytics.risk.Critical)}%
                  </h3>
                  <p className="text-[11px] text-rose-400 mt-2 font-medium">
                    {analytics.risk.High + analytics.risk.Critical} Urgent intervention tickets
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Coaching Coverage */}
            <div className={`rounded-2xl border p-5 ${cardBg} shadow-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${secondaryText}`}>Coaching Yield</span>
                  <h3 className="text-3xl font-black mt-1 text-purple-500">
                    {percentage(analytics.coachingAvailable)}%
                  </h3>
                  <p className="text-[11px] text-purple-400 mt-2 font-medium">Real-time guidance delivered</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Visual Distribution Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Breakdown */}
            <div className={`rounded-2xl border p-6 ${cardBg} shadow-sm`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                <span>Customer Sentiment Distribution</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-emerald-400">😊 Positive ({analytics.sentiment.Positive})</span>
                    <span>{percentage(analytics.sentiment.Positive)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage(analytics.sentiment.Positive)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-blue-400">😐 Neutral ({analytics.sentiment.Neutral})</span>
                    <span>{percentage(analytics.sentiment.Neutral)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage(analytics.sentiment.Neutral)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-rose-400">😡 Negative / Frustrated ({analytics.sentiment.Negative})</span>
                    <span>{percentage(analytics.sentiment.Negative)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage(analytics.sentiment.Negative)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk & Escalation Matrix */}
            <div className={`rounded-2xl border p-6 ${cardBg} shadow-sm`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Escalation Risk Severity Matrix</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-emerald-400">🟢 Low Risk ({analytics.risk.Low})</span>
                    <span>{percentage(analytics.risk.Low)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage(analytics.risk.Low)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-amber-400">🟡 Medium Risk ({analytics.risk.Medium})</span>
                    <span>{percentage(analytics.risk.Medium)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage(analytics.risk.Medium)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-rose-400">🔴 High / Critical Risk ({analytics.risk.High + analytics.risk.Critical})</span>
                    <span>{percentage(analytics.risk.High + analytics.risk.Critical)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage(analytics.risk.High + analytics.risk.Critical)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Customer Issues & Intents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customer Issues */}
            <div className={`rounded-2xl border p-6 ${cardBg} shadow-sm`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Top Reported Root Issues</span>
              </h3>

              {analytics.topIssues.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topIssues.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                      <span className="text-xs font-medium truncate max-w-[280px]">{item.issue}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300">
                        {item.count} sessions
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No specific issues aggregated yet.</p>
              )}
            </div>

            {/* Top Customer Intents */}
            <div className={`rounded-2xl border p-6 ${cardBg} shadow-sm`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Customer Intent Classification</span>
              </h3>

              {analytics.topIntents.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topIntents.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                      <span className="text-xs font-medium truncate max-w-[280px]">{item.intent}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300">
                        {item.count} requests
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No intent classifications recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
