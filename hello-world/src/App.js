
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './views/Home';
import About from './views/About';
import ContactUs from './views/ContactUs';
import SignUp from './views/SignUp';
import Login from './views/Login';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/contact-us' element={<ContactUs />}/>
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </Router>
  );
}

export default App;
