/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_DOMAIN: string;
  readonly VITE_MEDIA_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}