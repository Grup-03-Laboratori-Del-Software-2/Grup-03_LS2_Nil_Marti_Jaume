import React, { useEffect } from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../auth/useAuth';

// Mock de getEnv para forzar VITE_USE_MOCK_AUTH = "true"
// y evitar llamadas reales a backend
jest.mock('../../utils/Env', () => ({
  getEnv: () => ({
    API_BASE_URL: 'http://api.local/api',
    MEDIA_BASE_URL: 'http://api.local/media',
    VITE_USE_MOCK_AUTH: 'true',
    __vite__: {},
  }),
}));

function Probe() {
  const { user, signOut } = useAuth();

  // Llamamos a signOut para tocar algo de lógica interna
  useEffect(() => {
    // no nos importa el resultado, solo ejecutar la rama
    signOut?.();
  }, [signOut]);

  const label = user
    ? user.name || user.email || 'with-user'
    : 'none';

  return <div>auth-user:{label}</div>;
}

describe('AuthProvider + useAuth', () => {
  it('provee contexto y permite usar signOut sin crashear', async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    // Simplemente comprobamos que el componente se renderiza
    const el = await screen.findByText(/auth-user:/);
    expect(el).toBeInTheDocument();
  });
});
