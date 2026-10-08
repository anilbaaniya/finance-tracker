const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

export async function authenticate(endpoint, credentials) {
  let response;

  try {
    response = await fetch(`${apiBaseUrl}/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Check your connection and try again.",
    );
  }

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    const fieldErrors =
      responseBody?.messages && typeof responseBody.messages === "object"
        ? responseBody.messages
        : {};
    const serverUnavailable =
      response.status === 502 ||
      response.status === 503 ||
      response.status === 504;
    const message =
      responseBody?.message ||
      (serverUnavailable
        ? "The authentication server is unavailable. Make sure the backend is running, then try again."
        : null) ||
      (Object.keys(fieldErrors).length
        ? "Please review the information you entered."
        : response.status >= 500
          ? "The server encountered a problem. Please try again in a moment."
          : "We couldn't complete your request. Please check your details and try again.");
    const error = new Error(message);
    error.fieldErrors = fieldErrors;
    throw error;
  }

  if (!responseBody?.token) {
    throw new Error(
      "The server response was incomplete. Please try again or contact support.",
    );
  }

  return responseBody;
}
