// src/components/VideoGrid.tsx
import { useState, useEffect } from 'react';
import { getEnv } from '../utils/Env';

// Puede venir un string ("Alpha") o un objeto con id/name/title
export type Item =
  | string
  | {
      id?: string | number;
      name?: string;
      title?: string;
      [k: string]: any;
    };

export default function VideoGrid() {
  const [someData, setSomeData] = useState<Item[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch(`${getEnv().API_BASE_URL}/someEndpoint`)
      .then((res) => res.json() as Promise<Item[] | any>)
      .then((data) => {
        if (cancelled) return;

        // Solo aceptamos arrays, si no, dejamos lista vacía
        if (Array.isArray(data)) {
          setSomeData(data as Item[]);
        } else {
          setSomeData([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        if (!cancelled) {
          // estado coherente ante error
          setSomeData([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ul className="row g-4">
      {someData.map((entity, index) => {
        // 🔑 key estable (adiós warning)
        const key = typeof entity === 'string' ? `s-${entity}` : (entity.id ?? entity.name ?? entity.title ?? index);

        // Texto mostrado en el <li>
        const text = typeof entity === 'string' ? entity : String(entity.name ?? entity.title ?? entity.id ?? '');

        return <li key={String(key)}>{text}</li>;
      })}
    </ul>
  );
}
