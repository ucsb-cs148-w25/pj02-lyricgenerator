import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import './Nav.css';
import logo from '../../assets/Logo.png';
import { Link } from "react-router-dom";

//require('dotenv').config();
//console.log(process.env.REACT_APP_API_KEY); // Access your environment variable

export default function Nav({ user, setUser }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let location = useLocation();

  const fontColor = () => {
    switch (location.pathname) {
      case '/':
        return 'white-color';
      case '/home':
        return 'white-color';
      default:
        return 'black-color';
    }

  }

  const handleSignOut = () => {
    setUser(null); // Clear the user state
    navigate("/"); // Redirect to home
  }

  const handleProfile = () => {
    navigate("/profile"); // Redirect to profile
  }

  return (
    <nav>
      <div className='navbar-container'>
        <nav className='navbar'>
          <div className='navbar-left'>
            <img src={logo} alt='Logo' width={36} height={36}/>
            <a 
            href='/' 
            className={`logo-text ${fontColor()}`}
            >Image2Caption</a>
          </div>
          
          <div className='navbar-center'>
            <a 
            href='/about' 
            className={`center-text ${fontColor()}`}
            >About</a>
            <a 
            href='/contact-us'
            className={`center-text ${fontColor()}`}
            >Contact Us</a>
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
                    <button className="sign-out-btn" onClick={handleProfile}> Profile </button>
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