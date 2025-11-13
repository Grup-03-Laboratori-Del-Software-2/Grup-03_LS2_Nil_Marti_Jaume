import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VideoGrid from '../VideoGrid';

beforeEach(() => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      { id: 1, title: 'One' }, // key por id, texto por title
      { name: 'Two' }, // key por name, texto por name
      { title: 'Three' }, // key por title, texto por title
    ],
  });
});

afterEach(() => {
  (global.fetch as jest.Mock | undefined)?.mockReset?.();
});

test('VideoGrid renderiza objetos con claves id/name/title', async () => {
  render(
    <MemoryRouter>
      <VideoGrid />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });
});
