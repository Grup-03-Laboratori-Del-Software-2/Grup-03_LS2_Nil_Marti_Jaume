import { useEffect, useState } from 'react';

export type Comment = {
  id: number;
  author: string;
  text: string;
  createdAt: string; // ISO
  avatarURL?: string | null;
};

type ApiComment = {
  id: number;
  username: string;
  text: string;
  dateOfPublish: string;
  avatarURL?: string | null;
};

type ApiVideoDetail = {
  id: number;
  comments?: ApiComment[];
};

export function useComments(videoId: number | string | undefined) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (videoId == null) return;
    let canceled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/videos/${videoId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as ApiVideoDetail | null;
        if (!data || canceled) return;

        const mapped: Comment[] = (data.comments ?? []).map((c) => ({
          id: c.id,
          author: c.username,
          text: c.text,
          createdAt: c.dateOfPublish,
          avatarURL: c.avatarURL ?? null,
        }));

        if (!canceled) {
          setComments(mapped);
        }
      } catch (e: unknown) {
        if (!canceled) {
          const msg = e instanceof Error ? e.message : 'Error al cargar comentarios';
          setError(msg);
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    run();
    return () => {
      canceled = true;
    };
  }, [videoId]);

  return { comments, loading, error };
}
