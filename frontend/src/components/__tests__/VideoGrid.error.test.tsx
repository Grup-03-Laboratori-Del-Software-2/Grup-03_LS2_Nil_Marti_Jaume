import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VideoGrid from '../VideoGrid';

let spy: jest.SpyInstance;

beforeEach(() => {
  // silenciar el console.error del catch en el test
  spy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (global.fetch as jest.Mock | undefined)?.mockReset?.();
  spy.mockRestore();
});

test('VideoGrid no crashea si fetch rechaza y deja la lista vacía', async () => {
  (global as any).fetch = jest.fn().mockRejectedValue(new Error('boom'));

  render(
    <MemoryRouter>
      <VideoGrid />
    </MemoryRouter>
  );

  await waitFor(() => {
    const ul = document.querySelector('ul.row.g-4');
    expect(ul).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).toBeNull();
  });
});
