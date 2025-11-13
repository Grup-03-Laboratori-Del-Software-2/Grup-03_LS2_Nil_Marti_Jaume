export type AppEnv = {
  API_BASE_URL: string;
  MEDIA_BASE_URL: string;
  __vite__: Record<string, unknown>;
};

export const getEnv = (): AppEnv => {
  const { VITE_API_DOMAIN, VITE_MEDIA_DOMAIN, ...otherViteConfig } =
    (import.meta.env as Record<string, string | undefined>) ?? {};

  const apiDomain = (VITE_API_DOMAIN ?? '').replace(/\/+$/, '');
  const mediaDomain = (VITE_MEDIA_DOMAIN ?? '').replace(/\/+$/, '');

  return {
    API_BASE_URL: apiDomain ? `${apiDomain}/api` : '/api',
    MEDIA_BASE_URL: mediaDomain ? `${mediaDomain}/media` : '/media',
    __vite__: otherViteConfig,
  };
};
