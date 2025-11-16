import { render, screen, fireEvent } from '@testing-library/react';
import CarouselRow from '../CarouselRow';
import type { Video } from '../../utils/types';

describe('CarouselRow', () => {
  test('renderitza els vídeos i crida onSelect en fer clic', () => {
    const videos: Video[] = [
      {
        id: 1,
        title: 'Video 1',
        thumbnailUrl: '/v1.webp',
        durationSec: 60,
        views: 123,
      } as unknown as Video,
    ];

    const handleSelect = jest.fn();

    render(
      <CarouselRow
        id="test-row"
        title="Secció test"
        videos={videos}
        onSelect={handleSelect}
      />,
    );

    // Títol de la secció
    expect(screen.getByText('Secció test')).toBeInTheDocument();
    // Targeta del vídeo
    const card = screen.getByTitle('Video 1');
    expect(card).toBeInTheDocument();

    // Click -> ha de cridar onSelect amb el vídeo
    fireEvent.click(card);
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(videos[0]);
  });
});
