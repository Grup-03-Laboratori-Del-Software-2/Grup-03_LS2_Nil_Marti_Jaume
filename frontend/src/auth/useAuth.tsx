import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getEnv } from "../utils/Env";

export type AuthUser = { id: string; name: string; email: string };

type Ctx = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthCtx = createContext<Ctx | undefined>(undefined);

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const env = getEnv(); // { API_BASE_URL, __vite__ ... }
  const useMocks = useMemo(() => {
    const raw = String((env.__vite__ as any)?.VITE_USE_MOCK_AUTH ?? "");
    return raw.toLowerCase() === "true";
  }, [env]);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (useMocks) {
        setToken("mock-token");
        setUser({ id: "u1", name: email.split("@")[0] || "User", email });
        return;
      }
      const res = await fetch(`${env.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as { token: string; user: AuthUser };
      setToken(json.token);
      setUser(json.user);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      if (useMocks) {
        setToken("mock-token");
        setUser({ id: "u2", name, email });
        return;
      }
      const res = await fetch(`${env.API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as { token: string; user: AuthUser };
      setToken(json.token);
      setUser(json.user);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    // opcional: fetch(`${env.API_BASE_URL}/auth/logout`, { method: "POST", credentials: "include" })
  };

  const value = useMemo<Ctx>(
    () => ({ user, token, loading, signIn, signUp, signOut }),
    [user, token, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
