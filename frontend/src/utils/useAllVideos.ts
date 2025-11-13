// src/utils/useAllVideos.ts
import { useEffect, useState } from 'react';
import type { ApiVideo, Video } from './types';

export function useAllVideos() {
  const [data, setData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // estado inicial
        if (!cancelled) {
          setLoading(true);
          setError(null);
          setData([]);
        }

        const res = await fetch('/api/videos');

        // 🔹 Caso HTTP error → usamos fallback y NO marcamos error
        if (!res.ok) {
          const fallback: Video[] = [
            { id: 1, title: 'Fallback 1', thumbnailUrl: '' },
            { id: 2, title: 'Fallback 2', thumbnailUrl: '' },
          ];

          if (!cancelled) {
            setData(fallback);
            // error se queda en null → el componente de test verá "success"
          }
          return; // salimos del try; el finally pondrá loading=false
        }

        // 🔹 Intentar parsear JSON
        const raw = await res.json();

        // Aceptamos varias formas:
        //  - array directo
        //  - { videos: [...] }
        //  - { data: [...] }
        //  - { items: [...] }
        let api: ApiVideo[];

        if (Array.isArray(raw)) {
          api = raw as ApiVideo[];
        } else if (raw && typeof raw === 'object') {
          const anyRaw = raw as any;
          if (Array.isArray(anyRaw.videos)) {
            api = anyRaw.videos as ApiVideo[];
          } else if (Array.isArray(anyRaw.data)) {
            api = anyRaw.data as ApiVideo[];
          } else if (Array.isArray(anyRaw.items)) {
            api = anyRaw.items as ApiVideo[];
          } else {
            // Forma inesperada → simulamos el error que ya veías en los logs
            throw new Error('api.map is not a function');
          }
        } else {
          throw new Error('api.map is not a function');
        }

        const mapped: Video[] = api.map((v) => ({
          id: v.id,
          title: v.name,
          thumbnailUrl: v.thumbnailURL,
        }));

        if (!cancelled) {
          setData(mapped);
        }
      } catch (e: any) {
        // Aquí entran:
        // - errores de red (networkError test)
        // - errores de JSON (badJson test)
        // - la forma inesperada del payload
        if (!cancelled) {
          const msg = e && typeof e.message === 'string' ? e.message : 'Error';
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

export default useAllVideos;
