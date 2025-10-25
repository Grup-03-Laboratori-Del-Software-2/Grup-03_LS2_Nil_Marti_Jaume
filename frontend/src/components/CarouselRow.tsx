import { useRef } from "react";
import type { Video } from "../utils/types";
import VideoCard from "./VideoCard";
import "./carousel-row.css";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

type Props = {
  id: string;
  title: string;
  videos: Video[];
  onSelect?: (v: Video) => void; // opcional, si ya lo usas
};

export default function CarouselRow({ id, title, videos, onSelect }: Props) {
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
        <button
          aria-label="Scroll left"
          onClick={() => scroll("left")}
          className="pt-row-arrow left"
        >
          <FiChevronLeft size={20} style={{ verticalAlign: "middle" }} />
        </button>

        {/* Forzamos fila horizontal y snap */}
        <div
          ref={scrollerRef}
          className="pt-row-scroller"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            overflowX: "auto",
            overflowY: "hidden",
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
            paddingBottom: "6px",
          }}
        >
          {videos.map((v) => (
            <div
              key={v.id}
              className="pt-row-item"
              style={{ flex: "0 0 auto", scrollSnapAlign: "start" }}
              onClick={onSelect ? () => onSelect(v) : undefined}
            >
              <VideoCard video={v} />
            </div>
          ))}
        </div>

        <button
          aria-label="Scroll right"
          onClick={() => scroll("right")}
          className="pt-row-arrow right"
        >
          <FiChevronRight size={20} style={{ verticalAlign: "middle" }} />
        </button>
      </div>
    </section>
  );
}
