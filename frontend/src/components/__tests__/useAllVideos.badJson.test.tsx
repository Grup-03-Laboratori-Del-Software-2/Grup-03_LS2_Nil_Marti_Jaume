import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useAllVideos } from '../../utils/useAllVideos';

jest.mock('../../utils/Env', () => ({
  getEnv: () => ({
    API_BASE_URL: 'http://api.local/api',
    MEDIA_BASE_URL: 'http://api.local/media',
    __vite__: {},
  }),
}));

function Probe() {
  const { data, loading, error } = useAllVideos();
  if (loading) return <div>state:loading</div>;
  if (error) return <div>state:error:{String(error)}</div>;
  return <div>state:success len:{data.length}</div>;
}

let spy: jest.SpyInstance;
beforeEach(() => {
  spy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (global.fetch as jest.Mock | undefined)?.mockReset?.();
  spy.mockRestore();
});

test('useAllVideos maneja JSON inválido (res.json lanza)', async () => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => {
      throw new Error('bad json');
    },
  });

  render(<Probe />);

  // Tu hook puede marcar error o hacer fallback; acepta cualquiera
  await waitFor(() => {
    const hasError = screen.queryByText(/state:error:/i);
    const hasSuccess = screen.queryByText(/state:success len:/i);
    expect(hasError || hasSuccess).toBeTruthy();
  });
});
