import { useNavigate } from "react-router-dom";

export default function WatchSidebar({
  onGoto,
}: {
  onGoto: (k: "player" | "title" | "comments") => void;
}) {
  const navigate = useNavigate();

  return (
    <aside className="pt-sidebar" aria-label="Navegación principal">
      {/* Logo arriba */}
      <a
        href="#home"
        className="pt-logo"
        aria-label="ProTube"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        <img alt="VidFlow" src="/vidflow-logo.png" />
      </a>

      <nav className="pt-side-links">
        {/* Home */}
        <a
          href="#home"
          title="Inicio"
          aria-label="Inicio"
          className="pt-side-link"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="22" width="22">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </a>

        {/* Ir al reproductor */}
        <a
          href="#player"
          title="Reproductor"
          aria-label="Reproductor"
          className="pt-side-link"
          onClick={(e) => {
            e.preventDefault();
            onGoto("player");
          }}
        >
          <svg viewBox="0 0 24 24" height="22" width="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
          </svg>
        </a>

        {/* Ir al título */}
        <a
          href="#title"
          title="Título"
          aria-label="Título"
          className="pt-side-link"
          onClick={(e) => {
            e.preventDefault();
            onGoto("title");
          }}
        >
          <svg viewBox="0 0 24 24" height="22" width="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M8 6v12" />
          </svg>
        </a>

        {/* Ir a comentarios */}
        <a
          href="#comments"
          title="Comentarios"
          aria-label="Comentarios"
          className="pt-side-link"
          onClick={(e) => {
            e.preventDefault();
            onGoto("comments");
          }}
        >
          <svg viewBox="0 0 24 24" height="22" width="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        </a>
      </nav>

      {/* Inferior: login / perfil */}
      <div className="pt-side-bottom">
        <button title="Iniciar sesión / Registrarse" aria-label="Iniciar sesión / Registrarse" className="pt-side-link">
          <svg viewBox="0 0 24 24" height="22" width="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
