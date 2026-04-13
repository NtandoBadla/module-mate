import type { Handler } from "@netlify/functions";

const NVIDIA_API_KEY = process.env.VITE_NVIDIA_API_KEY ?? "";
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!NVIDIA_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "NVIDIA API key not configured on server." }),
    };
  }

  try {
    const body = JSON.parse(event.body ?? "{}");

    const response = await fetch(NVIDIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Proxy error", detail: String(err) }),
    };
  }
};
