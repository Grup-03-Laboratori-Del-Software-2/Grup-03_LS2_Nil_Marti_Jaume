import { useEffect, useState } from "react";
import type { Video } from "../types/Video";

export default function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Video[];
        if (!cancelled) setVideos(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!videos.length) return <p>No videos found.</p>;

  return (
    <ul style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: 16,
      listStyle: "none",
      padding: 0
    }}>
      {videos.map(v => (
        <li key={v.id} style={{ cursor: "pointer" }}>
          <img
            src={v.thumbnailURL}
            alt={v.name || `Video ${v.id}`}
            style={{ width: "100%", borderRadius: 12, display: "block" }}
          />
          <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.3 }}>
            {v.name || "Untitled"}
          </div>
        </li>
      ))}
    </ul>
  );
}
