import React from 'react';
import { Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './Login'; 


function Main() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default Main;