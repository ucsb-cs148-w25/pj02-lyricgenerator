import React from 'react'
import { useState } from 'react';
import './Landing.css';
import Nav from '../components/Navigation/Nav';
import { HiMiniSparkles } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();
    return(
        <div className='landing-container'>
            <Nav />
            <div className='body-container'>
                <text className='header'>Image2Caption</text>
                <div className='captions'>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6
                    }}>
                        <HiMiniSparkles color='white' width={16} height={16}/>
                        <text className='subheader'>Generate exciting and creative captions for your pictures!</text>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6
                    }}>
                        <HiMiniSparkles color='white' width={16} height={16}/>
                        <text className='subheader'>Post your pictures directly to Instagram with the generated caption!</text>
                    </div>
                </div>
                <div className='auth-buttons'>
                    <button className='primary-white' onClick={() => navigate('/sign-up')}>Sign up</button>
                    <button className='ghost-button' onClick={() => navigate('/login')}>Log in</button>
                </div>
            </div>     
        </div>
    )
}