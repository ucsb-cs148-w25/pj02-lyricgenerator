import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../About';

// Mock the Nav component since we're only testing the About component
jest.mock('../../components/Navigation/Nav', () => {
  return function MockNav() {
    return <div data-testid="mock-nav">Navigation</div>;
  };
});

describe('About Component', () => {
  beforeEach(() => {
    // Render the component before each test
    render(<About />);
  });

  test('renders the main heading', () => {
    const headingElement = screen.getByText(/About Image2Caption/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the intro paragraph', () => {
    const introParagraph = screen.getByText(/Have you ever captured the perfect photo/i);
    expect(introParagraph).toBeInTheDocument();
  });

  test('renders the description paragraph', () => {
    const descriptionParagraph = screen.getByText(/is here to revolutionize/i);
    expect(descriptionParagraph).toBeInTheDocument();
  });

  test('renders the "Why Use Image2Caption?" section', () => {
    const sectionHeading = screen.getByText(/Why Use Image2Caption\?/i);
    expect(sectionHeading).toBeInTheDocument();
  });

  test('renders the benefits list with 3 items', () => {
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    
    expect(screen.getByText(/AI-powered sentiment analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Matches photos with the perfect song lyrics/i)).toBeInTheDocument();
    expect(screen.getByText(/No more struggling to find creative captions/i)).toBeInTheDocument();
  });

  test('renders the call-to-action with correct link', () => {
    const ctaText = screen.getByText(/Ready to elevate your social media game?/i);
    expect(ctaText).toBeInTheDocument();
    
    const signUpLink = screen.getByText(/Sign up today/i);
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });

  test('applies the correct CSS classes', () => {
    const container = screen.getByText(/About Image2Caption/i).closest('div');
    expect(container).toHaveClass('about-content');

    const mainContainer = container.parentElement;
    expect(mainContainer).toHaveClass('about-container');
  });
});