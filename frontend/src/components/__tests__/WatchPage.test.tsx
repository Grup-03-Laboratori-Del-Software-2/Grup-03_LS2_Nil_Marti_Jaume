// src/components/__tests__/WatchPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WatchPage from '../../pages/WatchPage';
import { useAuth } from '../../auth/useAuth';

jest.mock('../../auth/useAuth');

describe('WatchPage', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetAllMocks();

    // Usuario logueado con token
    mockUseAuth.mockReturnValue({
      user: { email: 'user@example.com', name: 'User' },
      token: 'fake-token',
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    });

    // Mock de fetch para TODOS los casos que puede llamar WatchPage
    global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();
      const method = init?.method ?? 'GET';

      // 1) Carga del detalle del vídeo
      if (url === '/api/videos/123' && method === 'GET') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 123,
            videoURL: '/media/123.mp4',
            name: 'Vídeo desde API',
            username: 'user1',
            description: 'Descripción del vídeo',
            dateOfPublish: '2025-11-24T12:00:00',
            thumbnailURL: '/media/123.webp',
            duration: 10,
            likes: [],
            comments: [],
          }),
        } as unknown as Response;
      }

      // 2) Comprobación de suscripción del canal
      if (url === '/api/channels/user1/subscription' && method === 'GET') {
        return {
          ok: true,
          status: 200,
          json: async () => ({ subscribed: false, subscribers: 0 }),
        } as unknown as Response;
      }

      // 3) DELETE del vídeo
      if (url === '/api/videos/123' && method === 'DELETE') {
        return {
          ok: true,
          status: 204,
          json: async () => ({}),
        } as unknown as Response;
      }

      // 4) POST like
      if (url === '/api/videos/123/likes' && method === 'POST') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 123,
            videoURL: '/media/123.mp4',
            name: 'Vídeo desde API',
            username: 'user1',
            description: 'Descripción del vídeo',
            dateOfPublish: '2025-11-24T12:00:00',
            thumbnailURL: '/media/123.webp',
            duration: 10,
            likes: [{ username: 'user@example.com' }],
            comments: [],
          }),
        } as unknown as Response;
      }

      // 5) DELETE like
      if (url === '/api/videos/123/likes' && method === 'DELETE') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 123,
            videoURL: '/media/123.mp4',
            name: 'Vídeo desde API',
            username: 'user1',
            description: 'Descripción del vídeo',
            dateOfPublish: '2025-11-24T12:00:00',
            thumbnailURL: '/media/123.webp',
            duration: 10,
            likes: [],
            comments: [],
          }),
        } as unknown as Response;
      }

      // 6) POST suscripción
      if (url === '/api/channels/user1/subscription' && method === 'POST') {
        return {
          ok: true,
          status: 200,
          json: async () => ({ subscribed: true, subscribers: 1 }),
        } as unknown as Response;
      }

      // 7) DELETE suscripción
      if (url === '/api/channels/user1/subscription' && method === 'DELETE') {
        return {
          ok: true,
          status: 200,
          json: async () => ({ subscribed: false, subscribers: 0 }),
        } as unknown as Response;
      }

      // Fallback por si hay alguna otra llamada
      return {
        ok: true,
        status: 200,
        json: async () => ({}),
      } as unknown as Response;
    }) as unknown as typeof fetch;

    // Confirmación de borrado siempre positiva
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    global.fetch = originalFetch as typeof fetch;
    const confirmMock = window.confirm as unknown as jest.Mock | undefined;
    confirmMock?.mockRestore?.();
  });

  function renderWatchPage() {
    return render(
      <MemoryRouter initialEntries={['/watch/123']}>
        <Routes>
          <Route path="/watch/:id" element={<WatchPage />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('permite pulsar "Eliminar vídeo" y realiza petición DELETE', async () => {
    renderWatchPage();

    // Esperamos a que se renderice el botón de eliminar
    await waitFor(() => {
      expect(screen.getByText('Eliminar vídeo')).toBeInTheDocument();
    });

    // Click en "Eliminar vídeo"
    fireEvent.click(screen.getByText('Eliminar vídeo'));

    // Verificamos que se ha hecho una llamada DELETE a /api/videos/123 con el token correcto
    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;

      const deleteCall = calls.find(([url, options]) => {
        const opts = (options || {}) as RequestInit;
        return url === '/api/videos/123' && opts.method === 'DELETE';
      });

      expect(deleteCall).toBeTruthy();

      const [, deleteOptions] = deleteCall as [string, RequestInit];
      const headers = (deleteOptions.headers || {}) as Record<string, string>;

      expect(headers.Authorization).toBe('Bearer fake-token');
    });
  });

  it('permite hacer like y unlike llamando a los endpoints correctos', async () => {
    renderWatchPage();

    // Esperamos al botón inicial de like
    await waitFor(() => {
      expect(screen.getByText('Me gusta (0)')).toBeInTheDocument();
    });

    // LIKE
    fireEvent.click(screen.getByText('Me gusta (0)'));

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;

      const likePost = calls.find(([url, options]) => {
        const opts = (options || {}) as RequestInit;
        return url === '/api/videos/123/likes' && opts.method === 'POST';
      });

      expect(likePost).toBeTruthy();

      const [, likeOptions] = likePost as [string, RequestInit];
      const headers = (likeOptions.headers || {}) as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer fake-token');
    });

    // Debería actualizarse el contador
    await waitFor(() => {
      expect(screen.getByText('Me gusta (1)')).toBeInTheDocument();
    });

    // UNLIKE
    fireEvent.click(screen.getByText('Me gusta (1)'));

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;

      const likeDelete = calls.find(([url, options]) => {
        const opts = (options || {}) as RequestInit;
        return url === '/api/videos/123/likes' && opts.method === 'DELETE';
      });

      expect(likeDelete).toBeTruthy();

      const [, deleteOptions] = likeDelete as [string, RequestInit];
      const headers = (deleteOptions.headers || {}) as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer fake-token');
    });

    // Vuelve a 0
    await waitFor(() => {
      expect(screen.getByText('Me gusta (0)')).toBeInTheDocument();
    });
  });

  it('permite suscribirse al canal llamando al endpoint de suscripción', async () => {
    renderWatchPage();

    await waitFor(() => {
      expect(screen.getByText('Suscribirse')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Suscribirse'));

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;

      const subPost = calls.find(([url, options]) => {
        const opts = (options || {}) as RequestInit;
        return url === '/api/channels/user1/subscription' && opts.method === 'POST';
      });

      expect(subPost).toBeTruthy();

      const [, subOptions] = subPost as [string, RequestInit];
      const headers = (subOptions.headers || {}) as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer fake-token');
    });
  });
});
