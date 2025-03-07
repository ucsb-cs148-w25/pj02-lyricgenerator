import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../Home';
const axios = require('axios');

jest.mock('axios');

describe('Home Component', () => {
  test('renders the upload button', () => {
    render(<Home />);
    expect(screen.getByText(/Choose from this device/i)).toBeInTheDocument();
  });

  test('handles file upload', () => {
    render(<Home />);
    const fileInput = screen.getByLabelText(/upload/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });

  test('handles drag-and-drop upload', () => {
    render(<Home />);
    const dropZone = screen.getByText(/Drag and drop an image to upload/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    });

    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });

  test('clicking Generate button triggers API call', async () => {
    axios.post.mockResolvedValue({ data: { tracks: [{ title: 'Test Song', artist: 'Test Artist', lyrics: 'Test lyrics' }] } });
    
    render(<Home />);
    const fileInput = screen.getByLabelText(/upload/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    const generateButton = screen.getByText(/Generate!/i);
    fireEvent.click(generateButton);
    
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
