import React from 'react'
import { useState } from 'react'
import Nav from '../components/Navigation/Nav';
import './About.css';
export default function About() {
  return (
      <div className="about-container">
          {/* Navigation */}

          {/* About Us Content */}
          <div className="about-content">
              <h1 className="about-title">About Image2Caption</h1>
              <p className="about-text">
                  Have you ever captured the perfect photo but struggled to find the right caption?
                  Or wished you could match your images with the perfect song lyrics that truly express their emotion?
              </p>
              <p className="about-text">
                  <strong>Image2Caption</strong> is here to revolutionize how you caption your photos. Our innovative 
                  platform allows you to upload any image, analyzes its sentiment using AI, and finds the perfect song lyrics 
                  to match its mood. No more struggling to come up with captions—let your photos tell a story with music.
              </p>

              <h2 className="about-title">Why Use Image2Caption?</h2>
              <ul className="about-list">
                  <li>🎵 AI-powered sentiment analysis for your images</li>
                  <li>📸 Matches photos with the perfect song lyrics</li>
                  <li>💡 No more struggling to find creative captions</li>
              </ul>

              <p className="about-text">
                  Ready to elevate your social media game? <a href="/sign-up" className="about-link">Sign up today</a> and make every post unforgettable.
              </p>
          </div>
      </div>
  );
}