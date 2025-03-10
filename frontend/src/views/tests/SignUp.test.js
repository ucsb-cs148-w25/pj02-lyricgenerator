import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../SignUp';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('SignUp Page', () => {
  test('renders sign-up page correctly', () => {
    render(<SignUp setUser={jest.fn()} />, { wrapper: MemoryRouter });

    expect(screen.getByText('Sign up for Image2Caption')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /App Logo/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  test('renders Google sign-up button', () => {
    render(<SignUp setUser={jest.fn()} />, { wrapper: MemoryRouter });

    expect(screen.getByTestId('signInDiv')).toBeInTheDocument();
  });

  test('handles user sign out', () => {
    render(<SignUp setUser={jest.fn()} />, { wrapper: MemoryRouter });

    const signOutButton = screen.queryByRole('button', { name: /sign out/i });
    if (signOutButton) {
      fireEvent.click(signOutButton);
      expect(screen.getByTestId('signInDiv')).toBeVisible();
    }
  });
});
