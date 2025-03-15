import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Landing from '../Landing';

jest.mock('react-simple-typewriter', () => ({
  Typewriter: ({ words }) => <span>{words[0]}</span> 
}));

describe('Landing Page', () => {
  test('renders the landing page header text', () => {
    render(<Landing />, { wrapper: MemoryRouter });
    
    expect(screen.getByText('GENERATE LYRICAL CAPTIONS FROM YOUR PICTURES')).toBeInTheDocument();
  });

  test('renders the typewriter text', () => {
    render(<Landing />, { wrapper: MemoryRouter });

    expect(screen.getByText('Generate exciting and creative captions for your pictures!')).toBeInTheDocument();
  });

  test('renders the sign-up and login buttons', () => {
    render(<Landing />, { wrapper: MemoryRouter });

    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('navigates to sign-up page when Sign Up button is clicked', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(<Landing />, { wrapper: MemoryRouter });

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    await userEvent.click(signUpButton);

    expect(mockNavigate).toHaveBeenCalledWith('/sign-up');
  });

  test('navigates to login page when Log In button is clicked', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(<Landing />, { wrapper: MemoryRouter });

    const loginButton = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});