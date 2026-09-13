const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getMarineData() {
  const result = await request("/api/marine-data");
  return result.data || result;
}

export async function getHealthStatus() {
  return request("/");
}

export async function sendChatMessage(message, language = "en") {
  return request("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message, language }),
  });
}

export async function getAlerts() {
  return request("/api/alerts");
}

export async function getFishingZones() {
  return request("/api/zones");
}

export { API_BASE_URL };
