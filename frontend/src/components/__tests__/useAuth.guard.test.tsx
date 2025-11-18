import React from 'react';
import { render } from '@testing-library/react';
import { useAuth } from '../../auth/useAuth';

function BrokenConsumer() {
  const ctx = useAuth();
  return <div>{ctx.user?.email ?? 'no-user'}</div>;
}

describe('useAuth guard', () => {
  it('lanza error si se usa fuera de <AuthProvider>', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<BrokenConsumer />)).toThrow(/useAuth must be used inside <AuthProvider>/);

    spy.mockRestore();
  });
});
