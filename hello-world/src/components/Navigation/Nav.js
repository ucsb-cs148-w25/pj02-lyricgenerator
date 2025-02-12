import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Nav.css';
import logo from '../../assets/Logo.png';
import { Link } from "react-router-dom";

export default function Nav({ user, setUser }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = () => {
    setUser(null); // Clear the user state
    navigate("/"); // Redirect to home
  }

  return (
    <nav>
      <div className='navbar-container'>
        <nav className='navbar'>
          <div className='navbar-left'>
            <img src={logo} alt='Logo' width={36} height={36}/>
            <a href='/' className='logo-text'>I2C</a>
          </div>
          
          <div className='navbar-center'>
            <a href='/about' className='center-text'>About</a>
            <a href='/contact-us' className='center-text'>Contact Us</a>
          </div>

          <div className='navbar-right'>
            {user && Object.keys(user).length !== 0 ? (
              <div className='user-profile'>
                <img 
                  src={user.picture}
                  alt='User Profile'
                  className='profile-picture'
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className='dropdown-menu show'>
                    <p class ="username">{user.name}</p>
                    <button className="sign-out-btn" onClick={handleSignOut}>Sign Out</button>
                  </div>
                )}
                </div>
            ) : (
              <button className='primary-white' onClick={() => navigate('/sign-up')}>Sign up</button>
            )}
          </div>
        </nav>
      </div>
    </nav>
  )
}