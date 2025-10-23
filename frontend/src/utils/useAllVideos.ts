import { useEffect, useState } from "react";
import { Env } from "./Env";
import { Video } from "./types";

export function useAllVideos() {
    const [data, setData] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const token = localStorage.getItem("authToken"); // ⬅️ AJUSTA si usáis otra clave
                const res = await fetch(`${Env.API_BASE}/videos`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    credentials: "include",
                });
                if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
                const raw = await res.json();

                // ⬇️ MAPEADO al tipo Video (AJUSTA nombres de campos a los de tu backend)
                const mapped: Video[] = raw.map((r: any) => ({
                    id: String(r.id ?? r._id),
                    title: r.title ?? r.name ?? "Untitled",
                    description: r.description ?? "",
                    thumbnailUrl: r.thumbnailUrl ?? r.thumbnail ?? r.coverUrl ?? "/protube-logo.png",
                    previewUrl: r.previewUrl,
                    category: r.category ?? r.tags?.[0],
                    durationSec: r.durationSec ?? r.duration ?? undefined,
                    views: r.views ?? r.viewCount ?? undefined,
                    createdAt: r.createdAt,
                    owner: r.owner
                        ? { id: String(r.owner.id ?? r.owner._id), name: r.owner.name ?? "Unknown", avatarUrl: r.owner.avatarUrl }
                        : undefined,
                }));

                if (!ignore) setData(mapped);
            } catch (e: any) {
                if (!ignore) setError(e.message || "Error");
            } finally {
                if (!ignore) setLoading(false);
            }
        })();
        return () => { ignore = true; };
    }, []);

    return { data, loading, error };
}
