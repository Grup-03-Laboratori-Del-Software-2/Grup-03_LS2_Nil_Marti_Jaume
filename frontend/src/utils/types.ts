export interface ApiVideoDetail {
  id: number;
  videoURL: string;
  name: string;
  username: string;
  description: string;
  dateOfPublish: string;
  thumbnailURL: string; // /media/xxx.webp
  duration: number; // segundos
  likes: { username: string }[];
  comments: { id: number; username: string; text: string; dateOfPublish: string }[];
}
