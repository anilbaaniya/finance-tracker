const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
let categoryInitializationPromise;

export async function apiRequest(path, { method = "GET", body } = {}) {
  let auth;
  try {
    auth = JSON.parse(window.localStorage.getItem("expenseTrackerAuth") ?? "null");
  } catch {
    throw new Error("Your saved sign-in information is invalid. Please sign in again.");
  }

  if (!auth?.token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Check that the backend is running and try again.",
    );
  }

  if (response.status === 204) {
    return null;
  }

  const responseBody = await response.json().catch(() => null);
  if (!response.ok) {
    const fieldMessages =
      responseBody?.messages && typeof responseBody.messages === "object"
        ? Object.values(responseBody.messages).join(" ")
        : "";
    const message =
      responseBody?.message ||
      fieldMessages ||
      (response.status === 401
        ? "Your session has expired. Please sign in again."
        : response.status >= 500
          ? "The server encountered a problem. Please try again in a moment."
          : "The request could not be completed. Please check your details and try again.");
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return responseBody;
}

export const getDashboard = () => apiRequest("/api/dashboard");
export const getTransactions = () => apiRequest("/api/transactions");
export function initializeCategories() {
  if (!categoryInitializationPromise) {
    const request = apiRequest("/api/categories/defaults", { method: "POST" });
    categoryInitializationPromise = request;
    request.then(
      () => {
        if (categoryInitializationPromise === request) {
          categoryInitializationPromise = undefined;
        }
      },
      () => {
        if (categoryInitializationPromise === request) {
          categoryInitializationPromise = undefined;
        }
      },
    );
  }

  return categoryInitializationPromise;
}
export const createTransaction = (transaction) =>
  apiRequest("/api/transactions", { method: "POST", body: transaction });
export const deleteTransaction = (transactionId) =>
  apiRequest(`/api/transactions/${transactionId}`, { method: "DELETE" });
