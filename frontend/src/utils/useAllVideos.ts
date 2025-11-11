// import { useEffect, useState } from "react";
// import { getEnv } from "./Env";            
// import type { Video } from "./types";

// function getAuthToken(): string | null {
//   return (
//     localStorage.getItem("authToken") ||
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken")
//   );
// }

// export function useAllVideos() {
//   const [data, setData] = useState<Video[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let ignore = false;

//     (async () => {
//       const { API_BASE_URL } = getEnv();  
//       try {
//         const token = getAuthToken();

//         const res = await fetch(`${API_BASE_URL}/videos`, {
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           credentials: "include",
//         });

//         if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
//         const raw = await res.json();

//         const arr = Array.isArray(raw) ? raw : raw?.items || [];

//         const mapped: Video[] = arr.map((r: any) => ({
//           id: String(r.id ?? r._id),
//           title: r.title ?? r.name ?? "Untitled",
//           description: r.description ?? "",
//           thumbnailUrl:
//             r.thumbnailUrl ?? r.thumbnail ?? r.coverUrl ?? "/protube-logo.png",
//           previewUrl: r.previewUrl,
//           category: r.category ?? r.tags?.[0],
//           durationSec: r.durationSec ?? r.duration ?? undefined,
//           views: r.views ?? r.viewCount ?? undefined,
//           createdAt: r.createdAt,
//           owner: r.owner
//             ? {
//                 id: String(r.owner.id ?? r.owner._id),
//                 name: r.owner.name ?? "Unknown",
//                 avatarUrl: r.owner.avatarUrl,
//               }
//             : undefined,
//         }));

//         if (!ignore) setData(mapped);
//       } catch (e: any) {
//         if (!ignore) setError(e?.message || "Error cargando vídeos");
//       } finally {
//         if (!ignore) setLoading(false);
//       }
//     })();

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   return { data, loading, error };
// }


// src/utils/useAllVideos.ts
import { useEffect, useState } from "react";
import { getEnv } from "./Env";
import type { Video } from "./types";
import { MOCK_VIDEOS } from "./mockVideos";

function getAuthToken(): string | null {
  return (
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken")
  );
}

export function useAllVideos() {
  const [data, setData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      const env = getEnv();
      const useMocks =
        String((env.__vite__ as any)?.VITE_USE_MOCK_VIDEOS ?? "").toLowerCase() === "true";

      try {
        if (useMocks) {
          if (!ignore) {
            setData(MOCK_VIDEOS);
            setLoading(false);
          }
          return;
        }

        // 2) Fetch real
        const token = getAuthToken();
        const res = await fetch(`${env.API_BASE_URL}/videos`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
        const raw = await res.json();
        const arr = Array.isArray(raw) ? raw : raw?.items || [];

        const mapped: Video[] = arr.map((r: any) => ({
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
            ? {
                id: String(r.owner.id ?? r.owner._id),
                name: r.owner.name ?? "Unknown",
                avatarUrl: r.owner.avatarUrl,
              }
            : undefined,
        }));

        if (!ignore) setData(mapped);
      } catch (e: any) {
        // 3) Fallback a mocks si falla el fetch
        if (!ignore) {
          setData(MOCK_VIDEOS);
          // opcional: no mostramos error para no “ensuciar” la UI
          // setError(e?.message || "Error cargando vídeos");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
}
