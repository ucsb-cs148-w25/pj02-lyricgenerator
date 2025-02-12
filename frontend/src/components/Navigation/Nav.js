import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Nav.css';
import logo from '../../assets/Logo.png';

export default function Nav() {

  const navigate = useNavigate();

  return (
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
          <button className='primary-white' onClick={() => navigate('/sign-up')}>Sign up</button>
        </div>
      </nav>
    </div>
  )
}