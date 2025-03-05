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
  const [imageEncodings, setImageEncodings] = useState(null); // Store image encodings
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [fileIndex, setFileIndex] = useState(0);

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
      const newFiles = [];
      for (let i = 0; i < prevFiles.length; i++){
        if (i !== index) {
          newFiles.push(prevFiles[i]);
        }
      }
      if (newFiles.length === 0) {
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
    setFileUploaded(true);
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
    setShowModal(false);
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
    });
  }

  function copyCaption(){
    if (!caption){
      alert("No caption available to copy.")
      return;
    }
    navigator.clipboard.writeText(caption).then(() => {
      setCopied(true);
    });
  }
  
  return ( 
    <div className='container'> 
      {/* <Nav /> */}
      <div className='gradient'>
        { !generated && caption === '' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 24,
          width: '30%'
        }}>
          <text className='header'>Image2Caption</text>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 6
          }}>
            <HiMiniSparkles color='white' width={16} height={16}/>
            <text className='subheader'>Upload an image to generate a caption!</text>
          </div>
        </div>
        )}        
        { caption === '' &&
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
                <img src={photo_icon} width={48} height={48} alt="Upload" />
                <text className='drag-text'>Drag and drop an image to upload</text>
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
                      <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '16px'
                      }}
                      >
                        <img src={URL.createObjectURL(file)} width={36} height={36} alt="Upload" />
                        <p>{file.name}</p>
                      </div>
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
        }
        {error && <p style={{ color: "red" }}>{error}</p>}

        {showModal && (
            <div className="modal-overlay">
                <div className="modal">
                    <h2>Almost there! Select a track to get your caption.</h2>
                    <div className='track-buttons'>
                      {tracks.length > 0 ? (
                          tracks.map((track, index) => (
                            <button
                            className={track === selectedTrack ? 'track-button isactive' : 'track-button'}
                            key={index} 
                            onClick={() => setSelectedTrack(track)}>
                              "{track.title}" by {track.artist}
                            </button>
                          ))
                      ) : (
                          <p>No tracks available</p>
                      )}
                    </div>
                    <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: "100%",
                      gap: '32px'

                    }}
                    >
                      <button 
                      className="secondary" 
                      style={{
                        width: '50%'
                      }}
                      onClick={() => setShowModal(false)}>Cancel</button>
                      <button 
                      className="primary-purple" 
                      style={{
                        width: '50%',
                        boxShadow: 'none'
                      }}
                      onClick={() => handleTrackSelect(selectedTrack)}>Generate!</button>
                    </div>
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
                  <p
                  style={{
                    fontSize: 'var(--font-size-h4)',
                    color: 'white',
                    fontFamily: 'Akatab-Bold'
                  }}
                  >Your caption has been generated!</p>
                  <button className="primary-purple button-width" onClick={copyCaption}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button className='primary-purple button-width'>
                    <FaInstagram/> Post to Instagram
                  </button>
                  <button className='primary-purple button-width'>Save</button>
                  <p style={{
                    fontFamily: "Akatab-Bold",
                    color: 'white'
                  }}>or</p>
                  <button className='primary-white button-width' onClick={() => handleDelete(index)}>Generate a new caption</button>
                </div>
            </div>
           ))}
        </div>
      )}
    </div>
    </div>
  )
}
