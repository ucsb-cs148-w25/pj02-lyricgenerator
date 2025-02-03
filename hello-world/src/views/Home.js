import React from 'react'
import { useState, useRef } from 'react'
import Nav from '../components/Navigation/Nav';
import './Home.css';
import photo_icon from '../assets/photo_icon.png';

export default function Home() {

  const [file, setFile] = useState();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [caption, setCaption] = useState('');
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const fileInput = useRef(null);

  function handleChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileUploaded(true);
    
  }

  async function handleGenerate() {
    if(!file) {
      alert("Please upload an image first");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://127.0.0.1:5005/generate', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if(response.ok) {
        setCaption(data.caption);
        setSong(data.song);
        setArtist(data.artist);
      } else {
        alert(data.error || "Failed to generate caption.");
      }
    } catch(error) {
      console.error("Error: ", error);
      alert("Something went wrong. Try again later.");
    }
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

            <img src={photo_icon} width={36} height={36} alt="Upload" />
            <text className='drag-text'>Drag and drop an image to generate a caption!</text>
            <text className='or-text'>or</text>
            <button 
              className='secondary btn'
              onClick={() => fileInput.current.click()}>
                Choose from this device
            </button>
            {/*
            <img 
              src={file}
              width={48} 
              height={48}
              style={fileUploaded ? { display: 'block' } : { display: 'none' }}
              />
            */}
            {fileUploaded && <p>Image uploaded!</p>}
          </div>
          <button className='primary-purple btn' onClick={handleGenerate}>
            Generate!
          </button>
        </div>
        {caption &&  (
          <div className="caption-container">
            <h3>Generated Caption:</h3>
            <p>"{caption}"</p>
            <h4>Song: {song} by {artist}</h4>
          </div>
        )}
      </div>
    </div>
  )
}