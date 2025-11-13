import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VideoGrid from '../VideoGrid'; // ← FIX

beforeEach(() => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ['Alpha', 'Beta', 'Gamma'],
  });
});
afterEach(() => {
  (global.fetch as jest.Mock | undefined)?.mockReset?.();
});

test('VideoGrid renderiza items cuando hay datos', async () => {
  render(
    <MemoryRouter>
      <VideoGrid />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });
});
