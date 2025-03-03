import React from 'react'
import { useState, useRef } from 'react'
import './Home.css';
import photo_icon from '../assets/photo_icon.png';
import { IoCloseSharp } from "react-icons/io5";
import { HiMiniSparkles } from "react-icons/hi2";
import { FaInstagram, FaTrash } from "react-icons/fa";
import axios from "axios";


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
  const [imageEncoding, setImageEncoding] = useState([]); // stores the image encodings array

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
        setFileUploaded(false);setGenerated(false);
        setFileUploaded(false);
        setGenerated(false);
        setCaption('');
        setSong('');
        setArtist('');
        setSelectedTrack(null)
        setTracks([])
        setImageEncoding([])
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
    if (droppedFiles.length > 0) {
      setFiles((prevFiles) => prevFiles.concat(droppedFiles));
      setFileUploaded(true)
    }
    setDragBoxColor('white');
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
        setTracks(response.data.tracks);
        setImageEncoding(response.image_encodings); // need this variable to store the image as an array of numbers (will be sent back to the backend)
      }
    } catch (err) {
      console.error("Error generating data:", err);
      setError("Error generating data. Try again.");
    }
  }

  const handleTrackClick = (track) => {
    setSelectedTrack(track);
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
        {selectedTrack ? (
            <div className="generated-caption">
                <p>Generated Caption:</p>
                <h2>"{selectedTrack.lyrics[0]}"</h2>
                <p>from <strong>{selectedTrack.title}</strong> by <strong>{selectedTrack.artist}</strong></p>
            </div>
        ) : (
            <div className="track-list">
                {tracks.map((track, index) => (
                    <button key={index} className="track-button" onClick={() => handleTrackClick(track)}>
                        {track.title} - {track.artist}
                        <br />
                        <span className="quote">"{track.lyrics[0]}"</span>
                    </button>
                ))}
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