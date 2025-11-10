import { useEffect, useState } from "react";
import { api } from "./api";
import type { Video } from "./types";

type BackendVideo = {
  id: number;
  title: string;
  description: string;
  durationSec: number | null;
  thumbnailURL: string; // ojo: backend devuelve camel distinto
  src: string;
};

export function useAllVideos() {
  const [data, setData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<BackendVideo[]>("/api/videos")
      .then(list => {
        const mapped: Video[] = list.map(v => ({
          id: v.id,
          title: v.title,
          description: v.description,
          durationSec: v.durationSec ?? undefined,
          thumbnailUrl: absolutize(v.thumbnailURL),
          src: absolutize(v.src),
          // Opcionales para tu UI:
          views: undefined,
          channel: undefined,
        }));
        setData(mapped);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

function absolutize(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const MEDIA = (import.meta.env.VITE_MEDIA_DOMAIN ?? "http://localhost:8080").replace(/\/+$/, "");
  return `${MEDIA}${url.startsWith("/") ? url : `/${url}`}`;
}
