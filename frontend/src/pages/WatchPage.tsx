import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Video } from '../utils/types';
import WatchSidebar from '../shared/WatchSidebar';
import './watch.css';

type ApiVideoDetail = {
  id: number;
  videoURL: string;      // ej: /media/0.mp4
  name: string;
  username: string;
  description: string;
  dateOfPublish: string;
  thumbnailURL: string;  // ej: /media/0.webp
  duration: number;
  likes: { username: string }[];
  comments: { id: number; username: string; text: string; dateOfPublish: string }[];
};

type WatchLocationState = {
  state?: {
    video?: Video;
  };
};

// 🔧 Helper robusto: construye siempre URL ABSOLUTA al backend
const ABS = (path?: string) => {
  if (!path || typeof window === 'undefined') return undefined;

  const { protocol, hostname, port } = window.location;

  // Si estamos en dev (Vite en 5173), asumimos backend en 8080 mismo host
  if (port === '5173') {
    return `${protocol}//${hostname}:8080${path}`;
  }

  // En prod el frontend lo sirve el propio backend (mismo origin)
  // Así que dejamos el puerto tal cual.
  const effectivePort = port ? `:${port}` : '';
  return `${protocol}//${hostname}${effectivePort}${path}`;
};

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as WatchLocationState;
  const fromState: Video | undefined = location?.state?.video;

  const [detail, setDetail] = useState<ApiVideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setLoading(false);
      setError('Missing id');
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as ApiVideoDetail | null;
        if (!cancelled) {
          setDetail(json);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Error';
          console.error('[WatchPage] Error fetching video detail', e);
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Datos que mostramos: mezclamos lo que viene de Home (state) + detalle API
  const ui = useMemo(() => {
    const title = fromState?.title ?? detail?.name ?? 'Vídeo';
    const poster = ABS(detail?.thumbnailURL) ?? fromState?.thumbnailUrl ?? '/dog.png';
    const description = detail?.description ?? fromState?.description ?? '';

    // 🔑 Lo importante: URL ABSOLUTA del vídeo
    const src = ABS(detail?.videoURL);

    return { title, poster, description, src };
  }, [fromState, detail]);

  const videoEl = useRef<HTMLVideoElement | null>(null);

  if (!id) {
    return (
      <div className="pt-watch-layout">
        <WatchSidebar onGoto={() => {}} />
        <main className="pt-watch-main">
          <p>Vídeo no encontrado.</p>
          <button onClick={() => navigate('/')}>Volver al inicio</button>
        </main>
      </div>
    );
  }

  return (
    <div className="pt-watch-layout">
      <WatchSidebar onGoto={() => {}} />

      <main className="pt-watch-main">
        {/* PLAYER */}
        <section id="watch-player" className="pt-watch-section">
          <div className="pt-watch-player">
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <video
              key={`${id}-${ui.src ?? 'no-src'}`} // fuerza recarga cuando cambia el vídeo
              ref={videoEl}
              controls
              playsInline
              preload="metadata"
              poster={ui.poster}
              style={{ width: '100%', maxHeight: '70vh', backgroundColor: 'black' }}
              onError={(e) => {
                console.error('[WatchPage] video tag error', e);
              }}
            >
              {ui.src && <source src={ui.src} type="video/mp4" />}
              {!ui.src && <p>Vídeo no disponible.</p>}
            </video>

            {loading && <p>Cargando…</p>}
          </div>
        </section>

        {/* TÍTULO + CANAL + DESC */}
        <section id="watch-title" className="pt-watch-section pt-watch-title-block">
          <h1 className="pt-watch-title">{ui.title}</h1>

          <div className="pt-channel-row">
            <div className="pt-channel-left">
              <img src="/avatar.png" alt="" className="pt-watch-avatar" />
              <div>
                <div className="pt-channel-name">{detail?.username ?? 'Canal'}</div>
                <div className="pt-channel-subs">—</div>
              </div>
            </div>
          </div>

          {ui.description && (
            <div className="pt-desc-box">
              <p className="pt-desc-text">{ui.description}</p>
            </div>
          )}
        </section>

        {/* COMENTARIOS */}
        <section id="watch-comments" className="pt-watch-section">
          <h2 className="pt-comments-title">Comentarios</h2>
          <div className="pt-comments">
            {(detail?.comments ?? []).map((c) => (
              <article key={c.id} className="pt-comment">
                <header>{c.username}</header>
                <p>{c.text}</p>
              </article>
            ))}

            {!detail?.comments?.length && !loading && <p>Aún no hay comentarios.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
