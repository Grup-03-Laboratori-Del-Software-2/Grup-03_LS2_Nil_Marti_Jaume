import { useEffect, useMemo, useState } from "react";
import {
  FiHome,
  FiTrendingUp,
  FiClock,
  FiStar,
  FiUpload,
  FiUser,
  FiGrid,
  FiMail,
  FiLogOut,
} from "react-icons/fi";

import { useAllVideos } from "../utils/useAllVideos";
import { groupByCategory } from "../utils/groupByCategory";
import type { Video } from "../utils/types";
import CarouselRow from "../components/CarouselRow";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../auth/useAuth";
import VideoDetail from "../components/VideoDetail";
import "./home.css";

export default function Home() {
  const { data: videos, loading, error } = useAllVideos();
  const hero: Video | null = videos[0] ?? null;
  const sections = useMemo(() => groupByCategory(videos), [videos]);

  const [selected, setSelected] = useState<Video | null>(null);

  return (
    <div className="pt-home">
      <SideNav />
      <main className="pt-container">
        {loading ? (
          <Skeletons />
        ) : (
          <>
            <HeroBanner video={hero} />

            <div className="pt-sections">
              {Object.entries(sections).map(([label, vids]) => (
                <CarouselRow
                  key={label}
                  id={label.toLowerCase().replace(/\s+/g, "-")}
                  title={label}
                  videos={vids}
                  onSelect={(v) => setSelected(v)} 
                />
              ))}
            </div>

            <AllVideosSection videos={videos} onSelect={(v) => setSelected(v)} />
            <ContactSection />

            {!videos.length && !error && (
              <div className="pt-empty">No hay vídeos todavía.</div>
            )}
            {error && !videos.length && <div className="pt-error">{error}</div>}
          </>
        )}
      </main>
      <footer className="pt-footer">© {new Date().getFullYear()} ProTube</footer>

      {/* Modal detalle */}
      {selected && (
        <VideoDetail video={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/* --- Sidebar --- */
function SideNav() {
  type TabId =
    | "home"
    | "trending"
    | "recently-added"
    | "recommended"
    | "all"
    | "contact";

  const [active, setActive] = useState<TabId>("home");
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const raw = (window.location.hash || "#home").slice(1) as TabId;
    const allowed: TabId[] = [
      "home",
      "trending",
      "recently-added",
      "recommended",
      "all",
      "contact",
    ];
    if (allowed.includes(raw)) setActive(raw);
  }, []);

  const smoothGo = (id: TabId) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  const Link = ({
    id,
    title,
    Icon,
  }: {
    id: TabId;
    title: string;
    Icon: React.ComponentType<{ size?: number }>;
  }) => (
    <a
      href={`#${id}`}
      title={title}
      aria-label={title}
      aria-current={active === id ? "page" : undefined}
      className={`pt-side-link ${active === id ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        smoothGo(id);
      }}
    >
      <Icon size={22} />
    </a>
  );

  return (
    <>
      <aside className="pt-sidebar" aria-label="Navegación principal">
        <a
          href="#home"
          className="pt-logo"
          aria-label="ProTube"
          onClick={(e) => {
            e.preventDefault();
            smoothGo("home");
          }}
        >
          <img src="/vidflow-logo.png" alt="ProTube" />
        </a>

        <nav className="pt-side-links">
          <Link id="home" title="Inicio" Icon={FiHome} />
          <Link id="trending" title="Tendencias" Icon={FiTrendingUp} />
          <Link id="recently-added" title="Novedades" Icon={FiClock} />
          <Link id="recommended" title="Recomendados" Icon={FiStar} />
          <Link id="all" title="Todos los vídeos" Icon={FiGrid} />
          <Link id="contact" title="Contacto" Icon={FiMail} />
        </nav>

        <div className="pt-side-bottom">
          <a href="#" title="Subir" aria-label="Subir" className="pt-side-link">
            <FiUpload size={22} />
          </a>

          {user ? (
            <button
              title={`Cerrar sesión (${user.name})`}
              aria-label="Cerrar sesión"
              className="pt-side-link"
              onClick={signOut}
            >
              <FiLogOut size={22} />
            </button>
          ) : (
            <button
              title="Iniciar sesión / Registrarse"
              aria-label="Iniciar sesión / Registrarse"
              className="pt-side-link"
              onClick={() => setAuthOpen(true)}
            >
              <FiUser size={22} />
            </button>
          )}
        </div>
      </aside>

      <AuthModal open={authOpen && !user} onClose={() => setAuthOpen(false)} />
    </>
  );
}

/* --- Secciones --- */
function AllVideosSection({
  videos,
  onSelect,
}: {
  videos: Video[];
  onSelect: (v: Video) => void;
}) {
  return (
    <section id="all" style={{ marginTop: "2.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", margin: "0 0 .75rem" }}>Todos los vídeos</h2>
      {videos.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {videos.map((v) => (
            <AllVideoTile key={v.id} video={v} onClick={() => onSelect(v)} />
          ))}
        </div>
      ) : (
        <p style={{ opacity: 0.8 }}>No hay vídeos.</p>
      )}
    </section>
  );
}

function AllVideoTile({
  video,
  onClick,
}: {
  video: Video;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        background: "rgba(255,255,255,.06)",
        borderRadius: 10,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        border: 0,
        padding: 0,
        textAlign: "left",
        cursor: "pointer",
      }}
      title={video.title}
    >
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        loading="lazy"
        style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
      />
      <div style={{ padding: "8px 10px" }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: ".95rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {video.title}
        </div>
        <div style={{ opacity: 0.8, fontSize: ".8rem", marginTop: 2 }}>
          {video.durationSec != null ? formatMinSec(video.durationSec) : "—"}
          {typeof video.views === "number" ? ` • ${video.views.toLocaleString()} views` : ""}
        </div>
      </div>
    </button>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="pt-bleed pt-contact">
      <div className="pt-contact-inner">
        <h2>Contacto y ayuda</h2>
        <div className="pt-contact-grid">
          <div className="pt-contact-card">
            <h3>ProTube</h3>
            <p>
              Plataforma de vídeos del equipo. Interfaz de ejemplo estilo Netflix con filas por
              categorías y lista completa al final.
            </p>
          </div>
          <div className="pt-contact-card">
            <h3>Contacto</h3>
            <ul>
              <li>Email: <a href="mailto:contact@protube.dev">contact@protube.dev</a></li>
              <li>Soporte: <a href="mailto:support@protube.dev">support@protube.dev</a></li>
              <li>
                GitHub:{" "}
                <a
                  href="https://github.com/Grup-03-Laboratori-Del-Software-2/Grup-03_LS2_Nil_Marti_Jaume"
                  target="_blank"
                  rel="noreferrer"
                >repositorio del proyecto</a>
              </li>
            </ul>
          </div>
          <div className="pt-contact-card">
            <h3>Estado del backend</h3>
            <p>
              En desarrollo. Esta demo usa datos simulados (mocks). Cuando el API esté disponible,
              cambia <code>VITE_USE_MOCK_VIDEOS</code> a <code>false</code>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Hero + Skeletons + helpers --- */
function HeroBanner({ video }: { video: Video | null }) {
  if (!video) return null;
  return (
    <section id="home" className="pt-hero">
      <img src={video.thumbnailUrl} alt={video.title} loading="eager" />
      <div className="pt-hero-grad" />
      <div className="pt-hero-content">
        <h1>{video.title}</h1>
        {video.description && <p>{video.description}</p>}
        <div className="pt-hero-buttons">
          <button className="primary">Reproducir</button>
          <button>Más info</button>
        </div>
      </div>
    </section>
  );
}

function Skeletons() {
  return (
    <div className="pt-skeletons">
      {[0, 1, 2].map((i) => (
        <div key={i} className="pt-skel-row">
          <div className="pt-skel-title" />
          <div className="pt-skel-cards">
            {Array.from({ length: 6 }).map((_, k) => (
              <div key={k} className="pt-skel-card" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatMinSec(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
