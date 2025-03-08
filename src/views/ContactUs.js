import React, { useState } from 'react';
// import Nav from '../components/Navigation/Nav';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaStar } from 'react-icons/fa'; // Import icons
import './ContactUs.css';

export default function ContactUs() {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 1
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(contactData);
    setSubmitted(true);
  };

  const handleRatingClick = (index) => {
    setContactData((prevData) => ({ ...prevData, rating: index + 1 }));
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        {/* Left Side - Contact Info */}
        <div className="contact-info">
          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <p>1234 Lyrics Generator, CA</p>
          </div>
          <div className="info-item">
            <FaEnvelope className="icon" />
            <p>contact@lyricsgenerator.com</p>
          </div>
          <div className="info-item">
            <FaPhone className="icon" />
            <p>(123)-456-7890</p>
          </div>
        </div>

        {/* Right Side - Form */}
        {submitted ? (
          <div className="thank-you-message">
            <h3>Thank You!</h3>
            <p>Your feedback is valuable to us. We appreciate your time!</p>
          </div>
        ) : (
          <div className="form-wrapper">
            <h2>Give Us Your Thoughts!</h2>
            <form onSubmit={handleSubmit}>
              <label>Name:</label>
              <input type="text" name="name" value={contactData.name} onChange={handleChange} required />

              <label>Email:</label>
              <input type="email" name="email" value={contactData.email} onChange={handleChange} required />

              <label>Message:</label>
              <textarea name="message" value={contactData.message} onChange={handleChange} required></textarea>

              <label>Rate the App:</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <FaStar
                    key={index}
                    size={24}
                    color={contactData.rating > index ? "#FFA500" : "#D3D3D3"}
                    onClick={() => handleRatingClick(index)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>

              <button className="primary-purple"><label>Submit</label></button>
            </form>
          </div>
          )
        }
      </div>
    </div>
  );
}
