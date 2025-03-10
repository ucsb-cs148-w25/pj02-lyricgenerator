import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Navigation/Nav";
import Home from './views/Home';
import About from './views/About';
import ContactUs from './views/ContactUs';
import SignUp from './views/SignUp';
import Login from './views/Login';
import Landing from './views/Landing';
import UserProfile from './views/UserProfile';


//require('dotenv').config();
//console.log(process.env.REACT_APP_API_KEY); // Access your environment variable

// localStorage is the browser's database. 
// The data is stored inside your browser in your computer's memory.
// localStorage is specific to an origin. 
// In other words, the localStorage for one website cannot be accessed by another.

function App() {
  const [user, setUser] = useState(null);

  {/*}
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser)
    }
  }, []);
  */}

  // Ensure the user is logged out at the start of every session
  useEffect(() => {
    sessionStorage.removeItem('user'); // Clear user session on app load
    setUser(null); // Reset user state
  }, []);

  return (
      <div className="App">
        <Router>
          {/* Pass the user state to Nav so it can display the profile picture */}
          <Nav user={user} setUser={setUser}/>
          <Routes>
            <Route path='/' element={<Landing />}/>
            <Route path='/home' element={<Home user={user}/>}/>
            <Route path='/about' element={<About user={user}/>}/>
            <Route path='/contact-us' element={<ContactUs user={user}/>}/>
            <Route path='/sign-up' element={<SignUp setUser={setUser} />}/>
            <Route path='/login' element={<Login setUser={setUser}/>}/>
            <Route path='/profile' element={<UserProfile user={user}/>}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
