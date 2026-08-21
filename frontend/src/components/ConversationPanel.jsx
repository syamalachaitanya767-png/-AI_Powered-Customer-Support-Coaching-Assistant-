import { useState } from "react";
import {
  analyzeMessage,
  getCoachingSuggestion,
} from "../services/api";

function ConversationPanel({ darkMode, setAnalysis }) {
  const [message, setMessage] = useState(
    "My internet has been down since yesterday and I need it for work."
  );

  const [loading, setLoading] = useState(false);

  const [suggestion, setSuggestion] = useState("");

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      // Customer Understanding Agent
      const result = await analyzeMessage(message);

      setAnalysis(result);

      // Coaching Agent
      const coach = await getCoachingSuggestion(message, result);

      setSuggestion(coach.suggestion);
    } catch (error) {
      console.error(error);
      alert("Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 shadow-lg h-full transition-all duration-300 ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">
        Conversation
      </h2>

      {/* Customer Message */}
      <div className="mb-5">
        <div className="text-blue-500 font-semibold mb-2">
          Customer
        </div>

        <div
          className={`rounded-xl p-4 ${
            darkMode
              ? "bg-slate-800 text-slate-200"
              : "bg-slate-100 text-slate-900"
          }`}
        >
          {message}
        </div>
      </div>

      {/* AI Coach Suggestion */}
      <div className="mb-6">
        <div className="text-green-500 font-semibold mb-2">
          AI Coach Suggestion
        </div>

        <div
          className={`rounded-xl p-4 ${
            darkMode
              ? "bg-slate-800 text-slate-300"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {suggestion || "Click Analyze Conversation to generate AI suggestion."}
        </div>
      </div>

      {/* Customer Message Input */}
      <textarea
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type customer message..."
        className={`w-full rounded-xl p-4 border resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          darkMode
            ? "bg-slate-950 border-slate-700 text-white"
            : "bg-white border-slate-300 text-slate-900"
        }`}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full mt-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Conversation"}
      </button>
    </div>
  );
}

export default ConversationPanel;