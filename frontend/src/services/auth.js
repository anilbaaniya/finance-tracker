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
    const message =
      responseBody?.message ||
      (Object.keys(fieldErrors).length
        ? "Please review the information you entered."
        : "We couldn't complete your request. Please try again.");
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
