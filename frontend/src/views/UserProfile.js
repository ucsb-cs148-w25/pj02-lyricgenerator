import React from "react";
import "./UserProfile.css"; // Import the CSS file
import { useNavigate } from "react-router-dom"; // For navigation
import { useState } from "react";
// import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { IoMdClose } from "react-icons/io";

const UserProfile = ({ user, setUser, uploadedImages }) => {
  const navigate = useNavigate(); // Hook for handling navigation

  const [savedCaptionsClicked, setSavedCaptionsClicked] = useState(true);
  const [settingsClicked, setSettingsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser("null");
    navigate("/"); // Redirect to landing page
  };

  const savedCaptions = () => {
    setSavedCaptionsClicked(true);
    setSettingsClicked(false);
  }

  const settings = () => {
    setSettingsClicked(true);
    setSavedCaptionsClicked(false);
  }
  
  return (
    <div className="user-profile-container">
      {/* Main Profile Section */}
      <div className="profile-content">
        <div className="profile-column"> 
          <text className="profile-text">My Profile</text> 
          <div className="buttons">
            <button 
              className={savedCaptionsClicked ? 'active' : 'inactive'}
              onClick={savedCaptions}
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

          { savedCaptionsClicked &&
              <div className="image-grid">
                {[...Array(16)].map((_, index) => (
                  <div 
                  key={index} 
                  className="image-box"
                  onClick={() => setIsOpen(true)}>
                    {uploadedImages && uploadedImages[index] ? (
                      <img
                        src={uploadedImages[index]}
                        alt="Uploaded"
                        className="uploaded-image"
                      />
                    ) : (
                      <div className="image-placeholder">📷</div>
                    )}
                    { uploadedImages && uploadedImages[index] ?
                      <p>Name of image</p>
                        :
                        <div>
                          <p className="image-text">Uploaded Image {index + 1}</p>
                          <p className="saved-on-text">Saved on this date!</p>
                        </div>
                    }
                  </div>
                ))}
              </div>
            }
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

      {/* Sidebar Section - Shorter Sidebar & Log Out on Top */}
      {/* <aside className="sidebar">
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
        <h2 className="sidebar-title">My Profile</h2>
        <nav className="sidebar-nav">
          <button className="sidebar-item">Saved Captions</button>
          <button className="sidebar-item">Settings</button>
        </nav>
      </aside> */}
    </div>
  );
};


export default UserProfile;
