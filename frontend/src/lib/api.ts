// src/lib/api.ts

// Use relative path so Vite proxy forwards /api/* → http://localhost:8081
// This avoids CORS preflight issues for PUT/DELETE that occur with direct cross-origin calls.
const BASE_URL = "";

// ===== JWT TOKEN HELPERS =====

export const getAuthToken = () => localStorage.getItem("admin_jwt");

export const setAuthToken = (token: string) =>
    localStorage.setItem("admin_jwt", token);

export const removeAuthToken = () =>
    localStorage.removeItem("admin_jwt");



// ===== CORE FETCH WRAPPER =====

async function fetchWithAuth(url: string, options: RequestInit = {}) {

    const token = getAuthToken();

    const headers = new Headers(options.headers || {});

    // Attach JWT if available
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // Default JSON header unless using FormData
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
    });

    // Handle auth failure
    if (response.status === 401) {
        removeAuthToken();
        window.dispatchEvent(new Event("auth-unauthorized"));
    }

    // Handle API errors
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || "API request failed");
    }

    // Parse JSON safely
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

    // For file uploads (images etc.)
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