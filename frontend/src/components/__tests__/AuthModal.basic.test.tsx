import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AuthModal from '../AuthModal';

jest.mock('../../auth/useAuth', () => ({
    useAuth: () => ({
        signIn: jest.fn(),
        signUp: jest.fn(),
        loading: false,
    }),
}));

describe('AuthModal basic behaviour', () => {
    it('no renderiza nada cuando open=false', () => {
        const { queryByRole } = render(<AuthModal open={false} onClose={jest.fn()} />);
        expect(queryByRole('dialog')).toBeNull();
    });

    it('overlay click llama a onClose y click dentro del modal NO', () => {
        const onClose = jest.fn();
        const { getByRole, container } = render(<AuthModal open={true} onClose={onClose} />);

        const overlay = getByRole('dialog');
        const inner = container.querySelector('.pt-modal') as HTMLElement;

        // click fuera (overlay) -> cierra
        fireEvent.click(overlay);
        expect(onClose).toHaveBeenCalledTimes(1);

        // reset
        onClose.mockClear();

        // click dentro del modal -> NO cierra
        fireEvent.click(inner);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('pulsa Escape y se llama a onClose gracias al useEffect', () => {
        const onClose = jest.fn();
        render(<AuthModal open={true} onClose={onClose} />);

        const ev = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(ev);

        expect(onClose).toHaveBeenCalled();
    });
});
