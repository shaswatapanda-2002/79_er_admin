// lib/auth/auth.session.ts
const KEY = "admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(KEY, token);

    document.cookie = `${KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  } catch {}
}

export function clearToken() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(KEY);

    document.cookie = `${KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
  } catch {}
}