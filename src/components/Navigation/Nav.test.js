import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Correct way to use MemoryRouter
import Nav from './Nav';
import { jest } from '@jest/globals';

const MemoryRouter = require("react-router-dom").MemoryRouter;

describe('Nav Component', () => {
  
  // Mock user object for signed-in state
  const mockUser = {
    name: 'John Doe',
    picture: 'https://example.com/profile.jpg',
  };

  // Mock setUser function to simulate state change
  const mockSetUser = jest.fn();

  test('renders the Nav component', () => {
    render(
      <MemoryRouter>
        <Nav user={mockUser} setUser={mockSetUser} />
      </MemoryRouter>
    );

    // Check if logo, navigation links, and profile picture are visible
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('shows dropdown menu when user profile picture is clicked', () => {
    render(
      <MemoryRouter>
        <Nav user={mockUser} setUser={mockSetUser} />
      </MemoryRouter>
    );

    // Click on the user profile picture
    fireEvent.click(screen.getByAltText('User Profile'));

    // Check if the dropdown menu appears
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  test('calls handleSignOut when "Sign Out" button is clicked', () => {
    render(
      <MemoryRouter>
        <Nav user={mockUser} setUser={mockSetUser} />
      </MemoryRouter>
    );

    // Simulate user clicking the profile picture to open the dropdown
    fireEvent.click(screen.getByAltText('User Profile'));

    // Simulate click on "Sign Out" button
    fireEvent.click(screen.getByText('Sign Out'));

    // Check if setUser is called (sign out should reset the user)
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });

  test('renders "Sign up" button when user is not signed in', () => {
    render(
      <MemoryRouter>
        <Nav user={null} setUser={mockSetUser} />
      </MemoryRouter>
    );

    // Check if the "Sign up" button is rendered
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
});
