import React from "react";
import "./UserProfile.css"; // Import the CSS file
import { useNavigate } from "react-router-dom"; // For navigation
import { useEffect, useState } from "react";
// import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { IoMdClose } from "react-icons/io";
import axios from 'axios';

const UserProfile = ({ user, setUser, uploadedImages }) => {
  const navigate = useNavigate(); // Hook for handling navigation

  const [savedCaptionsClicked, setSavedCaptionsClicked] = useState(true);
  const [settingsClicked, setSettingsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [savedCaptions, setSavedCaptions] = useState([]); // State to hold the saved captions and images
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (item) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser("null");
    navigate("/"); // Redirect to landing page
  };

  // Toggle between "Saved Captions" and "Settings"
  const savedCaptionsHandler = () => {
    setSavedCaptionsClicked(true);
    setSettingsClicked(false);
  }

  const settings = () => {
    setSettingsClicked(true);
    setSavedCaptionsClicked(false);
  }

  // Fetch saved captions and images
  // Fetch saved captions and images
  useEffect(() => {
    async function fetchSavedCaptions() {
      if (!user) return;
      try {
        const response = await axios.get(`https://lyrics-backend.dokku-02.cs.ucsb.edu/get_saved_captions/${user.name}`, { withCredentials: true });
        //console.log("API Response:", response.data); // Debugging
        //const data = await response.json();
        //setSavedCaptions(data); // Data contains image in base64 format

        if (Array.isArray(response.data)) {
          setSavedCaptions(response.data); // Update state with fetched captions
        } else {
          console.error("Unexpected response format:", response.data);
          setSavedCaptions([]);
        }

        /*
        if (response.data && typeof response.data === "object") {
          setSavedCaptions([response.data]); // Convert object to array
        } else {
          console.error("Unexpected response format:", response.data);
          setSavedCaptions([]); // Ensure state is always an array
        }
        */
      } catch (error) {
        console.error("Error fetching saved captions:", error);
      }
    }
    fetchSavedCaptions();
  }, [user]);

  // Function to handle saving new image + caption (this will be triggered after upload)
  const saveCaption = (imageUrl, caption) => {
    const newCaption = { imageUrl, caption };
    const updatedCaptions = [...savedCaptions, newCaption];

    // Save to state
    setSavedCaptions(updatedCaptions);

    // Optionally, save to localStorage (or your storage system)
    localStorage.setItem("savedCaptions", JSON.stringify(updatedCaptions));
  };

  console.log("Saved captions: ", savedCaptions);


  return (
    <div className="user-profile-container">
      {/* Main Profile Section */}
      <div className="profile-content">
        <div className="profile-column"> 
          <text className="profile-text">My Profile</text> 
          <div className="buttons">
            <button 
              className={savedCaptionsClicked ? 'active' : 'inactive'}
              onClick={savedCaptionsHandler}
              >Saved Captions</button>
            <button 
            className={settingsClicked ? 'active' : 'inactive'}
            onClick={settings}
            >Settings</button>
          </div>
          <button 
          className="logout" 
          onClick={handleLogout}>Log out</button>
        </div> 

        <div className="profile">
          <div className="profile-header">
            <div className="profile-info">
              <img 
                src={user?.picture || "/default-profile.png"} 
                alt="Profile" 
                className="profile-pic"
              />
              <h1 className="profile-name">{user?.name || "User Name"}</h1>
            </div>
            <button className="primary-purple">Edit Profile</button>
          </div>

          {/* Display saved captions and images */}
          <div className="profile-container">
            <h2>My Profile</h2>
            <div className="image-grid">
              {/* Render saved images and captions */}
              {savedCaptions.map((item, index) => (
                <div key={index} className="image-card" onClick={() => openModal(item)}>
                  {/* Ensure image is displayed correctly using Base64 */}
                  {item.image_base64 ? (
                    <img
                      src={`data:image/png;base64,${item.image_base64}`} 
                      alt={`Uploaded ${index + 1}`}
                      className="uploaded-image"
                    />
                  ) : (
                    <div className="image-placeholder">📷 Image not available</div>
                  )}

                  {/* Ensure caption, song, and artist display properly */}
                  <p className="caption-text">{item.caption || "No caption available"}</p>
                  <p className="artist-text">🎵 {item.song} by {item.artist}</p>
                </div>
              ))}

              {/* Render placeholders for remaining slots */}
              {Array.from({ length: Math.max(0, 15 - savedCaptions.length) }).map((_, index) => (
                <div key={index + savedCaptions.length} className="image-card placeholder">
                  <div className="image-placeholder">📷</div>
                  <p className="caption-text">No image uploaded</p>
                </div>
              ))}
            </div>
            {/* Modal Component */}
            {selectedImage && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="close-button" onClick={closeModal}>×</button>
                  <img 
                    src={`data:image/png;base64,${selectedImage.image_base64}`} 
                    alt="Enlarged View" 
                    className="modal-image"
                  />
                  <p className="modal-caption">{selectedImage.caption}</p>
                  <p className="modal-artist">🎵 {selectedImage.song} by {selectedImage.artist}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        { isOpen && 
          <div 
          className='dialog'>
            <IoMdClose 
            width={16} 
            height={16} 
            onClick={() => setIsOpen(false)}
            style={{
              justifyContent: "flex-end"
            }}
            />
          </div>
        }
      </div>
    </div>
  );
};


export default UserProfile;
