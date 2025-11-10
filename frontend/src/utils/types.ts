export type Video = {
  id: number | string;
  title: string;
  description?: string;
  thumbnailUrl: string;   
  durationSec?: number;
  views?: number;
  channel?: string;
  src?: string;
};
