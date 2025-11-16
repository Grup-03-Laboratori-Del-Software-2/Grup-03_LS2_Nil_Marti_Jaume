import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VideoDetail from '../VideoDetail';
import type { Video } from '../../utils/types';

// Mock de useComments para controlar estados
jest.mock('../../utils/useComments', () => ({
  useComments: (id: number) => ({
    loading: false,
    error: null,
    comments: [
      {
        id: 1,
        author: 'Alice',
        text: 'Buen vídeo',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ],
  }),
}));

function makeVideo(overrides: Partial<Video> = {}): Video {
  return {
    id: 42,
    title: 'Video de detalle',
    description: 'Descripción larga',
    thumbnailUrl: '/thumb-detail.jpg',
    durationSec: 90,
    views: 200,
    category: 'Test',
    channel: 'Canal Detail',
    ...overrides,
  } as Video;
}

describe('VideoDetail', () => {
  it('renderiza título, descripción, link a watch y comentarios', () => {
    const video = makeVideo();
    const onClose = jest.fn();

    render(
      <MemoryRouter>
        <VideoDetail video={video} onClose={onClose} />
      </MemoryRouter>
    );

    // Título principal
    expect(
      screen.getByRole('heading', { name: 'Video de detalle' })
    ).toBeInTheDocument();

    // Descripción
    expect(screen.getByText('Descripción larga')).toBeInTheDocument();

    // Link a /watch/:id con texto "Play video"
    const playLink = screen.getByRole('link', {
      name: /Reproducir Video de detalle/i,
    });
    expect(playLink).toHaveAttribute('href', '/watch/42');

    // Badge de comentarios: 1
    expect(screen.getByText('1')).toBeInTheDocument();

    // Comentario mockeado
    expect(screen.getByText('Buen vídeo')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();

    // El overlay tiene role="dialog"
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
