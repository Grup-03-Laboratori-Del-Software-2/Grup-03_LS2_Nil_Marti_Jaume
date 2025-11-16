import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Video } from '../utils/types';
import WatchSidebar from '../shared/WatchSidebar';
import { useAuth } from '../auth/useAuth';
import './watch.css';

type ApiVideoDetail = {
  id: number;
  videoURL: string;
  name: string;
  username: string;
  description: string;
  dateOfPublish: string;
  thumbnailURL: string;
  duration: number;
  likes: { username: string }[];
  comments: { id: number; username: string; text: string; dateOfPublish: string }[];
};

type WatchLocationState = {
  state?: {
    video?: Video;
  };
};

const ABS = (path?: string) => {
  if (!path || typeof window === 'undefined') return undefined;

  const { protocol, hostname, port } = window.location;

  if (port === '5173') {
    return `${protocol}//${hostname}:8080${path}`;
  }

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

  const { user, token } = useAuth();

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

  const ui = useMemo(() => {
    const title = fromState?.title ?? detail?.name ?? 'Vídeo';
    const poster = ABS(detail?.thumbnailURL) ?? fromState?.thumbnailUrl ?? '/dog.png';
    const description = detail?.description ?? fromState?.description ?? '';
    const src = ABS(detail?.videoURL);

    return { title, poster, description, src };
  }, [fromState, detail]);

  const videoEl = useRef<HTMLVideoElement | null>(null);

  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm('¿Seguro que quieres borrar este vídeo?');
    if (!confirmDelete) return;

    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (res.status === 204) {
        navigate('/');
      } else if (res.status === 404) {
        setError('Vídeo no encontrado');
      } else {
        setError('No se pudo borrar el vídeo');
      }
    } catch {
      setError('Error al borrar el vídeo');
    }
  };

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
        <section id="watch-player" className="pt-watch-section">
          <div className="pt-watch-player">
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <video
              key={`${id}-${ui.src ?? 'no-src'}`}
              ref={videoEl}
              controls
              playsInline
              preload="metadata"
              poster={ui.poster}
              style={{ width: '100%', maxHeight: '70vh', backgroundColor: 'black' }}
            >
              {ui.src && <source src={ui.src} type="video/mp4" />}
              {!ui.src && <p>Vídeo no disponible.</p>}
            </video>

            {loading && <p>Cargando…</p>}
          </div>
        </section>

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

          {user && detail && (
            <div style={{ marginTop: '0.75rem' }}>
              <button
                onClick={handleDelete}
                style={{
                  padding: '0.35rem 0.9rem',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: '#b91c1c',
                  color: 'white',
                  fontSize: '.85rem',
                  fontWeight: 500,
                }}
              >
                Eliminar vídeo
              </button>
            </div>
          )}

          {ui.description && (
            <div className="pt-desc-box">
              <p className="pt-desc-text">{ui.description}</p>
            </div>
          )}
        </section>

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
