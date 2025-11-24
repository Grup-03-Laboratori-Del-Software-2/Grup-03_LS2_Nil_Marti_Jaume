import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProfilePage from '../ProfilePage';
import { useAuth } from '../../auth/useAuth';

jest.mock('../../auth/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

function renderProfile() {
  return render(
    <MemoryRouter initialEntries={['/profile']}>
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockUseAuth.mockReturnValue({
      user: {
        email: 'user@example.com',
        name: 'User',
        surname: 'Example',
        dateOfBirth: '2000-01-01T00:00:00',
        dateOfRegistration: '2024-01-01T00:00:00',
        avatarURL: '/media/avatar.png',
      },
      token: 'fake-token',
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn().mockResolvedValue(undefined),
      updateAvatar: jest.fn().mockResolvedValue(undefined),
      changePassword: jest.fn().mockResolvedValue(undefined),
    });
  });

  it('muestra los datos iniciales del usuario', () => {
    renderProfile();

    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Example')).toBeInTheDocument();
    expect(screen.getByDisplayValue('user@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000-01-01')).toBeInTheDocument();
  });

  it('envía el formulario de perfil y llama a updateProfile', async () => {
    renderProfile();

    const nameInput = screen.getByLabelText('Nombre') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'NuevoNombre' } });

    const submitBtn = screen.getByRole('button', { name: /guardar cambios/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUseAuth().updateProfile).toHaveBeenCalled();
    });
  });

  it('envía el formulario de cambio de contraseña', async () => {
    renderProfile();

    fireEvent.change(screen.getByLabelText('Contraseña actual'), { target: { value: 'OldPass#1' } });
    fireEvent.change(screen.getByLabelText('Nueva contraseña'), { target: { value: 'NewPass#2' } });
    fireEvent.change(screen.getByLabelText('Repetir nueva contraseña'), { target: { value: 'NewPass#2' } });

    const btn = screen.getByRole('button', { name: /cambiar contraseña/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockUseAuth().changePassword).toHaveBeenCalledWith('OldPass#1', 'NewPass#2');
    });
  });

  it('envía el formulario de avatar cuando hay fichero', async () => {
    renderProfile();

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/avatar/i) || screen.getByDisplayValue(/avatar/i);

    const inputs = screen.getAllByRole('textbox');
    // fallback simple si el label aria no está exactamente disponible
    const fileInputs = screen.getAllByTestId ? screen.getAllByTestId('file') : [];

    // Para no liarla: buscamos input type="file"
    const fileDom = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileDom, { target: { files: [file] } });

    const btn = screen.getByRole('button', { name: /actualizar avatar/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockUseAuth().updateAvatar).toHaveBeenCalled();
    });
  });
});
