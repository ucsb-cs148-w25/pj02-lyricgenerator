import React from 'react'
import { useEffect, useState } from 'react'
import Nav from '../components/Navigation/Nav';
import { useNavigate } from "react-router-dom";
import GoogleLogo from "../assets/google-logo.png"; 
import PictureLogo from "../assets/Logo.png"; 
import jwt_decode from "jwt-decode"; // Decodes Google JWT token
import axios from 'axios';  // Import axios

//require('dotenv').config();
//console.log(process.env.REACT_APP_API_KEY); // Access your environment variable
//console.log("React Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

function Login({ setUser }) { // Pass setUser from parent component
  const navigate = useNavigate();


  const [ localUser, setLocalUser ] = useState({});


  function handleCallbackresponse(response) {
    //Response is coming from documentation of google authentication services
    console.log("Encoded JWT ID token: " + response.credential);

    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    
    setLocalUser(userObject);
    setUser(userObject);
    localStorage.setItem('user', JSON.stringify(userObject));
    
    document.getElementById("signInDiv").hidden = true;
    navigate("/home"); // Redirect to home page 

  }

  function handleSignOut() {
    setLocalUser({});
    setUser(null);
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCallbackresponse
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    );
    google.accounts.id.prompt();
  }, []);

  //If we have no user: sign in button 
  //If we have a user: show the log out button

  const handleGoogleSignUp = () => {
    window.location.href = "http://localhost:5005/login"; // Redirects to Flask backend
  }
  
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
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Log In to Image2Caption</h1>
        <button>
          {/*</div>onClick={handleGoogleSignUp}>*/}
          <div id="signInDiv"></div> {/* This will render the LoginButton component */}
        </button>
        {localUser.name && (
          <div>
            <img src={localUser.picture} alt="Profile" style={{ borderRadius: "50%", width: "50px" }} />
            <h3>{localUser.name}</h3>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        )}
        
        {/* Login Link */}
        <p style={{ marginTop: "15px", fontSize: "14px", color: "#555" }}>
          Already have an account? {""}
          <a href="/sign-up" style={{ color: "black", fontWeight: "bold", textDecoration: "underline" }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login;