import { useEffect, useMemo, useState } from "react";
import { getEnv } from "./Env";

export type Comment = {
  id: string;
  videoId: string;
  author: string;
  text: string;
  createdAt: string; // ISO
};

export function useComments(videoId: string) {
  const env = getEnv();
  const useMocks = useMemo(() => {
    const raw = String((env.__vite__ as any)?.VITE_USE_MOCK_COMMENTS ?? "true");
    return raw.toLowerCase() === "true";
  }, [env]);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    async function run() {
      setLoading(true);
      setErr(null);
      try {
        if (useMocks) {
          const mocks = makeMockComments(videoId);
          if (!canceled) setComments(mocks);
        } else {
          const res = await fetch(`${env.API_BASE_URL}/videos/${videoId}/comments`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error(await res.text());
          const data = (await res.json()) as Comment[];
          if (!canceled) setComments(data);
        }
      } catch (e: any) {
        if (!canceled) setErr(e?.message || "Error");
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    run();
    return () => {
      canceled = true;
    };
  }, [videoId, env, useMocks]);

  return { comments, loading, error: error };
}

function makeMockComments(videoId: string): Comment[] {
  const base = [
    "Brutal edición, me encantó el ritmo 🔥",
    "Dato interesante en el minuto 3:24.",
    "¿Alguien tiene el enlace a los recursos?",
    "Buen contenido, directo y claro.",
    "Like si también viniste por la miniatura 😅",
  ];
  return base.map((text, i) => ({
    id: `${videoId}-${i}`,
    videoId,
    author: ["Ana", "Nil", "Jaume", "Genís", "Martí"][i % 5],
    text,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}
