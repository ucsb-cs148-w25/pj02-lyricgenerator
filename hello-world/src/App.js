import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Navigation/Nav";
import Home from './views/Home';
import About from './views/About';
import ContactUs from './views/ContactUs';
import SignUp from './views/SignUp';
import Login from './views/Login';


//require('dotenv').config();
console.log(process.env.REACT_APP_API_KEY); // Access your environment variable

function App() {
  const [user, setUser] = useState(null);

  return (
      <div className="App">
        <Router>
          {/* Pass the user state to Nav so it can display the profile picture */}
          <Nav user={user} setUser={setUser}/>
          <Routes>
            <Route path='/' element={<Home user={user}/>}/>
            <Route path='/about' element={<About />}/>
            <Route path='/contact-us' element={<ContactUs />}/>
            <Route path='/sign-up' element={<SignUp setUser={setUser} />}/>
            <Route path='/login' element={<Login setUser={setUser}/>}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
