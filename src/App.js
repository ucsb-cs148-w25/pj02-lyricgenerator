import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [noun, setNoun] = useState('Sanjana');

  const changeNoun = () => {
    setNoun('World');
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello {noun}!
        </p>
        <button onClick={changeNoun}>Change Noun</button>
      </header>
    </div>
  );
}

export default App;
