export type Role = "admin" | "moderator" | "guest";

export interface User {
  id: number;
  username: string;
  display_name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export interface DatabaseItem {
  name: string;
  size_bytes: number;
}

export interface QueryResponse {
  success: boolean;
  message: string;
  columns: string[];
  rows: Array<Array<string | number | null>>;
  affected_rows: number;
}

export interface LogItem {
  id: number;
  user_id: number;
  username: string;
  user_role: string;
  database_name: string;
  query_text: string;
  execution_status: string;
  error_message?: string | null;
  created_at: string;
}

export interface HealthResponse {
  status: string;
  server: string;
  database_count: number;
}