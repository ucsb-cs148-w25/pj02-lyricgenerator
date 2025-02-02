import React from 'react'
import { useState, useRef } from 'react'
import Nav from '../components/Navigation/Nav';
import './Home.css';
import photo_icon from '../assets/photo_icon.png';

export default function Home() {

  const [file, setFile] = useState();
  const [fileUploaded, setFileUploaded] = useState(false);
  const fileInput = useRef(null);

  function handleChange(e) {
    setFile(URL.createObjectURL(e.target.files[0]));
    setFileUploaded(true);
  }

  return (
    <div className='container'>
      <Nav />
      <div className='gradient'>
        <div className='image-upload-container'>
          <div className='image-upload'>
            <input 
              type='file' 
              style={{ display: 'none' }}
              ref={fileInput}
              onChange={handleChange}
              />

            <img src={photo_icon} width={36} height={36}></img>
            <text className='drag-text'>Drag and drop an image to generate a caption!</text>
            <text className='or-text'>or</text>
            <button 
              className='secondary btn'
              onClick={() => fileInput.current.click()}>Choose from this device</button>
            <img 
              src={file}
              width={48} 
              height={48}
              style={fileUploaded ? { display: 'block' } : { display: 'none' }}
              />

          </div>
          <button className='primary-purple btn'>Generate!</button>
        </div>
      </div>
    </div>
  )
}