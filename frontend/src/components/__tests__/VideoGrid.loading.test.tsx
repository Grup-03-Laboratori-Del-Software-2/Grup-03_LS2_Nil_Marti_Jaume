import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VideoGrid from '../VideoGrid'; // ← FIX

beforeEach(() => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  });
});
afterEach(() => {
  (global.fetch as jest.Mock | undefined)?.mockReset?.();
});

test('VideoGrid renderiza estado vacío sin crashear', async () => {
  render(
    <MemoryRouter>
      <VideoGrid />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(document.querySelector('ul.row.g-4')).toBeInTheDocument();
  });
});
