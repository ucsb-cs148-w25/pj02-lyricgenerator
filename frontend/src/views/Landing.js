import React from 'react'
import { useState } from 'react';
import './Landing.css';
import Nav from '../components/Navigation/Nav';
import { HiMiniSparkles } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png'
import { Typewriter } from "react-simple-typewriter";

export default function Landing() {
    const navigate = useNavigate();
    return(
        <div className='landing-container'>
            {/*<Nav />*/}
            <div className='body-container'>
                <div className='logo-container'>
                    <img src={logo} alt='Logo' width={128} height={128} className='logo'/>
                    <text className='header gradient-text'>Convert your images into lyrical captions</text>
                </div>
                <div className='captions'>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6
                    }}>
                        <HiMiniSparkles color='white' width={36} height={36}/>
                        <span className='subheader'>
                            <Typewriter
                                words={["Generate exciting and creative captions for your pictures!", "Post your pictures directly to Instagram with the generated caption!", "Save your captions and images to regenerate later!"]}
                                loop={false}
                                cursor
                                cursorStyle="_"
                                typeSpeed={50}
                                deleteSpeed={50}
                                delaySpeed={1000}
                            />
                        </span>
                        {/* <text className='subheader'>Generate exciting and creative captions for your pictures!</text> */}
                    </div>
                    {/* <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6
                    }}>
                        <HiMiniSparkles color='white' width={16} height={16}/>
                        <text className='subheader'>Post your pictures directly to Instagram with the generated caption!</text>
                    </div> */}
                </div>
                <div className='auth-buttons'>
                    <button className='primary-white' onClick={() => navigate('/sign-up')}>Sign up</button>
                    <button className='ghost-button' onClick={() => navigate('/login')}>Log in</button>
                </div>
            </div>     
        </div>
    )
}