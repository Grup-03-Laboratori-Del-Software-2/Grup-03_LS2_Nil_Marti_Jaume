import { FormEvent, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  token: string | null;
  username: string;
  onUploaded?: () => void;
};

export default function UploadModal({ open, onClose, token, username, onUploaded }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbFile || !name.trim()) {
      setError('Faltan campos obligatorios');
      return;
    }

    const durationNum = Number(duration || '0');

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbFile);
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('username', username || 'anonymous');
    formData.append('duration', String(Number.isFinite(durationNum) ? durationNum : 0));

    try {
      setSubmitting(true);
      setError(null);

      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/videos', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        setError(`Error al subir (${res.status})`);
        return;
      }

      if (onUploaded) onUploaded();
      onClose();
      setName('');
      setDescription('');
      setDuration('');
      setVideoFile(null);
      setThumbFile(null);
    } catch {
      setError('Error al subir el vídeo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={() => {
        if (!submitting) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#111827',
          borderRadius: 12,
          padding: '1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,.35)',
          color: 'white',
        }}
      >
        <h2 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>Subir vídeo</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '.9rem' }}>
            Título
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                padding: '0.4rem 0.6rem',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,.12)',
                background: '#020617',
                color: 'white',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '.9rem' }}>
            Descripción
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                padding: '0.4rem 0.6rem',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,.12)',
                background: '#020617',
                color: 'white',
                resize: 'vertical',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '.9rem' }}>
            Duración (segundos)
            <input
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={{
                padding: '0.4rem 0.6rem',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,.12)',
                background: '#020617',
                color: 'white',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '.9rem' }}>
            Archivo de vídeo (.mp4)
            <input
              type="file"
              accept="video/mp4"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              required
              style={{ fontSize: '.85rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '.9rem' }}>
            Miniatura (.webp)
            <input
              type="file"
              accept="image/webp"
              onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)}
              required
              style={{ fontSize: '.85rem' }}
            />
          </label>

          {error && <div style={{ color: '#fca5a5', fontSize: '.85rem', marginTop: '.25rem' }}>{error}</div>}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '.5rem',
              marginTop: '.75rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: '0.35rem 0.9rem',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,.2)',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: '.9rem',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: 6,
                border: 'none',
                background: submitting ? '#4b5563' : '#22c55e',
                color: '#020617',
                cursor: submitting ? 'default' : 'pointer',
                fontSize: '.9rem',
                fontWeight: 600,
              }}
            >
              {submitting ? 'Subiendo…' : 'Subir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
