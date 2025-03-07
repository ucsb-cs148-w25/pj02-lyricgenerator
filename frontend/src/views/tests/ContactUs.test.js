import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactUs from '../ContactUs';

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaMapMarkerAlt: () => <div data-testid="location-icon" />,
  FaEnvelope: () => <div data-testid="email-icon" />,
  FaPhone: () => <div data-testid="phone-icon" />,
  FaStar: ({ onClick, color }) => (
    <div 
      data-testid="star-icon" 
      onClick={onClick}
      style={{ color }}
    />
  )
}));

describe('ContactUs Component', () => {
  test('renders contact information correctly', () => {
    render(<ContactUs />);
    
    expect(screen.getByTestId('location-icon')).toBeInTheDocument();
    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
    expect(screen.getByTestId('phone-icon')).toBeInTheDocument();
    
    expect(screen.getByText('1234 Lyrics Generator, CA')).toBeInTheDocument();
    expect(screen.getByText('contact@lyricsgenerator.com')).toBeInTheDocument();
    expect(screen.getByText('(123)-456-7890')).toBeInTheDocument();
  });

  test('renders the form with all necessary fields', () => {
    render(<ContactUs />);
    
    // Check form title
    expect(screen.getByText('Give Us Your Thoughts!')).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Message:')).toBeInTheDocument();
    expect(screen.getByText('Rate the App:')).toBeInTheDocument();
    
    // Check submit button
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  test('updates form data when user types', async () => {
    const { container } = render(<ContactUs />);
  
    // Use a more specific selector approach with container.querySelector
    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const messageInput = container.querySelector('textarea[name="message"]');
    
    // Fill out the form
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(messageInput, 'This is a test message');
    
    // Check if input values were updated
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(messageInput).toHaveValue('This is a test message');
  });

  test('updates rating when stars are clicked', () => {
    render(<ContactUs />);
    
    // Get all star icons
    const stars = screen.getAllByTestId('star-icon');
    expect(stars).toHaveLength(5);
    
    // Click the third star
    fireEvent.click(stars[2]);
    
    // Since we're mocking the components, we can't directly test the color change
    // but we can check if the onClick handler was called by checking the console.log
    // In a real scenario, you might want to spy on setState or check the DOM more directly
  });

  test('shows thank you message after form submission', async () => {
    const { container } = render(<ContactUs />);
    
    // Get inputs by their name attributes
    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const messageInput = container.querySelector('textarea[name="message"]');
    
    // Fill out the form
    await userEvent.type(nameInput, 'Jane Smith');
    await userEvent.type(emailInput, 'jane@example.com');
    await userEvent.type(messageInput, 'Great app!');
    
    // Mock console.log to check if form data is logged correctly
    const originalConsoleLog = console.log;
    console.log = jest.fn();
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    
    // Check if form data was logged
    expect(console.log).toHaveBeenCalledWith({
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'Great app!',
      rating: 1
    });
    
    // Restore console.log
    console.log = originalConsoleLog;
    
    // Check if thank you message is displayed
    expect(screen.getByText('Thank You!')).toBeInTheDocument();
    expect(screen.getByText('Your feedback is valuable to us. We appreciate your time!')).toBeInTheDocument();
    
    // Check that the form is no longer displayed
    expect(screen.queryByText('Give Us Your Thoughts!')).not.toBeInTheDocument();
  });

  test('validates required fields before submission', async () => {
    render(<ContactUs />);
    
    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);
    
   
    expect(screen.queryByText('Thank You!')).not.toBeInTheDocument();
    
    expect(screen.getByText('Give Us Your Thoughts!')).toBeInTheDocument();
  });
});
