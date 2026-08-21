const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = (rawBaseUrl !== undefined && rawBaseUrl !== null && rawBaseUrl.trim() !== "")
  ? rawBaseUrl.trim().replace(/\/+$/, "")
  : (typeof window !== "undefined" && window.location.port === "5173" ? "http://127.0.0.1:5000" : "");

// ==========================================
// Customer Understanding Agent
// ==========================================

export async function analyzeMessage(message) {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze message");
  }

  return await response.json();
}

// ==========================================
// Coaching Agent
// ==========================================

export async function getCoachingSuggestion(message, analysis) {
  const response = await fetch(`${BASE_URL}/coach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      analysis,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get coaching suggestion");
  }

  return await response.json();
}

// ==========================================
// Knowledge Agent
// ==========================================

export async function getKnowledge(message) {
  const response = await fetch(`${BASE_URL}/api/knowledge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get knowledge");
  }

  return await response.json();
}

// ==========================================
// Escalation Agent
// ==========================================

export async function getEscalationRisk(message) {
  const response = await fetch(`${BASE_URL}/api/escalation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get escalation risk");
  }

  return await response.json();
}

// ==========================================
// Summary Agent
// ==========================================

export async function getSummary(conversation) {
  const response = await fetch(`${BASE_URL}/api/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate summary");
  }

  return await response.json();
}

// ==========================================
// Customer Simulator
// ==========================================

export async function generateCustomer() {
  const response = await fetch(`${BASE_URL}/api/simulator`);

  if (!response.ok) {
    throw new Error("Failed to generate customer");
  }

  return await response.json();
}

// ==========================================
// Orchestrator
// ==========================================

export async function analyzeSession(message) {
  const response = await fetch(`${BASE_URL}/api/analyze-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze session");
  }

  return await response.json();
}

// ==========================================
// Reset Conversation Memory
// ==========================================

export async function resetSession() {
  const response = await fetch(`${BASE_URL}/api/reset-session`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to reset session");
  }

  return await response.json();
}

// ==========================================
// REPORTS / SAVED SESSIONS
// ==========================================

// Get all saved sessions
export async function getSessions() {
  const response = await fetch(`${BASE_URL}/api/sessions`);

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  return await response.json();
}

// Get one saved session
export async function getSession(sessionId) {
  const response = await fetch(
    `${BASE_URL}/api/sessions/${sessionId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch session");
  }

  return await response.json();
}

// Delete one saved session
export async function deleteSession(sessionId) {
  const response = await fetch(
    `${BASE_URL}/api/sessions/${sessionId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete session");
  }

  return await response.json();
}

// ==========================================
// Dynamic Customer Simulator Reply (Roleplay)
// ==========================================

export async function simulateCustomerReply(conversation) {
  const response = await fetch(`${BASE_URL}/api/simulate-reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to simulate customer reply");
  }

  return await response.json();
}

// ==========================================
// Rebuild Vector Database from UI
// ==========================================

export async function rebuildVectorDatabase() {
  const response = await fetch(`${BASE_URL}/api/rebuild-vectordb`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to rebuild vector database");
  }

  return await response.json();
}

// ==========================================
// System Health & Status
// ==========================================

export async function getSystemStatus() {
  const response = await fetch(`${BASE_URL}/api/system-status`);

  if (!response.ok) {
    throw new Error("Failed to get system status");
  }

  return await response.json();
}