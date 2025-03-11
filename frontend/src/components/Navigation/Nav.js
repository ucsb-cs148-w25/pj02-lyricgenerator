import React, {useEffect} from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';

import './Nav.css';
import logo from '../../assets/Logo.png';
import { Link } from "react-router-dom";

import { RiLogoutBoxRLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

//require('dotenv').config();
//console.log(process.env.REACT_APP_API_KEY); // Access your environment variable

export default function Nav({ user, setUser }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let location = useLocation();

  // Ensure user is cleared when the app first loads
  // useEffect(() => {
  //   const storedUser = sessionStorage.getItem('user');
  //   setUser(null);
  // }, [setUser]);

  const fontColor = () => {
    switch (location.pathname) {
      case '/':
        return 'white-color';
      case '/home':
        return 'white-color';
      case '/about':
        return 'white-color';
      case '/contact-us':
        return 'white-color';
      default:
        return 'black-color';
    }
  }

  const returnRoute = () => {
    if (user) {
      return '/home';
    } else {
      return '/';
    }
  }

  const handleSignOut = () => {
    setUser(null); // Clear the user state
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/"); // Redirect to home
  }

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate("/profile"); // Redirect to profile
  }

  return (
    <nav>
      <div className='navbar-container'>
        <nav className='navbar'>
          <div className='navbar-left'>
            <img src={logo} alt='Logo' width={36} height={36}/>
            <a 
            href={`${returnRoute()}`} 
            className={`logo-text ${fontColor()}`}
            >Image2Caption</a>
          </div>
          
          <div className='navbar-center'>
            {user && Object.keys(user).length !== 0 && (
              <a href='/home'
              className={`center-text ${fontColor()}`}
              >Generate</a>
              )}
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
                  <div className='dropdown-menu'>
                    <p className="username">{user.name}</p>
                    <div className='profile-btns'>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12
                      }}>
                        <CgProfile size={18} />
                        <button className="sign-out-btn" onClick={handleProfile}>My Profile</button>
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12
                      }}>
                        <RiLogoutBoxRLine size={18} />
                        <button className="sign-out-btn" onClick={handleSignOut}>Log Out</button>
                      </div>
                    </div>
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