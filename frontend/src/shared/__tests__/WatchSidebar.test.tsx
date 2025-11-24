import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WatchSidebar from '../WatchSidebar';

describe('WatchSidebar', () => {
  test('muestra botón de login y dispara onOpenAuth cuando no hay usuario', () => {
    const handleGoto = jest.fn();
    const handleOpenAuth = jest.fn();
    const handleSignOut = jest.fn();

    render(
      <MemoryRouter>
        <WatchSidebar onGoto={handleGoto} hasUser={false} onOpenAuth={handleOpenAuth} onSignOut={handleSignOut} />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /iniciar sesión \/ registrarse/i });
    fireEvent.click(loginButton);

    expect(handleOpenAuth).toHaveBeenCalledTimes(1);
    expect(handleSignOut).not.toHaveBeenCalled();
  });

  test('muestra botón de logout y dispara onSignOut cuando hay usuario', () => {
    const handleGoto = jest.fn();
    const handleOpenAuth = jest.fn();
    const handleSignOut = jest.fn();

    render(
      <MemoryRouter>
        <WatchSidebar onGoto={handleGoto} hasUser={true} onOpenAuth={handleOpenAuth} onSignOut={handleSignOut} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    fireEvent.click(logoutButton);

    expect(handleSignOut).toHaveBeenCalledTimes(1);
    expect(handleOpenAuth).not.toHaveBeenCalled();
  });
});
