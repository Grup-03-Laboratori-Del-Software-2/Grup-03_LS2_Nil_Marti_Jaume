/* istanbul ignore file */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// import { getEnv } from "../utils/Env";

export type AuthUser = {
  email: string;
  name: string;
  surname?: string;
  dateOfBirth?: string;
  dateOfRegistration?: string;
};

type Ctx = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, surname: string, email: string, password: string, dateOfBirthISO: string) => Promise<void>;
  signOut: () => void;
};

const AuthCtx = createContext<Ctx | undefined>(undefined);

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

// Utilidad: base API. En dev usamos backend en localhost:8080
function getApiBase(): string {
  /*const env = getEnv() as any;
  const v1 = env?.API_BASE_URL ?? env?.API_DOMAIN ?? "";
  const v2 = (import.meta as any)?.env?.VITE_API_DOMAIN ?? "";
  const base = String(v1 || v2 || "").trim();
  return base || ""; // <- vacío = usa proxy Vite (rutas relativas)*/
  return 'http://localhost:8080';
}

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

  const API = getApiBase();

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  function extractToken(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') return null;
    const obj = payload as Record<string, unknown>;

    const candidate = obj.token ?? obj.accessToken ?? obj.jwt;

    return typeof candidate === 'string' ? candidate : null;
  }

  function mapUser(me: unknown): AuthUser | null {
    if (!me || typeof me !== 'object') return null;
    const m = me as Record<string, unknown>;

    const email = typeof m.email === 'string' ? m.email : '';
    const name = typeof m.name === 'string' ? m.name : '';
    const surname = typeof m.surname === 'string' ? m.surname : undefined;
    const dateOfBirth = typeof m.dateOfBirth === 'string' ? m.dateOfBirth : undefined;
    const dateOfRegistration = typeof m.dateOfRegistration === 'string' ? m.dateOfRegistration : undefined;

    return {
      email,
      name,
      surname,
      dateOfBirth,
      dateOfRegistration,
    };
  }

  async function fetchMe(tok: string) {
    const res = await fetch(`${API}/user/me`, {
      headers: { Authorization: `Bearer ${tok}` },
    });
    if (!res.ok) throw new Error(await res.text());
    const me = await res.json();
    const u = mapUser(me);
    if (u) setUser(u);
  }

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        // console.log('API base usada:', API);
        const res = await fetch(`${API}/user/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);

        // Intento 1: header Authorization
        const auth = res.headers.get('Authorization');
        let tok = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

        // Intento 2: body con { accessToken }
        if (!tok) {
          const json = await res.json();
          tok = extractToken(json);
        }
        if (!tok) throw new Error('Missing access token');

        setToken(tok);
        await fetchMe(tok);
      } finally {
        setLoading(false);
      }
    },
    [API]
  );

  const signUp = useCallback(
    async (name: string, surname: string, email: string, password: string, dateOfBirthISO: string) => {
      setLoading(true);
      try {
        // console.log('API base usada:', API);
        const r = await fetch(`${API}/user/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            surname,
            email,
            password,
            dateOfBirth: dateOfBirthISO,
          }),
        });
        if (!r.ok) throw new Error((await r.text()) || `HTTP ${r.status}`);

        // login automático
        await signIn(email, password);
      } finally {
        setLoading(false);
      }
    },
    [API, signIn]
  );

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<Ctx>(
    () => ({ user, token, loading, signIn, signUp, signOut }),
    [user, token, loading, signIn, signUp, signOut]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
