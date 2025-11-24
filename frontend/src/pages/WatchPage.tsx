import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Video } from '../utils/types';
import WatchSidebar from '../shared/WatchSidebar';
import { useAuth } from '../auth/useAuth';
import AuthModal from '../components/AuthModal';
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
  comments: {
    id: number;
    username: string;
    text: string;
    dateOfPublish: string;
    avatarURL?: string | null;
  }[];
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

  const { user, token, signOut } = useAuth();

  // Comentarios
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Modal de login desde la página de vídeo
  const [authOpen, setAuthOpen] = useState(false);

  // Estado de canal: suscripción + likes
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [likesCount, setLikesCount] = useState<number | null>(null);
  const [channelError, setChannelError] = useState<string | null>(null);
  const [likeSubmitting, setLikeSubmitting] = useState(false);
  const [subSubmitting, setSubSubmitting] = useState(false);

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
        if (!cancelled && json) {
          setDetail(json);
          setLikesCount(json.likes ? json.likes.length : 0);
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

  // Cargar info de suscripción de canal
  useEffect(() => {
    if (!detail?.username) return;
    let cancelled = false;

    (async () => {
      try {
        setChannelError(null);
        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`/api/channels/${encodeURIComponent(detail.username)}/subscription`, {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (!res.ok) {
          // Si este endpoint aún no existe, simplemente salimos sin romper nada
          return;
        }

        const data = (await res.json()) as { subscribed?: boolean; likesCount?: number };

        if (!cancelled) {
          if (typeof data.subscribed === 'boolean') setSubscribed(data.subscribed);
          if (typeof data.likesCount === 'number') setLikesCount(data.likesCount);
        }
      } catch {
        if (!cancelled) {
          setChannelError('No se pudo cargar el estado del canal');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [detail?.username, token]);

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
        credentials: 'include',
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

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !detail) return;
    const text = newComment.trim();
    if (!text) {
      setCommentError('El comentario no puede estar vacío');
      return;
    }
    if (!user) {
      setCommentError('Necesitas iniciar sesión para comentar');
      setAuthOpen(true);
      return;
    }

    try {
      setCommentSubmitting(true);
      setCommentError(null);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`/api/videos/${id}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text }),
        credentials: 'include',
      });

      if (res.status === 401) {
        setCommentError('Necesitas iniciar sesión para comentar');
        setAuthOpen(true);
        return;
      }
      if (!res.ok) {
        setCommentError(`Error al enviar comentario (${res.status})`);
        return;
      }

      const updated = (await res.json()) as ApiVideoDetail;
      setDetail(updated);
      setLikesCount(updated.likes ? updated.likes.length : 0);
      setNewComment('');
    } catch {
      setCommentError('Error al enviar el comentario');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleToggleLike = async () => {
    if (!detail || !id) return;
    if (!user) {
      setAuthOpen(true);
      return;
    }

    try {
      setLikeSubmitting(true);
      setChannelError(null);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const userEmail = user.email.toLowerCase();
      const likedByMe = detail.likes.some((l) => l.username.toLowerCase() === userEmail);

      const method = likedByMe ? 'DELETE' : 'POST';

      const res = await fetch(`/api/videos/${id}/likes`, {
        method,
        headers,
        credentials: 'include',
      });

      if (!res.ok) {
        setChannelError(`No se pudo actualizar el like (${res.status})`);
        return;
      }

      const updated = (await res.json()) as ApiVideoDetail;
      setDetail(updated);
      setLikesCount(updated.likes ? updated.likes.length : 0);
    } catch {
      setChannelError('Error al actualizar el like');
    } finally {
      setLikeSubmitting(false);
    }
  };

  const handleToggleSubscribe = async () => {
    if (!detail?.username) return;
    if (!user) {
      setAuthOpen(true);
      return;
    }

    try {
      setSubSubmitting(true);
      setChannelError(null);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/channels/${encodeURIComponent(detail.username)}/subscription`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      if (!res.ok) {
        setChannelError(`No se pudo actualizar la suscripción (${res.status})`);
        return;
      }

      const data = (await res.json()) as { subscribed?: boolean };

      if (typeof data.subscribed === 'boolean') {
        setSubscribed(data.subscribed);
      }
    } catch {
      setChannelError('Error al actualizar la suscripción');
    } finally {
      setSubSubmitting(false);
    }
  };

  const handleGoto = (k: 'player' | 'title' | 'comments') => {
    const map: Record<'player' | 'title' | 'comments', string> = {
      player: 'watch-player',
      title: 'watch-title',
      comments: 'watch-comments',
    };
    const el = document.getElementById(map[k]);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!id) {
    return (
      <div className="pt-watch-layout">
        <WatchSidebar onGoto={handleGoto} hasUser={!!user} onOpenAuth={() => setAuthOpen(true)} onSignOut={signOut} />
        <main className="pt-watch-main">
          <p>Vídeo no encontrado.</p>
          <button onClick={() => navigate('/')}>Volver al inicio</button>
        </main>
        <AuthModal open={authOpen && !user} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="pt-watch-layout">
      <WatchSidebar onGoto={handleGoto} hasUser={!!user} onOpenAuth={() => setAuthOpen(true)} onSignOut={signOut} />

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

            <div className="pt-channel-right" style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleToggleLike}
                disabled={likeSubmitting}
                style={{
                  padding: '0.35rem 0.9rem',
                  borderRadius: 6,
                  cursor: likeSubmitting ? 'default' : 'pointer',
                  background: '#374151',
                  color: 'white',
                  fontSize: '.85rem',
                  fontWeight: 500,
                  border: 'none',
                }}
              >
                Me gusta ({likesCount ?? 0})
              </button>
              {detail && (
                <button
                  onClick={handleToggleSubscribe}
                  disabled={subSubmitting}
                  style={{
                    padding: '0.35rem 0.9rem',
                    borderRadius: 6,
                    cursor: subSubmitting ? 'default' : 'pointer',
                    background: subscribed ? '#16a34a' : '#111827',
                    color: 'white',
                    fontSize: '.85rem',
                    fontWeight: 500,
                    border: 'none',
                  }}
                >
                  {subscribed ? 'Suscrito' : 'Suscribirse'}
                </button>
              )}
            </div>
          </div>

          {channelError && <p style={{ marginTop: '0.5rem', fontSize: '.85rem', color: '#fca5a5' }}>{channelError}</p>}

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
                <div className="pt-comment-avatar">
                  {c.avatarURL ? (
                    <img
                      src={c.avatarURL}
                      alt={c.username}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '999px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    c.username[0]?.toUpperCase()
                  )}
                </div>
                <div className="pt-comment-body">
                  <header>{c.username}</header>
                  <p>{c.text}</p>
                </div>
              </article>
            ))}

            {!detail?.comments?.length && !loading && <p>Aún no hay comentarios.</p>}

            {user ? (
              <form
                onSubmit={handleSubmitComment}
                style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}
              >
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder="Escribe un comentario…"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,.12)',
                    background: '#020617',
                    color: 'white',
                    fontSize: '.9rem',
                    resize: 'vertical',
                  }}
                />
                {commentError && <div style={{ color: '#fca5a5', fontSize: '.85rem' }}>{commentError}</div>}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={commentSubmitting || !newComment.trim()}
                    style={{
                      padding: '0.35rem 0.9rem',
                      borderRadius: 6,
                      border: 'none',
                      background: commentSubmitting ? '#4b5563' : '#22c55e',
                      color: '#020617',
                      cursor: commentSubmitting ? 'default' : 'pointer',
                      fontSize: '.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {commentSubmitting ? 'Enviando…' : 'Comentar'}
                  </button>
                </div>
              </form>
            ) : (
              <p style={{ marginTop: '1rem', fontSize: '.9rem', opacity: 0.8 }}>
                Inicia sesión para dejar un comentario.
              </p>
            )}
          </div>
        </section>
      </main>

      <AuthModal open={authOpen && !user} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
