import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Video } from "../utils/types";
import WatchSidebar from "../shared/WatchSidebar";
import "./watch.css";

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const videoFromState: Video | undefined = location?.state?.video;

  const video = useMemo<Video | undefined>(() => {
    if (videoFromState && String(videoFromState.id) === String(id)) return videoFromState;
    if (!id) return undefined;
    // Fallback mínimo
    return {
      id,
      title: "Subastas de Trasteros con YouTubers ¿Quién gana mas?",
      description:
        "Descárgate iGraal con mi enlace y consigue 10€ extra de bienvenida... Agradecimientos a Boxngo por ceder el espacio para la grabación del vídeo.",
      thumbnailUrl: "/dog.png",
      channel: "TheWillyrex",
      views: 2029371,
      durationSec: 0,
      // @ts-ignore
      src: "/sample.mp4",
      // @ts-ignore (prop no obligatoria en tu tipo)
      publishedAt: "2025-10-29",
      // @ts-ignore
      likes: 132000,
    } as Video;
  }, [id, videoFromState]);

  const playerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    const map: Record<string, HTMLElement | null> = {
      player: playerRef.current,
      title: titleRef.current,
      comments: commentsRef.current,
    };
    if (h && map[h]) map[h]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goto = (key: "player" | "title" | "comments") => {
    const el = key === "player" ? playerRef.current : key === "title" ? titleRef.current : commentsRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${key}`);
  };

  if (!video) {
    return (
      <div className="pt-watch-layout">
        <WatchSidebar onGoto={goto} />
        <main className="pt-watch-main">
          <p>Vídeo no encontrado.</p>
          <button onClick={() => navigate("/")}>Volver al inicio</button>
        </main>
      </div>
    );
  }

  const viewsTxt =
    typeof video.views === "number" ? `${video.views.toLocaleString()} visualizaciones` : "—";
  const dateTxt = (video as any).publishedAt
    ? formatDate((video as any).publishedAt)
    : "";

  return (
    <div className="pt-watch-layout">
      <WatchSidebar onGoto={goto} />

      <main className="pt-watch-main">
        {/* PLAYER */}
        <section id="watch-player" ref={playerRef} className="pt-watch-section">
          <div className="pt-watch-player">
            <video controls playsInline preload="metadata" poster={video.thumbnailUrl ?? "/dog.png"}>
              <source src={(video as any).src ?? "/sample.mp4"} type="video/mp4" />
            </video>
          </div>
        </section>

        {/* TÍTULO */}
        <section id="watch-title" ref={titleRef} className="pt-watch-section pt-watch-title-block">
          <h1 className="pt-watch-title">{video.title}</h1>

          {/* CANAL + BOTONES */}
          <div className="pt-channel-row">
            <div className="pt-channel-left">
              <img src={"/avatar.png"} alt="" className="pt-watch-avatar" />
              <div>
                <div className="pt-channel-name">{video.channel ?? "Canal"}</div>
                <div className="pt-channel-subs">18,3 M de suscriptores</div>
              </div>
            </div>
            <div className="pt-channel-actions">
              <button className="pt-chip">Uneix-me</button>
              <button className="pt-chip primary">Subscriu-me</button>
            </div>
          </div>

          {/* MÉTRICAS + ACCIONES */}
          <div className="pt-actions-row">
            <div className="pt-stats">
              <span className="pt-stat-chip">{viewsTxt}</span>
              {dateTxt && <span className="pt-stat-chip">{dateTxt}</span>}
            </div>
            <div className="pt-actions">
              <button className="pt-action-btn" title="Me gusta">
                <span className="pt-icon">👍</span>
                <span>{formatCompact((video as any).likes ?? 0)}</span>
              </button>
              <button className="pt-action-btn" title="Compartir">
                <span className="pt-icon">🔗</span>
                <span>Comparteix</span>
              </button>
              <button className="pt-action-btn" title="Descargar">
                <span className="pt-icon">⬇️</span>
                <span>Baixa</span>
              </button>
              <button className="pt-action-btn" title="Thanks">
                <span className="pt-icon">💟</span>
                <span>Thanks</span>
              </button>
              <button className="pt-action-btn" title="Más">
                <span className="pt-icon">⋯</span>
              </button>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          {video.description && (
            <div className="pt-desc-box">
              <p className="pt-desc-line">
                {viewsTxt} • {dateTxt}
              </p>
              <p className="pt-desc-text">
                {video.description}
              </p>
              <ul className="pt-desc-links">
                <li><a href="#" target="_blank" rel="noreferrer">https://registrate.igraal.com/thewill…</a></li>
                <li><a href="#" target="_blank" rel="noreferrer">https://www.boxngo.es</a></li>
              </ul>
            </div>
          )}
        </section>

        {/* COMENTARIOS */}
        <section id="watch-comments" ref={commentsRef} className="pt-watch-section">
          <h2 className="pt-comments-title">Comentarios</h2>
          <div className="pt-comments">
            <article className="pt-comment">
              <header>Usuario</header>
              <p>¡Gran vídeo!</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}
function formatCompact(n: number) {
  return new Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
}
