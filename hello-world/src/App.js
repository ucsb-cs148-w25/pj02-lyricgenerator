import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './views/Home';
import About from './views/About';
import ContactUs from './views/ContactUs';
import SignUp from './views/SignUp';
import Login from './views/Login';
import Landing from './views/Landing';

function App() {
  return (
      <div className="App">
        <Router>
          <Routes>
            <Route path='/' element={<Landing />}/>
            <Route path='/home' element={<Home />}/>
            <Route path='/about' element={<About />}/>
            <Route path='/contact-us' element={<ContactUs />}/>
            <Route path='/sign-up' element={<SignUp />}/>
            <Route path='/login' element={<Login />}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
