import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '../AuthModal';

const signIn = jest.fn();

jest.mock('../../auth/useAuth', () => ({
  useAuth: () => ({
    signIn,
    signUp: jest.fn(),
    loading: false,
  }),
}));

beforeEach(() => {
  signIn.mockReset();
});

describe('AuthModal login error', () => {
  it('muestra el mensaje de error cuando signIn rechaza', async () => {
    const onClose = jest.fn();
    signIn.mockRejectedValueOnce(new Error('Credenciales inválidas'));

    render(<AuthModal open={true} onClose={onClose} />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'bad@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: 'wrong' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalled();
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
