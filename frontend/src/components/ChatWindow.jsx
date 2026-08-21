import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Play,
  Copy,
  Check,
  Download,
  Flame,
  Wifi,
  Wind,
  CreditCard,
  PackageCheck,
  ArrowDownLeft
} from "lucide-react";

import {
  analyzeSession,
  generateCustomer,
  simulateCustomerReply,
  resetSession,
} from "../services/api";

const PRESET_SCENARIOS = [
  { label: "AC Not Cooling", icon: Wind, text: "My AC is running but blowing warm air and making a strange rattling noise. Can you help?" },
  { label: "Wi-Fi Outage", icon: Wifi, text: "My internet has been down since yesterday and I urgently need it for work." },
  { label: "Refund Status", icon: CreditCard, text: "I returned my package 7 days ago and still haven't received my refund. Order #84729." },
  { label: "Late Delivery", icon: PackageCheck, text: "My delivery was supposed to arrive yesterday morning, but the status is stuck on in-transit." }
];

function ChatWindow({
  darkMode,
  suggestion,
  setAnalysis,
  setSuggestion,
  setArticles,
  setEscalation,
  setSummary,
  setKnowledgeAnswer,
  setAgentExecution,
  externalReply,
  onClearExternalReply
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "customer",
      text: "My AC is running but blowing warm air and making a strange rattling noise. Can you help?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);

  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [autoRoleplay, setAutoRoleplay] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const chatEndRef = useRef(null);

  // Sync external reply if passed from CoachingCard "Apply to Reply Box"
  useEffect(() => {
    if (externalReply) {
      setReply(externalReply);
      if (onClearExternalReply) onClearExternalReply();
    }
  }, [externalReply, onClearExternalReply]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, simulating]);

  const getConversation = (customMessages = messages) => {
    return customMessages
      .map((msg) => {
        const speaker = msg.sender === "customer" ? "Customer" : "Employee";
        return `${speaker}: ${msg.text}`;
      })
      .join("\n");
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await resetSession();
      setMessages([]);
      setReply("");
      setAnalysis(null);
      setSuggestion("");
      setKnowledgeAnswer("");
      setArticles([]);
      setEscalation(null);
      setSummary(null);
      setAgentExecution(null);
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = async (presetText) => {
    try {
      setLoading(true);
      await resetSession();
      const newMsgs = [
        {
          id: Date.now(),
          sender: "customer",
          text: presetText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(newMsgs);
      setReply("");

      // Auto-analyze selected preset
      const result = await analyzeSession(presetText);
      setAnalysis(result.analysis);
      if (result.coaching) setSuggestion(result.coaching.suggestion || "");
      if (result.knowledge) {
        setKnowledgeAnswer(result.knowledge.answer || "");
        setArticles(result.knowledge.articles || []);
      }
      setEscalation(result.escalation || null);
      setSummary(result.summary || null);
      setAgentExecution(result.agent_execution || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCustomer = async () => {
    try {
      setLoading(true);
      await resetSession();
      const data = await generateCustomer();
      const customerMsg = data.message || "I need help with my account.";

      const newMsgs = [
        {
          id: Date.now(),
          sender: "customer",
          text: customerMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ];
      setMessages(newMsgs);
      setReply("");

      // Auto-analyze generated customer scenario
      const result = await analyzeSession(customerMsg);
      setAnalysis(result.analysis);
      if (result.coaching) setSuggestion(result.coaching.suggestion || "");
      if (result.knowledge) {
        setKnowledgeAnswer(result.knowledge.answer || "");
        setArticles(result.knowledge.articles || []);
      }
      setEscalation(result.escalation || null);
      setSummary(result.summary || null);
      setAgentExecution(result.agent_execution || null);
    } catch (err) {
      console.error(err);
      alert("Failed to generate customer simulation.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (messages.length === 0) return;

    try {
      setLoading(true);
      const conversation = getConversation();
      const result = await analyzeSession(conversation);

      setAnalysis(result.analysis);
      if (result.coaching) {
        setSuggestion(result.coaching.suggestion || "");
      }
      if (result.knowledge) {
        setKnowledgeAnswer(result.knowledge.answer || "");
        setArticles(result.knowledge.articles || []);
      }
      setEscalation(result.escalation || null);
      setSummary(result.summary || null);
      setAgentExecution(result.agent_execution || null);
    } catch (err) {
      console.error(err);
      alert("Analysis Failed. Please check backend server status.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!reply.trim()) return;

    const currentReply = reply.trim();
    const updatedMessages = [
      ...messages,
      {
        id: Date.now(),
        sender: "employee",
        text: currentReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
    ];

    setMessages(updatedMessages);
    setReply("");

    // If Auto Roleplay is ON, simulate customer's dynamic reaction
    if (autoRoleplay) {
      try {
        setSimulating(true);
        const conv = getConversation(updatedMessages);
        const simData = await simulateCustomerReply(conv);

        if (simData && simData.message) {
          setTimeout(async () => {
            const customerReplyText = simData.message;
            const finalMessages = [
              ...updatedMessages,
              {
                id: Date.now() + 1,
                sender: "customer",
                text: customerReplyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ];
            setMessages(finalMessages);
            setSimulating(false);

            // Auto-refresh agent coaching on new customer turn
            try {
              const res = await analyzeSession(getConversation(finalMessages));
              setAnalysis(res.analysis);
              if (res.coaching) setSuggestion(res.coaching.suggestion || "");
              if (res.knowledge) {
                setKnowledgeAnswer(res.knowledge.answer || "");
                setArticles(res.knowledge.articles || []);
              }
              setEscalation(res.escalation || null);
              setSummary(res.summary || null);
              setAgentExecution(res.agent_execution || null);
            } catch (e) {
              console.error("Auto agent refresh failed:", e);
            }
          }, 800);
        }
      } catch (err) {
        console.error("Roleplay response error:", err);
        setSimulating(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTranscript = () => {
    const transcript = getConversation();
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat_transcript_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div
      className={`rounded-2xl shadow-md border flex flex-col h-full transition-all duration-300 ${
        darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      {/* Session Top Bar */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
        darkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/70"
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              Live Support Session
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ● Live Copilot
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive conversation between Customer & Support Agent
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRoleplay(!autoRoleplay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
              autoRoleplay
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                : darkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
            }`}
            title="Auto-simulate customer follow-up reply"
          >
            <Play className={`w-3.5 h-3.5 ${autoRoleplay ? "text-indigo-400" : "text-slate-400"}`} />
            <span>Roleplay: {autoRoleplay ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={handleGenerateCustomer}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Scenario</span>
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className={`p-1.5 rounded-xl border text-xs font-medium transition ${
              darkMode ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600"
            }`}
            title="Clear conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportTranscript}
            disabled={messages.length === 0}
            className={`p-1.5 rounded-xl border text-xs font-medium transition disabled:opacity-30 ${
              darkMode ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600"
            }`}
            title="Export chat transcript"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Scenario Pills */}
      <div className={`px-4 py-2 border-b flex items-center gap-2 overflow-x-auto text-xs ${
        darkMode ? "border-slate-800/60 bg-slate-950/20" : "border-slate-100 bg-slate-50/40"
      }`}>
        <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {PRESET_SCENARIOS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => handlePresetSelect(p.text)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium shrink-0 flex items-center gap-1.5 transition ${
                darkMode
                  ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/30"
              }`}
            >
              <Icon className="w-3 h-3 text-indigo-400" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-4 min-h-[420px] max-h-[560px] ${
        darkMode ? "bg-slate-950/40" : "bg-slate-50/30"
      }`}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Bot className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
            <h3 className="text-sm font-semibold mb-1">Support Session Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Click <span className="text-emerald-400 font-medium">New Scenario</span> or pick a preset above to begin practicing live AI coaching.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isCustomer = msg.sender === "customer";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 group ${isCustomer ? "justify-start" : "justify-end"}`}
              >
                {isCustomer && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[78%] rounded-2xl p-4 shadow-sm relative transition ${
                  isCustomer
                    ? darkMode
                      ? "bg-slate-800 text-slate-100 border border-slate-700/80"
                      : "bg-white text-slate-900 border border-slate-200"
                    : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-500/10"
                }`}>
                  <div className="flex items-center justify-between gap-3 text-[11px] font-semibold opacity-75 mb-1">
                    <span>{isCustomer ? "👤 Customer" : "🎧 Support Agent"}</span>
                    <div className="flex items-center gap-2">
                      <span>{msg.time || ""}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 transition p-0.5 hover:text-white"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.text}
                  </div>
                </div>

                {!isCustomer && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {simulating && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className={`px-4 py-3 rounded-2xl border text-xs flex items-center gap-2 ${
              darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600"
            }`}>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Customer is typing follow-up...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Fast Apply AI Coaching Suggestion Banner */}
      {suggestion && (
        <div className={`px-4 py-2.5 border-t flex items-center justify-between gap-3 transition ${
          darkMode ? "bg-emerald-950/30 border-emerald-900/40 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-900"
        }`}>
          <div className="flex items-center gap-2 text-xs truncate">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold text-emerald-500 shrink-0">AI Coaching Advice:</span>
            <span className="truncate opacity-90">{suggestion}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setReply(suggestion)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1 transition"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" /> Apply
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={`p-4 border-t ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
        <textarea
          rows={2}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your response to the customer... (Press Enter to Send)"
          className={`w-full rounded-xl p-3 border resize-none text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            darkMode
              ? "bg-slate-950 border-slate-700 text-white placeholder-slate-500"
              : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
          }`}
        />

        <div className="flex items-center justify-between gap-3 mt-2">
          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || messages.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow flex items-center gap-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Analyzing 5 Agents..." : "Analyze Conversation"}</span>
          </button>

          {/* Send Reply Button */}
          <button
            onClick={handleSend}
            disabled={!reply.trim()}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow flex items-center gap-2 transition disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;