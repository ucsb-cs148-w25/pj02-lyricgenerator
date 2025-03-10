import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfile from '../UserProfile'; 

// Mock `useNavigate` from `react-router-dom`
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock user data and uploaded images
const mockUser = {
  name: 'John Doe',
  picture: '/test-profile.jpg',
};

const mockImages = Array(5).fill('/test-image.jpg'); // Simulate 5 uploaded images

describe('UserProfile Component', () => {
  test('renders user profile with name and picture', () => {
    render(<UserProfile user={mockUser} uploadedImages={mockImages} />);
    
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    const profilePic = screen.getByAltText('Profile');
    expect(profilePic).toHaveAttribute('src', '/test-profile.jpg');
  });

  test('renders "Saved Captions" as default tab', () => {
    render(<UserProfile user={mockUser} uploadedImages={mockImages} />);
    expect(screen.getByRole('button', { name: /saved captions/i })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /settings/i })).toHaveClass('inactive');
  });

  test('switches to "Settings" tab when clicked', () => {
    render(<UserProfile user={mockUser} uploadedImages={mockImages} />);
    
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);

    expect(settingsButton).toHaveClass('active');
    expect(screen.getByRole('button', { name: /saved captions/i })).toHaveClass('inactive');
  });

  test('renders uploaded images correctly', () => {
    render(<UserProfile user={mockUser} uploadedImages={mockImages} />);

    const uploadedImages = screen.getAllByAltText('Uploaded');
    expect(uploadedImages.length).toBe(5); // Should match mockImages length
    uploadedImages.forEach((img, index) => {
      expect(img).toHaveAttribute('src', '/test-image.jpg');
    });
  });

  test('opens and closes image dialog when an image is clicked', () => {
    render(<UserProfile user={mockUser} uploadedImages={mockImages} />);
    
    const imageBox = screen.getAllByAltText('Uploaded')[0]; // Click the first image
    fireEvent.click(imageBox);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();

    // Close the dialog
    const closeButton = screen.getByTestId('close-dialog');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  test('calls navigate("/") when "Log out" button is clicked', () => {
    render(<UserProfile user={mockUser} uploadedImages={mockImages} />);
    
    const logoutButton = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
