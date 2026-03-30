// api.ts — centralised API helper
// Instead of writing fetch() + headers + JSON.parse in every component,
// import these helpers and call them with one line.
//
// Usage:
//   import { get, post, put, del } from "@/utils/api";
//   const orders = await get("/orders");
//   const order  = await post("/orders", { items, totalPrice });

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get the auth token from localStorage
const getToken = (): string | null => localStorage.getItem("token");

// Build headers — adds Authorization if token exists
const headers = (extra: Record<string, string> = {}): Record<string, string> => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

// Handle response — throws an error with the server's message if not OK
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { msg?: string; message?: string; error?: string })?.msg
      || (data as { message?: string })?.message
      || (data as { error?: string })?.error
      || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

// ── HTTP METHODS ─────────────────────────────────────────────────────────────

export async function get<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  "GET",
    headers: headers(),
  });
  return handleResponse<T>(res);
}

export async function post<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  "POST",
    headers: headers(),
    body:    body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

export async function put<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  "PUT",
    headers: headers(),
    body:    body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

export async function del<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  "DELETE",
    headers: headers(),
  });
  return handleResponse<T>(res);
}
