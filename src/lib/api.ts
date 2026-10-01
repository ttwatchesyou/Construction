"use client";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const apiEnabled = process.env.NEXT_PUBLIC_API_ENABLED !== "false" && rawBaseUrl.length > 0;

export function apiUrl(path: string) {
  if (!rawBaseUrl) return path;
  const base = rawBaseUrl.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
}
