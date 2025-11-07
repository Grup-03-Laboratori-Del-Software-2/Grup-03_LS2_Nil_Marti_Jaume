import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { FiX } from "react-icons/fi";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { signIn, signUp, loading } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");

  // login
  const [emailL, setEmailL] = useState("");
  const [passL, setPassL] = useState("");
  // register
  const [nameR, setNameR] = useState("");
  const [emailR, setEmailR] = useState("");
  const [passR, setPassR] = useState("");
  const [err, setErr] = useState<string | null>(null);

  // cerrar con Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await signIn(emailL, passL);
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login error";
      setErr(msg);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await signUp(nameR, emailR, passR);
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Register error";
      setErr(msg);
    }
  };

  return (
    <div
      className="pt-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="pt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pt-modal-header">
          <button className="pt-modal-close" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </div>
        
        <div className="pt-tabbar" role="tablist" aria-label="Autenticación">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
            role="tab"
            aria-selected={tab === "login"}
          >
            Iniciar sesión
          </button>
          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
            role="tab"
            aria-selected={tab === "register"}
          >
            Crear cuenta
          </button>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="pt-form">
            <label>
              Email
              <input
                value={emailL}
                onChange={(e) => setEmailL(e.target.value)}
                type="email"
                required
                autoFocus
              />
            </label>
            <label>
              Contraseña
              <input
                value={passL}
                onChange={(e) => setPassL(e.target.value)}
                type="password"
                required
              />
            </label>
            {err && <p className="pt-form-error">{err}</p>}
            <button className="pt-cta" disabled={loading} type="submit">
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="pt-form">
            <label>
              Nombre
              <input
                value={nameR}
                onChange={(e) => setNameR(e.target.value)}
                required
                autoFocus
              />
            </label>
            <label>
              Email
              <input
                value={emailR}
                onChange={(e) => setEmailR(e.target.value)}
                type="email"
                required
              />
            </label>
            <label>
              Contraseña
              <input
                value={passR}
                onChange={(e) => setPassR(e.target.value)}
                type="password"
                required
              />
            </label>
            {err && <p className="pt-form-error">{err}</p>}
            <button className="pt-cta" disabled={loading} type="submit">
              {loading ? "Creando…" : "Crear cuenta"}
            </button>
          </form>
        )}

        <p className="pt-modal-note">
          Puedes usar la app sin iniciar sesión. El login es opcional.
        </p>
      </div>
    </div>
  );
}
