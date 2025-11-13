import { useEffect, useState } from 'react';
import type { ApiVideoDetail } from './types';

export function useVideoDetail(id?: string | number) {
  const [data, setData] = useState<ApiVideoDetail | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // el backend devuelve Optional<VideoDetailDTO>: puede venir como objeto o "null"
        const json = await res.json();
        if (!cancelled) setData(json ?? null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, loading, error };
}
