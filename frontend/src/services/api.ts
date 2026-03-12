import type { DatabaseItem, HealthResponse, LogItem, QueryResponse, User } from "../types";

const API_BASE = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
  userId?: number
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (userId) {
    headers.set("X-User-Id", String(userId));
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Ошибка запроса");
  }

  return data as T;
}

export const api = {
  getUsers: () => request<User[]>("/auth/users"),
  getMe: (userId: number) => request<User>("/profile/me", {}, userId),
  updateMe: (userId: number, display_name: string) =>
    request<User>(
      "/profile/me",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name })
      },
      userId
    ),
  createUser: (userId: number, payload: { username: string; display_name: string; role: string }) =>
    request<User>(
      "/profile/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      },
      userId
    ),
  getHealth: () => request<HealthResponse>("/health"),
  getDatabases: (userId: number) => request<DatabaseItem[]>("/databases", {}, userId),
  uploadDatabase: async (userId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);

    return request<{ success: boolean; message: string; database_name: string }>(
      "/databases/upload",
      {
        method: "POST",
        body: form
      },
      userId
    );
  },
  runQuery: (userId: number, databaseName: string, query: string) =>
    request<QueryResponse>(
      `/databases/${encodeURIComponent(databaseName)}/query`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      },
      userId
    ),
  getLogs: (userId: number) => request<LogItem[]>("/logs", {}, userId)
};