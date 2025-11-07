export type Video = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  previewUrl?: string;
  category?: string;
  durationSec?: number;
  views?: number;
  createdAt?: string;
  owner?: { id: string; name: string; avatarUrl?: string };
};
