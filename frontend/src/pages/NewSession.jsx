import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import {
  Sparkles,
  UserCheck,
  ShieldAlert,
  BookOpen,
  FileText,
  HelpCircle,
  Zap,
  Info,
  CheckCircle2,
  ListOrdered
} from "lucide-react";

import ChatWindow from "../components/ChatWindow";
import CoachingCard from "../components/CoachingCard";
import CustomerUnderstandingCard from "../components/CustomerUnderstandingCard";
import KnowledgeCard from "../components/KnowledgeCard";
import EscalationCard from "../components/EscalationCard";
import SummaryCard from "../components/SummaryCard";
import AgentExecutionCard from "../components/AgentExecutionCard";

function NewSession() {
  const { darkMode } = useOutletContext();

  const [analysis, setAnalysis] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [articles, setArticles] = useState([]);
  const [knowledgeAnswer, setKnowledgeAnswer] = useState("");
  const [escalation, setEscalation] = useState(null);
  const [summary, setSummary] = useState(null);
  const [agentExecution, setAgentExecution] = useState(null);
  const [externalReply, setExternalReply] = useState("");
  const [activeTab, setActiveTab] = useState("customer_risk"); // "customer_risk", "knowledge", "summary_agents"

  const handleApplySuggestion = (text) => {
    setExternalReply(text);
  };

  const isAnalyzed = Boolean(analysis || suggestion || escalation);

  return (
    <div
      className={`min-h-screen p-4 md:p-6 transition-all duration-300 ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Beginner-Friendly Quick-Start Guide Banner */}
      <div className={`mb-5 p-4 rounded-2xl border transition-all ${
        darkMode
          ? "bg-slate-900/90 border-slate-800 text-slate-200"
          : "bg-white border-slate-200 text-slate-800 shadow-sm"
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <span>Live AI Support Copilot Workspace</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Interactive Mode
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Practice resolving real customer support issues with 5 autonomous AI agents guiding you.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium">
              <Info className="w-3.5 h-3.5" />
              <span>1. Type or pick scenario → 2. Click Analyze → 3. 1-Click Apply AI Coach advice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balanced 2-Column SaaS Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Chat Window (7 Cols) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col">
          <ChatWindow
            darkMode={darkMode}
            suggestion={suggestion}
            setAnalysis={setAnalysis}
            setSuggestion={setSuggestion}
            setArticles={setArticles}
            setEscalation={setEscalation}
            setSummary={setSummary}
            setKnowledgeAnswer={setKnowledgeAnswer}
            setAgentExecution={setAgentExecution}
            externalReply={externalReply}
            onClearExternalReply={() => setExternalReply("")}
          />
        </div>

        {/* Right Column: Unified Multi-Agent Intelligence HUD (5 Cols) */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-4">
          {/* 1. Priority Top: AI Coaching Suggestion */}
          <CoachingCard
            darkMode={darkMode}
            suggestion={suggestion}
            onApply={handleApplySuggestion}
          />

          {/* 2. Unified Multi-Agent Tabbed HUD */}
          <div className={`rounded-2xl border p-4 shadow-sm transition-all ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            {/* Tab Navigation Controls */}
            <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-slate-950/60 border border-slate-800 text-xs mb-4">
              <button
                onClick={() => setActiveTab("customer_risk")}
                className={`flex-1 py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                  activeTab === "customer_risk"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Customer & Risk</span>
                {analysis && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>

              <button
                onClick={() => setActiveTab("knowledge")}
                className={`flex-1 py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                  activeTab === "knowledge"
                    ? "bg-purple-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Knowledge (RAG)</span>
                {articles?.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
              </button>

              <button
                onClick={() => setActiveTab("summary_agents")}
                className={`flex-1 py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                  activeTab === "summary_agents"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Summary & Pipeline</span>
                {agentExecution && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </button>
            </div>

            {/* Tab 1: Customer Understanding & Escalation Risk */}
            {activeTab === "customer_risk" && (
              <div className="space-y-4">
                <CustomerUnderstandingCard
                  darkMode={darkMode}
                  analysis={analysis}
                />

                <EscalationCard
                  darkMode={darkMode}
                  escalation={escalation}
                />
              </div>
            )}

            {/* Tab 2: Knowledge Base RAG */}
            {activeTab === "knowledge" && (
              <div>
                <KnowledgeCard
                  darkMode={darkMode}
                  articles={articles}
                  answer={knowledgeAnswer}
                />
              </div>
            )}

            {/* Tab 3: Session Summary & Execution Pipeline */}
            {activeTab === "summary_agents" && (
              <div className="space-y-4">
                <SummaryCard
                  darkMode={darkMode}
                  summary={summary}
                />

                <AgentExecutionCard
                  darkMode={darkMode}
                  execution={agentExecution}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewSession;