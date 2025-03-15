import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login Page', () => {
  test('renders login page correctly', () => {
    render(<Login setUser={jest.fn()} />, { wrapper: MemoryRouter });

    expect(screen.getByText('Log In to Image2Caption')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /App Logo/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  test('renders Google login button', () => {
    render(<Login setUser={jest.fn()} />, { wrapper: MemoryRouter });

    expect(screen.getByTestId('signInDiv')).toBeInTheDocument();
  });

  test('handles user sign out', () => {
    render(<Login setUser={jest.fn()} />, { wrapper: MemoryRouter });

    const signOutButton = screen.queryByRole('button', { name: /sign out/i });
    if (signOutButton) {
      fireEvent.click(signOutButton);
      expect(screen.getByTestId('signInDiv')).toBeVisible();
    }
  });
});
