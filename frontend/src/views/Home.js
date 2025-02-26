import React from 'react'
import { useState, useRef } from 'react'
import './Home.css';
import photo_icon from '../assets/photo_icon.png';
import { IoCloseSharp } from "react-icons/io5";
import { HiMiniSparkles } from "react-icons/hi2";
import { FaInstagram, FaTrash } from "react-icons/fa";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


export default function Home() {
  const [files, setFiles] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [caption, setCaption] = useState('');
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [dragBoxColor, setDragBoxColor] = useState('');
  const fileInput = useRef([]);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // File upload
  function handleChange(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setFileUploaded(true);
  }

  // File removed
  const handleDelete = (index) => {
    setFiles((prevFiles) => {
      const newFiles = []
      for (let i = 0; i<prevFiles.length; i++){
        if (i!== index) {
          newFiles.push(prevFiles[i]);
        }
      }
      if (newFiles.length === 0) {
        setFileUploaded(false);
        setGenerated(false);
        setFileUploaded(false);
        setGenerated(false);
        setCaption('');
        setSong('');
        setArtist('');
      }
      return newFiles;
    });
  };
  
  // For Instagram information popup
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  async function handleSubmit () {
    // alert(`Username: ${username}, Password: ${password}`);
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('Password', password);

    formData.append("Image", files[0]);
    formData.append("Caption", caption)

    try {
      const response = await fetch('http://127.0.0.1:5005/instagram', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if(response.ok) {
        alert("Posted to Instagram")
      } else {
        alert("Failed to post to Instagram");
      }
    } catch(error) {
      console.error("Error: ", error);
      alert("Failed to post to Instagram");
    }
  }
  

  // Drag and Drop
  const handleDrag = (event) => {
    event.preventDefault();
    setDragBoxColor('var(--tertiary-color');
  }

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => {
    const updateFiles = prevFiles.concat(droppedFiles);
    return updateFiles
    });
  }

  async function handleGenerate() {
    if(files.length === 0) {
      alert("Please upload at least one image first.");
      return;
    }

    const formData = new FormData();
    for (let i=0; i<files.length; i++) {
      formData.append(`images`, files[i]);
    }

    try {
      const response = await fetch('http://127.0.0.1:5005/get_top_tracks', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if(response.ok) {
        setCaption(data.caption);
        setSong(data.song);
        setArtist(data.artist);
        setGenerated(true);
      } else {
        alert(data.error || "Failed to generate caption.");
      }
    } catch(error) {
      console.error("Error: ", error);
      alert("Something went wrong. Try again later.");
    }
  }

  function copyCaption(){
    if (!caption){
      alert("No caption available to copy.")
    }
    navigator.clipboard.writeText(caption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  
  return ( 
    <div className='container'> 
      {/* <Nav /> */}
      <div className='gradient'>
        { !generated && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24
        }}>
          <text className='header'>Image2Caption</text>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 6
          }}>
            <HiMiniSparkles color='white' width={16} height={16}/>
            <text className='subheader'>Generate exciting and creative captions for your pictures!</text>
          </div>
        </div>
        )}        
        <div className={`image-upload-container ${generated ? 'hide' : ''}`}>
          {!fileUploaded && !generated && (
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
                multiple
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
          )}

        {fileUploaded && !generated && (
            <div className='uploaded-img-container'>
              {files.map((file, index) => (
                <div key = {index} className = "uploaded-file">
                    <img src={URL.createObjectURL(file)} width={36} height={36} alt="Upload" />
                    <p>{file.name}</p>
                    <IoCloseSharp
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDelete(index)}
                    />
                    </div>
        ))}
        </div>
        )}
        {!generated && (
          <button className='primary-purple btn' onClick={handleGenerate}>
            Generate!
          </button>
        )}
        </div>

        {files.length > 0 && caption && (
          <div className="polaroid-container">
            {files.map((file, index) => (
              <div key={index} className="polaroid-wrapper">
                <div className='polaroid-image-container'>
                <div className='polaroid'>
                  <img src={URL.createObjectURL(file)} alt="Uploaded preview" />
                  <p className="caption-text">"{caption}"</p>
                  <p className="song-credits">🎵 {song} by {artist}</p>
                </div>
                </div>
                <div className='button-container'>
                <button className="copy-button" onClick={copyCaption}>
                  {copied ? "Copied!" : "Copy"}
                </button>
                <Popup 
                trigger={<button className='instagram-button'> <FaInstagram/> Instagram </button>} 
                modal 
                nested
              >
                {(close) => (
                  <div className="popup-content">
                    <h2>Instagram Login Information</h2>
                    <div>
                      <label htmlFor="username">Username: </label>
                      <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={handleUsername} 
                        placeholder="Enter username" 
                      />
                    </div>
                    <div>
                      <label htmlFor="password">Password: </label>
                      <input 
                        type="text" 
                        id="password" 
                        value={password} 
                        onChange={handlePassword} 
                        placeholder="Enter password" 
                      />
                    </div>
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={close}>Close</button>
                  </div>
                )}
              </Popup>
                <button className='instagram-button'>
                  <FaInstagram/> Instagram
                </button>
                <button className='delete-button' onClick={() => handleDelete(index)}>
                  <FaTrash /> Delete
                </button>
                <button className='save-button'>
                  Save
                </button>
            </div>
            </div>
           ))}
        </div>
      )}
    </div>
    </div>
  )
}
