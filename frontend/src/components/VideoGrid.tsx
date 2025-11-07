import { useState, useEffect } from "react";
import { getEnv } from "../utils/Env";

// Puede venir un string (p.ej. "Alpha") o un objeto con id/name/title
type Item = string | { id?: string | number; name?: string; title?: string; [k: string]: any };

const VideoGrid = () => {
  const [someData, setSomeData] = useState<Item[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch(`${getEnv().API_BASE_URL}/someEndpoint`)
      .then((res) => res.json() as Promise<Item[]>)
      .then((data) => {
        if (!cancelled) setSomeData(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        if (!cancelled) setSomeData([]); // estado coherente ante error
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ul className="row g-4">
      {someData.map((entity, index) => {
        const key =
          typeof entity === "string"
            ? `s-${entity}` // estable si es string
            : entity.id ?? entity.name ?? entity.title ?? index; // fallback al índice
        const text =
          typeof entity === "string"
            ? entity
            : String(entity.name ?? entity.title ?? entity.id ?? "");

        return <li key={key}>{text}</li>;
      })}
    </ul>
  );
};

export default VideoGrid;
