import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { User } from "../types";

interface AuthContextValue {
  users: User[];
  currentUser: User | null;
  setCurrentUserId: (id: number) => void;
  refreshUsers: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "db-control-current-user-id";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const refreshUsers = async () => {
    const list = await api.getUsers();
    setUsers(list);

    const savedId = Number(localStorage.getItem(STORAGE_KEY));
    const fallbackUser = list[0] ?? null;
    const selected = list.find((u) => u.id === savedId) ?? fallbackUser ?? null;

    if (selected) {
      localStorage.setItem(STORAGE_KEY, String(selected.id));
      setCurrentUser(selected);
    }
  };

  const refreshCurrentUser = async () => {
    const savedId = Number(localStorage.getItem(STORAGE_KEY));
    if (!savedId) return;

    const me = await api.getMe(savedId);
    setCurrentUser(me);

    setUsers((prev) => prev.map((u) => (u.id === me.id ? me : u)));
  };

  const setCurrentUserId = (id: number) => {
    const found = users.find((u) => u.id === id) ?? null;
    if (found) {
      localStorage.setItem(STORAGE_KEY, String(id));
      setCurrentUser(found);
    }
  };

  useEffect(() => {
    refreshUsers().catch(console.error);
  }, []);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      setCurrentUserId,
      refreshUsers,
      refreshCurrentUser
    }),
    [users, currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}