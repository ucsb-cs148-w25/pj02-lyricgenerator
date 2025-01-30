import React from 'react'
import { useState } from 'react'
import Nav from '../components/Navigation/Nav';
import { useNavigate } from "react-router-dom";
import GoogleLogo from "../assets/google-logo.png"; 
import PictureLogo from "../assets/Logo.png"; 

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        textAlign: "center",
      }}
    >
      {/* Header with Logo */}
      <div style={{ marginBottom: "20px" }}>
        <img 
          src={PictureLogo}
          alt="App Logo"
          style={{ width: "50px", height: "50px" }} // Adjust size as needed
        />
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Sign up for Image2Caption</h1>
        
        {/*Google sign up button (no functionality yet) */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid gray",
            padding: "12px 24px",
            borderRadius: "8px",
            background: "transparent",
            width: "100%",
            cursor: "pointer",
          }}
        >
          <img src={GoogleLogo} alt="Google" style={{ width: "24px", height: "24px", marginRight: "8px" }} className="mr-2" />
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>Sign up with Google</span>
        </button>

        {/* Login Link */}
        <p style={{ marginTop: "15px", fontSize: "14px", color: "#555" }}>
          Already have an account? {""}
          <a href="/login" style={{ color: "black", fontWeight: "bold", textDecoration: "underline" }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}