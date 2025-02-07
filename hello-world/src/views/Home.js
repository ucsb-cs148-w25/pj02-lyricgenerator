import React from 'react'
import { useState, useRef } from 'react'
import Nav from '../components/Navigation/Nav';
import './Home.css';
import photo_icon from '../assets/photo_icon.png';
import { IoCloseSharp } from "react-icons/io5";
import { HiMiniSparkles } from "react-icons/hi2";
import { useDropzone } from "react-dropzone";

export default function Home() {

  const [file, setFile] = useState();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [caption, setCaption] = useState('');
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [dragBoxColor, setDragBoxColor] = useState('');
  // const [hovering, setHovering] = useState(false);
  const fileInput = useRef(null);


  // File upload
  function handleChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileUploaded(true);
  }

  // File removed
  const handleDelete = () => {
    setFileUploaded(false);
    setFile(null);
  } 

  // Drag and Drop
  const handleDrag = (event) => {
    event.preventDefault();
    setDragBoxColor('var(--tertiary-color');
  }

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24
        }}>
          <text className='header'>Image2Caption</text>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6
          }}>
            <HiMiniSparkles color='white' width={16} height={16}/>
            <text className='subheader'>Generate exciting and creative captions for your pictures!</text>
          </div>
        </div>

        <div className='image-upload-container'>
          {!fileUploaded && 
            <div 
            className='image-upload' 
            onDragOver={handleDrag} 
            onDragEnter={() => setDragBoxColor('var(--tertiary-color')}
            onDragLeave={() => setDragBoxColor('white')}
            onDrop={handleDrop}
            style={{ backgroundColor: `${dragBoxColor}` }}
            >
              <input 
                type='file' 
                hidden
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
            </div>
          }

          {fileUploaded && 
              <div className='uploaded-img-container'>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 12,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <img src={URL.createObjectURL(file)} width={36} height={36} />
                  <p>{file.name}</p>
                </div>
                <IoCloseSharp 
                  style={{ cursor: 'pointer' }}
                  onClick={handleDelete}/>
              </div>
          }

          <button className='primary-purple btn' onClick={handleGenerate}>
            Generate!
          </button>
        </div>
      </div>
      {caption &&  (
        <div className="caption-container">
          <h3>Generated Caption:</h3>
          <p>"{caption}"</p>
          <h4>Song: {song} by {artist}</h4>
        </div>
      )}
    </div>
  )
}