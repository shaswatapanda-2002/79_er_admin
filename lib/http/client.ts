// lib/http/client.ts
import axios from "axios";
import { requireEnv } from "@/lib/config/env";
import { normalizeApiError } from "@/lib/http/error";
import { useAuthStore } from "@/lib/auth/auth.store";
import { getToken } from "@/lib/auth/auth.session";

export const http = axios.create({
  baseURL: requireEnv("API_BASE_URL"),
  timeout: 60_000,
});

// Attach token (Zustand token first, fallback to localStorage token)
http.interceptors.request.use((config) => {
  const storeToken = useAuthStore.getState().token;
  const token = storeToken || getToken();

  // ✅ keep this log only for debugging (remove later)
  console.log("TOKEN IN CLIENT:", token);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Normalize errors
http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(normalizeApiError(err)),
);

// Helpers: auto JSON or FormData
export async function apiGet<T>(url: string, params?: any): Promise<T> {
  const res = await http.get(url, { params });
  return res.data as T;
}

export async function apiPost<T>(url: string, body?: any): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await http.post(url, body, {
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
  });
  return res.data as T;
}

export async function apiPut<T>(url: string, body?: any): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await http.put(url, body, {
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
  });
  return res.data as T;
}

export async function apiPatch<T>(url: string, body?: any): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await http.patch(url, body ?? {}, {
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
  });
  return res.data as T;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await http.delete(url);
  return res.data as T;
}