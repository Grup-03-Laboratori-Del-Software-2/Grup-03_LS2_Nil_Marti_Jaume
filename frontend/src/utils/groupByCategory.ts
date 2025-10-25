import type { Video } from "./types";

export function groupByCategory(videos: Video[]) {
  const buckets: Record<string, Video[]> = {
    Trending: [],
    "Recently Added": [],
    Recommended: [],
  };
  for (const v of videos) {
    const c = v.category || "Recommended";
    if (!buckets[c]) buckets[c] = [];
    buckets[c].push(v);
  }
  return buckets;
}
