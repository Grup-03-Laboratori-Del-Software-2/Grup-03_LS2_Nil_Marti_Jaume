import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../auth/useAuth'; // ajusta si tu ruta difiere
import Home from '../../pages/Home';

beforeEach(() => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  });
});

afterEach(() => {
  (global.fetch as jest.Mock).mockReset();
});

describe('Home page (smoke)', () => {
  it('renders and shows the footer (contentinfo)', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthProvider>
    );

    const footer = await screen.findByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(screen.getByAltText('ProTube')).toBeInTheDocument();
  });
});
