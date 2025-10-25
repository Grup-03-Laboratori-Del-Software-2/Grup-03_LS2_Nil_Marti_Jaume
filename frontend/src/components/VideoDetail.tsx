import React, { useMemo } from "react";
import type { Video } from "../utils/types";
import { useComments } from "../utils/useComments";
import { FiX, FiMessageCircle } from "react-icons/fi";

export default function VideoDetail({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) {
  const { comments, loading, error } = useComments(video.id);

  // color/gradient sobre el hero
  const bgImage = useMemo(
    () =>
      video.thumbnailUrl
        ? `linear-gradient(180deg, rgba(0,0,0,.6) 0%, rgba(0,0,0,.85) 60%), url("${video.thumbnailUrl}")`
        : "none",
    [video.thumbnailUrl]
  );

  return (
    <div className="pt-detail-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="pt-detail" onClick={(e) => e.stopPropagation()}>
        <button className="pt-detail-close" onClick={onClose} aria-label="Cerrar">
          <FiX />
        </button>

        {/* HERO */}
        <div className="pt-detail-hero" style={{ backgroundImage: bgImage }}>
          <div className="pt-detail-hero-inner">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="pt-detail-thumb"
              loading="eager"
            />
            <div className="pt-detail-meta">
              <h1 className="pt-detail-title">{video.title}</h1>
              {video.description && (
                <p className="pt-detail-desc">{video.description}</p>
              )}
              <div className="pt-detail-tags">
                {video.channel && <span>{video.channel}</span>}
                {typeof video.views === "number" && (
                  <span>{video.views.toLocaleString()} visualizaciones</span>
                )}
                {typeof video.durationSec === "number" && (
                  <span>{formatMinSec(video.durationSec)}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="pt-detail-body">
          <section className="pt-comments">
            <header className="pt-comments-head">
              <h2>
                <FiMessageCircle style={{ verticalAlign: "-2px", marginRight: 6 }} />
                Comentarios
              </h2>
              {loading && <span className="pt-comments-badge">Cargando…</span>}
              {error && <span className="pt-comments-badge error">Error al cargar</span>}
              {!loading && !error && (
                <span className="pt-comments-badge">{comments.length}</span>
              )}
            </header>

            {comments.length ? (
              <ul className="pt-comments-list">
                {comments.map((c) => (
                  <li key={c.id} className="pt-comment">
                    <div className="pt-comment-avatar">{c.author[0]?.toUpperCase()}</div>
                    <div className="pt-comment-body">
                      <div className="pt-comment-head">
                        <strong>{c.author}</strong>
                        <span className="pt-comment-date">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p>{c.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && <p className="pt-comments-empty">Sé el primero en comentar.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function formatMinSec(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
