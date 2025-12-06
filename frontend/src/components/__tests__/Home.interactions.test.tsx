import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import type { Video } from '../../utils/types';

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    value: jest.fn(),
    writable: true,
  });
});

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

jest.mock('../../components/VideoDetail', () => (props: { video: Video }) => (
  <div data-testid="video-detail">Detail for {props.video.title}</div>
));

jest.mock(
  '../../components/AuthModal',
  () => (props: { open: boolean }) => (props.open ? <div data-testid="auth-modal">Auth modal</div> : null)
);

jest.mock(
  '../../components/UploadModal',
  () => (props: { open: boolean }) => (props.open ? <div data-testid="upload-modal">Upload modal</div> : null)
);

describe('Home interactions (cubrir funciones de Home.tsx)', () => {
  it('ejecuta SideNav, smoothGo, AllVideosSection, AllVideoTile, HeroBanner y formatMinSec', async () => {
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Video Uno').length).toBeGreaterThan(0);
    });

      const recomendadosLink = screen.getByLabelText('Recomendados');
      fireEvent.click(recomendadosLink);

    await waitFor(() => {
      expect(replaceSpy).toHaveBeenCalled();
    });

    const uploadBtn = screen.getByLabelText('Subir');
    fireEvent.click(uploadBtn);
    expect(screen.getByTestId('upload-modal')).toBeInTheDocument();

    const logoutBtn = screen.getByLabelText('Cerrar sesión');
    fireEvent.click(logoutBtn);
    expect(signOut).toHaveBeenCalled();

    expect(screen.getByText('Todos los vídeos')).toBeInTheDocument();

    const videoUnoButtons = screen.getAllByRole('button', { name: /Video Uno/ });
    expect(videoUnoButtons.length).toBeGreaterThan(0);

    fireEvent.click(videoUnoButtons[0]);
    expect(screen.getByTestId('video-detail')).toBeInTheDocument();

    expect(screen.getByText('Contacto y ayuda')).toBeInTheDocument();

    replaceSpy.mockRestore();
  });
});
