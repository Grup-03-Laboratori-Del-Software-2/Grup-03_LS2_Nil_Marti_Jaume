import { useRef } from "react";
import type { Video } from "../utils/types";
import VideoCard from "./VideoCard";
import "./carousel-row.css";

export default function CarouselRow({ id, title, videos }: { id: string; title: string; videos: Video[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.9, 800);
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  if (!videos.length) return null;

  return (
    <section id={id} className="pt-row">
      <div className="pt-row-header">
        <h2>{title}</h2>
        <small>{videos.length} vídeos</small>
      </div>

      <div className="pt-row-wrap">
        <button aria-label="Scroll left" onClick={() => scroll("left")} className="pt-row-arrow left">◀</button>
        <div ref={scrollerRef} className="pt-row-scroller">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
        <button aria-label="Scroll right" onClick={() => scroll("right")} className="pt-row-arrow right">▶</button>
      </div>
    </section>
  );
}
