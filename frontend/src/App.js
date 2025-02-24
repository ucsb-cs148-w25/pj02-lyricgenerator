import './App.css';
import React, { useState } from 'react';
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

function App() {
  const [user, setUser] = useState(null);

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
