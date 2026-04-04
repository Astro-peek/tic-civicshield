const DEFAULT_API_BASE_URL =
  "https://asia-south1-civicshield-c634c.cloudfunctions.net/api";

function normalizeBaseUrl(url) {
  return (
    String(url || "")
      .trim()
      .replace(/\/+$/, "") || DEFAULT_API_BASE_URL
  );
}

function buildHeaders(authToken) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
}

function getApiErrorMessage(response, payload) {
  if (payload?.message) {
    return payload.message;
  }

  if (response.status === 401) {
    return "Authentication required. Please sign in and try again.";
  }

  if (response.status === 403) {
    return "You are not allowed to access this resource.";
  }

  if (response.status >= 500) {
    return "Server error. Please try again shortly.";
  }

  return `Request failed with status ${response.status}`;
}

export async function checkEligibility(profile, { authToken } = {}) {
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_BACKEND_BASE_URL);

  const response = await fetch(`${baseUrl}/check-eligibility`, {
    method: "POST",
    headers: buildHeaders(authToken),
    body: JSON.stringify(profile),
  });

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response, payload));
  }

  if (!payload || payload.success === false) {
    throw new Error(payload?.message || "Invalid API response");
  }

  return payload;
}
