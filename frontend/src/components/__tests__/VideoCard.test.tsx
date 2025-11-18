import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoCard from '../VideoCard';
import type { Video } from '../../utils/types';

function makeVideo(overrides: Partial<Video> = {}): Video {
  return {
    id: 1,
    title: 'Mi vídeo',
    description: 'Desc',
    thumbnailUrl: '/thumb.jpg',
    durationSec: 125,
    views: 1000,
    category: 'Test',
    channel: 'Canalito',
    ...overrides,
  } as Video;
}

describe('VideoCard', () => {
  it('renderiza imagen, título y muestra overlay al hacer hover', () => {
    const video = makeVideo();

    render(<VideoCard video={video} />);

    // Imagen con alt = título
    const img = screen.getByAltText('Mi vídeo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/thumb.jpg');

    // El contenedor principal
    const card = screen.getByTestId('video-card');
    expect(card).toBeInTheDocument();

    // Overlay existe
    const overlay = card.querySelector('.pt-card-overlay');
    expect(overlay).toBeInTheDocument();
    // Al inicio NO debería tener la clase "show"
    expect(overlay).not.toHaveClass('show');

    // Simulamos hover → debe añadir clase "show"
    fireEvent.mouseEnter(card);
    expect(overlay).toHaveClass('show');

    // Al salir del hover se oculta
    fireEvent.mouseLeave(card);
    expect(overlay).not.toHaveClass('show');

    // Duración formateada "2:05" (125 segundos)
    expect(screen.getByText('2:05')).toBeInTheDocument();
  });

  it('no muestra duración cuando durationSec es undefined (rama sec == null)', () => {
    const video = makeVideo({ durationSec: undefined });

    render(<VideoCard video={video} />);

    // No debería existir ningún texto con "NaN" ni algo raro
    // y, especialmente, no debería haber "0:00" si durationSec es undefined
    expect(screen.queryByText('0:00')).not.toBeInTheDocument();
  });
});
