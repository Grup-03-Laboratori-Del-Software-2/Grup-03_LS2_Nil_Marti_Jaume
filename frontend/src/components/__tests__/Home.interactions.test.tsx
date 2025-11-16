import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import type { Video } from '../../utils/types';

// --- polyfill scrollIntoView para jsdom ---
beforeAll(() => {
  // jsdom no implementa scrollIntoView -> la mockeamos
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    value: jest.fn(),
    writable: true,
  });
});

// --- Mocks de hooks usados por Home ---

const signOut = jest.fn();

jest.mock('../../auth/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'TestUser', email: 'test@example.com' },
    signOut,
    token: 'fake-token',
  }),
}));

jest.mock('../../utils/useAllVideos', () => ({
  useAllVideos: () => ({
    loading: false,
    error: null,
    data: [
      {
        id: 1,
        title: 'Video Uno',
        description: 'Desc 1',
        thumbnailUrl: '/t1.jpg',
        durationSec: 90,
        views: 10,
        category: 'Trending',
        channel: 'Canal 1',
      },
      {
        id: 2,
        title: 'Video Dos',
        description: 'Desc 2',
        thumbnailUrl: '/t2.jpg',
        durationSec: 120,
        views: 20,
        category: 'Recommended',
        channel: 'Canal 2',
      },
    ] as Video[],
  }),
}));

// Mock de componentes pesados: aquí solo queremos que Home.tsx ejecute su lógica
jest.mock('../../components/VideoDetail', () => (props: any) => (
  <div data-testid="video-detail">Detail for {props.video.title}</div>
));
jest.mock('../../components/AuthModal', () => (props: any) =>
  props.open ? <div data-testid="auth-modal">Auth modal</div> : null
);
jest.mock('../../components/UploadModal', () => (props: any) =>
  props.open ? <div data-testid="upload-modal">Upload modal</div> : null
);

describe('Home interactions (cubrir funciones de Home.tsx)', () => {
  it('ejecuta SideNav, smoothGo, AllVideosSection, AllVideoTile, HeroBanner y formatMinSec', async () => {
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Hero con el primer vídeo
    await waitFor(() => {
      expect(screen.getAllByText('Video Uno').length).toBeGreaterThan(0);
    });

    // SideNav: click en "Tendencias" → llama smoothGo (scrollIntoView + replaceState)
    const tendenciasLink = screen.getByLabelText('Tendencias');
    fireEvent.click(tendenciasLink);

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalled();
    });

    // Botón "Subir": como hay user, abre UploadModal
    const uploadBtn = screen.getByLabelText('Subir');
    fireEvent.click(uploadBtn);
    expect(screen.getByTestId('upload-modal')).toBeInTheDocument();

    // Botón "Cerrar sesión": llama a signOut
    const logoutBtn = screen.getByLabelText('Cerrar sesión');
    fireEvent.click(logoutBtn);
    expect(signOut).toHaveBeenCalled();

    // Sección "Todos los vídeos" (AllVideosSection + AllVideoTile + formatMinSec)
    expect(screen.getByText('Todos los vídeos')).toBeInTheDocument();

    // Los títulos aparecen también en el grid de abajo
    const videoUnoButtons = screen.getAllByRole('button', { name: /Video Uno/ });
    expect(videoUnoButtons.length).toBeGreaterThan(0);

    // Click en una tile → se abre VideoDetail (selected se rellena)
    fireEvent.click(videoUnoButtons[0]);
    expect(screen.getByTestId('video-detail')).toBeInTheDocument();

    // ContactSection también se renderiza (simple check de un texto suyo)
    expect(screen.getByText('Contacto y ayuda')).toBeInTheDocument();

    replaceSpy.mockRestore();
  });
});
