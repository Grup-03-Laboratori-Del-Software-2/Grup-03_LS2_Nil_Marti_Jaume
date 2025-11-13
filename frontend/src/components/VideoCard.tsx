import { useState } from 'react';
import type { Video } from '../utils/types';
import './video-card.css';
import { FiPlay } from 'react-icons/fi';

export default function VideoCard({ video }: { video: Video }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="pt-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={video.title}
      data-testid="video-card"
    >
      <div className="pt-card-media">
        <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
        <div className={`pt-card-overlay ${hover ? 'show' : ''}`}>
          <div className="pt-card-actions">
            <button className="pt-btn primary" aria-label="Reproducir">
              <FiPlay size={18} style={{ verticalAlign: 'middle' }} />
            </button>{' '}
            <button className="pt-btn">＋</button>
          </div>
          <h3 className="pt-card-title">{video.title}</h3>
          <div className="pt-card-meta">
            {formatDuration(video.durationSec)}
            {typeof video.views === 'number' ? <span>• {video.views.toLocaleString()} views</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDuration(sec?: number) {
  if (sec == null) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return (
    <span>
      {m}:{String(s).padStart(2, '0')}
    </span>
  );
}
