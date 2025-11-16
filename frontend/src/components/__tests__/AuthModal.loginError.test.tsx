import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '../AuthModal';

const signInMock = jest.fn();
const signUpMock = jest.fn();

jest.mock('../../auth/useAuth', () => ({
  useAuth: () => ({
    signIn: signInMock,
    signUp: signUpMock,
    loading: false,
  }),
}));

describe('AuthModal login error flow', () => {
  beforeEach(() => {
    signInMock.mockReset();
    signUpMock.mockReset();
  });

  it('muestra mensaje de error cuando signIn rechaza y no llama a onClose', async () => {
    const onClose = jest.fn();
    signInMock.mockRejectedValueOnce(new Error('Credenciales incorrectas'));

    render(<AuthModal open={true} onClose={onClose} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passInput, { target: { value: 'secret' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('user@example.com', 'secret');
    });

    // No debe cerrar el modal en error
    expect(onClose).not.toHaveBeenCalled();

    // Muestra el mensaje de error que viene del Error
    expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument();
  });
});
