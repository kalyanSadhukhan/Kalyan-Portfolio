// src/lib/api.ts

// Backend base URL
// Production → Render URL from Vercel env
// Local → empty so Vite proxy handles it
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// ===== JWT TOKEN HELPERS =====

export const getAuthToken = () => localStorage.getItem("admin_jwt");

export const setAuthToken = (token: string) =>
  localStorage.setItem("admin_jwt", token);

export const removeAuthToken = () =>
  localStorage.removeItem("admin_jwt");


// ===== URL HELPER =====

function buildUrl(url: string) {
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  return `${BASE_URL}${url}`;
}


// ===== CORE FETCH WRAPPER =====

async function fetchWithAuth(url: string, options: RequestInit = {}) {

  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  // Attach JWT ONLY for admin endpoints
  if (token && url.startsWith("/api/admin")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Default JSON header unless sending FormData
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(url), {
    ...options,
    headers,
  });

  // Handle expired auth
  if (response.status === 401) {
    removeAuthToken();
    window.dispatchEvent(new Event("auth-unauthorized"));
  }

  // Handle API errors
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "API request failed");
  }

  // Safe JSON parsing
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}


// ===== API METHODS =====

export const api = {

  get: (url: string) =>
    fetchWithAuth(url),

  post: (url: string, data: unknown) =>
    fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (url: string, data: unknown) =>
    fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (url: string) =>
    fetchWithAuth(url, {
      method: "DELETE",
    }),

  postFormData: (url: string, formData: FormData) =>
    fetchWithAuth(url, {
      method: "POST",
      body: formData,
    }),

  putFormData: (url: string, formData: FormData) =>
    fetchWithAuth(url, {
      method: "PUT",
      body: formData,
    }),
};
