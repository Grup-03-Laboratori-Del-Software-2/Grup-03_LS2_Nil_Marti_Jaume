import { useEffect, useState } from "react";
import type { ApiVideo, Video } from "./types";

export function useAllVideos() {
  const [data, setData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const api = (await res.json()) as ApiVideo[];

        const mapped: Video[] = api.map((v) => ({
          id: v.id,
          title: v.name,
          thumbnailUrl: v.thumbnailURL, // 👈 mapeo crítico
        }));

        if (!cancelled) setData(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
