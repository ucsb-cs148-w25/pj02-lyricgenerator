import React from 'react'
import { useState, useRef } from 'react'
import './Home.css';
import photo_icon from '../assets/photo_icon.png';
import { IoCloseSharp } from "react-icons/io5";
import { HiMiniSparkles } from "react-icons/hi2";
import { FaInstagram, FaTrash } from "react-icons/fa";
import axios from "axios";
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
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState([]); // Stores the tracks
  const [selectedTrack, setSelectedTrack] = useState(null); // Stores the chosen track
  const [imageEncodings, setImageEncodings] = useState(null); // Store image encodings
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageEncodings(reader.result);
        setShowModal(true); // Show modal after uploading image 
      };
      reader.readAsDataURL(file);
    }
  };


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
    if (files.length === 0) {
      alert("Please upload an image first.");
      return;
    }
  
    const file = files[0]; // Restrict to only one file
  
    const formData = new FormData();
    formData.append("image", file); // Ensure correct key name
  
    try {
      setError(null);
      const response = await axios.post("http://localhost:5005/get_top_tracks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
  
      if (response.data) {
        //console.log("Received track data:", response.data);
        setTracks(response.data.tracks.map(track => ({
            title: track.title,
            artist: track.artist,
            lyrics: track.lyrics || "", // Ensure lyrics exist
        })));
        setImageEncodings(response.data.image_encodings); // Store image encodings from response

        // Show modal when tracks are available
        if (response.data.tracks.length > 0) {
          setShowModal(true);
        }
      }
    } catch (err) {
      console.error("Error generating data:", err);
      setError("Error generating data. Try again.");
    }
  }

  //const handleTrackSelect = (track) => {
  //  console.log("Selected track:", track);
  //  setShowModal(false);
  //  setImage(null); // Reset image after selection
  //};

  const handleTrackSelect = async (track) => {
      console.log("Selected track:", track);
      if (!imageEncodings) {
          console.error("Image encodings not available yet");
          //print("Image encodings not available");
          return;
      }

  
      try {
          const response = await axios.post("http://localhost:5005/get_best_lyric", {
            image_encodings: imageEncodings,
            lyrics: track.lyrics, // Ensure this variable is defined
          }, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          });
  
          if (!response.data || !response.data.best_lyric) {
            throw new Error("No best lyric found in response");
          }
          
          /*
          setSelectedTrack({
              ...track,
              relevantLyric: response.data.best_lyric, 
          });
          */
          const bestLyric = response.data?.best_lyric || "No relevant lyric found";
          setSelectedTrack({
            ...track,
            relevantLyric: bestLyric,
          });
          setCaption(bestLyric);
          setSong(track.title);
          setArtist(track.artist);
          setShowModal(false);
          setImage(null); // Reset image after selection
      } catch (error) {
          console.error("Error fetching relevant lyric:", error);
          setSelectedTrack({
              ...track,
              relevantLyric: "No relevant lyric found",
          });
      }
  };

  function copyCaption() {
    if(!caption) {
      alert("No caption available to copy.");
      return;
    }
    navigator.clipboard.writeText(caption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function copyCaption(){
    if (!caption){
      alert("No caption available to copy.")
      return;
    }
    navigator.clipboard.writeText(caption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  async function handlePostWithLogin () {
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('Password', password);

    formData.append("Image", files[0]);
    formData.append("Caption", caption)

    try {
      const response = await fetch('http://127.0.0.1:5005/instagram-post-with-login', {
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
  };

  async function handleSaveLogin () {
    const formData = new FormData();
    formData.append('Username', username);
    formData.append('Password', password);

    try {
      const response = await fetch('http://127.0.0.1:5005/instagram-save-login', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if(response.ok) {
        alert("Saved Instagram Login")
      } else {
        alert("Failed to save Instagram login");
      }
    } catch(error) {
      console.error("Error: ", error);
      alert("Failed to save Instagram login");
    }
  };

  async function handlePostFromSaved () {
    const formData = new FormData();
    formData.append("Image", files[0]);
    formData.append("Caption", caption)

    try {
      const response = await fetch('http://127.0.0.1:5005/instagram-post-from-saved-login', {
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        {showModal && (
            <div className="modal-overlay">
                <div className="modal">
                    <h2>Select a Track</h2>
                    {tracks.length > 0 ? (
                        tracks.map((track, index) => (
                          <button key={index} onClick={() => handleTrackSelect(track)}>
                            {track.title} - {track.artist}
                          </button>
                        ))
                    ) : (
                        <p>No tracks available</p>
                    )}
                    <button className="close-modal" onClick={() => setShowModal(false)}>Close</button>
                </div>
            </div>
        )}

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
                  
                >
                  {(close) => (
                    <div className="ig-popup">
                      <p className="ig-header">Instagram Login Information</p>
                      <div className="input-group">
                        <label htmlFor="username">Username: </label>
                        <input 
                          type="text" 
                          id="username" 
                          value={username} 
                          onChange={handleUsername} 
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="password">Password: </label>
                        <input 
                          type="password" 
                          id="password" 
                          value={password} 
                          onChange={handlePassword} 
                        />
                      </div>
                      <div className="button-group">
                        <button className="general-button" onClick={handlePostWithLogin}>Post</button>
                        <button className="general-button" onClick={handleSaveLogin}>Save Login Info</button>
                        <button className="general-button" onClick={handlePostFromSaved}>Post with Saved Login</button>
                        <button className="close-button" onClick={close}>Close</button>
                      </div>
                    </div>
                  )}
                </Popup>
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
