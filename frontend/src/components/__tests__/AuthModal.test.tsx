import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '../AuthModal';

const signIn = jest.fn();
const signUp = jest.fn();

jest.mock('../../auth/useAuth', () => ({
  useAuth: () => ({
    signIn,
    signUp,
    loading: false,
  }),
}));

beforeEach(() => {
  signIn.mockReset();
  signUp.mockReset();
});

describe('AuthModal', () => {
  it('hace login y cierra el modal cuando signIn resuelve', async () => {
    const onClose = jest.fn();
    signIn.mockResolvedValueOnce(undefined);

    render(<AuthModal open={true} onClose={onClose} />);

    // estamos en pestaña login por defecto
    const emailInput = screen.getByLabelText(/Email/i);
    const passInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passInput, { target: { value: 'secret' } });

    fireEvent.submit(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('user@test.com', 'secret');
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('muestra error si signIn lanza excepción', async () => {
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
      expect(
        screen.getByText('Credenciales inválidas')
      ).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it('permite registrar usuario y llama a signUp con la fecha en ISO local', async () => {
    const onClose = jest.fn();
    signUp.mockResolvedValueOnce(undefined);

    render(<AuthModal open={true} onClose={onClose} />);

    // Cambiamos a pestaña register
    fireEvent.click(screen.getByRole('tab', { name: /Crear cuenta/i }));

    // Rellenamos campos
    fireEvent.change(screen.getByLabelText(/^Nombre$/i), {
      target: { value: 'Nombre' },
    });
    fireEvent.change(screen.getByLabelText(/Apellido/i), {
      target: { value: 'Apellido' },
    });
    fireEvent.change(screen.getByLabelText(/^Email$/i), {
      target: { value: 'nuevo@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), {
      target: { value: '2000-01-02' },
    });

    fireEvent.submit(
      screen.getByRole('button', { name: /Crear cuenta/i })
    );

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith(
        'Nombre',
        'Apellido',
        'nuevo@test.com',
        '123456',
        '2000-01-02T00:00:00' // lo que construyes en handleRegister
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('cierra el modal al pulsar Escape gracias al useEffect', () => {
    const onClose = jest.fn();

    render(<AuthModal open={true} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('no renderiza nada cuando open = false', () => {
    const { container } = render(
      <AuthModal open={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });
});
