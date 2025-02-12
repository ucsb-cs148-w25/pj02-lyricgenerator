import React from 'react'
import { useEffect, useState } from 'react'
import Nav from '../components/Navigation/Nav';
import { useNavigate } from "react-router-dom";
import GoogleLogo from "../assets/google-logo.png"; 
import PictureLogo from "../assets/Logo.png"; 
import jwt_decode from "jwt-decode"; // Decodes Google JWT token
import axios from 'axios';  // Import axios


function SignUp() {
  //const navigate = useNavigate();

  const [ user, setUser ] = useState({});


  function handleCallbackresponse(response) {
    //Response is coming from documentation of google authentication services
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;

  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: "1076517238623-2je4umjm1f1loc4mpuqvqa4a4fkhsa9n.apps.googleusercontent.com",
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
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Sign up for Image2Caption</h1>
        <button>
          {/*</div>onClick={handleGoogleSignUp}>*/}
          <div id="signInDiv"></div> {/* This will render the LoginButton component */}
          {/* If have user attributes then have user that is signed in so have the sign up button show, button only showing up if have user that logs in*/}
          { Object.keys(user).length != 0 && 
            <button onClick={ (e) => handleSignOut(e)}>Sign Out</button>
          }
          { user && 
            <div>
              <img src={user.picture}></img>
              <h3>{user.name}</h3>
            </div>
          }
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
export default SignUp;