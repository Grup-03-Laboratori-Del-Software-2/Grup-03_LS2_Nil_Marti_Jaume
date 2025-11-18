import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WatchPage from '../../pages/WatchPage';

jest.mock('../../auth/useAuth', () => ({
  useAuth: () => ({ user: { name: 'TestUser' }, token: 'fake-token' }),
}));

jest.mock('../../shared/WatchSidebar', () => () => <aside data-testid="watch-sidebar" />);

afterEach(() => {
  (global.fetch as jest.Mock | undefined)?.mockReset?.();
});

type ApiVideoDetail = {
  id: number;
  videoURL: string;
  name: string;
  username: string;
  description: string;
  dateOfPublish: string;
  thumbnailURL: string;
  duration: number;
  likes: { username: string }[];
  comments: { id: number; username: string; text: string; dateOfPublish: string }[];
};

const mockDetail: ApiVideoDetail = {
  id: 123,
  videoURL: '/media/123.mp4',
  name: 'Vídeo desde API',
  username: 'user1',
  description: 'Descripción del vídeo',
  dateOfPublish: '2025-01-01T00:00:00Z',
  thumbnailURL: '/media/123.webp',
  duration: 42,
  likes: [],
  comments: [],
};

describe('WatchPage', () => {
  it('carga detalle de vídeo y muestra título y descripción', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDetail,
    });

    render(
      <MemoryRouter initialEntries={['/watch/123']}>
        <Routes>
          <Route path="/watch/:id" element={<WatchPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Vídeo desde API' })).toBeInTheDocument();
    });

    expect(screen.getByText('Descripción del vídeo')).toBeInTheDocument();
  });

  it('muestra mensaje de error si la API responde con error', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(
      <MemoryRouter initialEntries={['/watch/999']}>
        <Routes>
          <Route path="/watch/:id" element={<WatchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: HTTP 500/)).toBeInTheDocument();
    });
  });

  it('permite pulsar "Eliminar vídeo" y realiza petición DELETE', async () => {
    (global as any).fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetail,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => ({}),
      });

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/watch/123']}>
        <Routes>
          <Route path="/watch/:id" element={<WatchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Eliminar vídeo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Eliminar vídeo'));

    await waitFor(() => {
      expect((global.fetch as jest.Mock).mock.calls.length).toBe(2);
    });

    const [, deleteCall] = (global.fetch as jest.Mock).mock.calls;
    const deleteUrl = deleteCall[0];
    const deleteOptions = deleteCall[1] as RequestInit;

    expect(deleteUrl).toBe('/api/videos/123');
    expect(deleteOptions.method).toBe('DELETE');
    expect((deleteOptions.headers as Record<string, string>).Authorization).toBe('Bearer fake-token');

    confirmSpy.mockRestore();
  });
});
