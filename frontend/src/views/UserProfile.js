import React from "react";
import "./UserProfile.css"; // Import the CSS file
import { useNavigate } from "react-router-dom"; // For navigation

const UserProfile = ({ user, uploadedImages }) => {
  const navigate = useNavigate(); // Hook for handling navigation

  const handleLogout = () => {
    navigate("/"); // Redirect to landing page
  };
  
  return (
    <div className="user-profile-container">
      {/* Main Profile Section */}
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-info">
            <img 
              src={user?.picture || "/default-profile.png"} 
              alt="Profile" 
              className="profile-pic"
            />
            <h1 className="profile-name">{user?.name || "User Name"}</h1>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>

        {/* Image Grid Section - Replace Placeholders with Uploaded Images */}
        <div className="image-grid">
          {[...Array(16)].map((_, index) => (
            <div key={index} className="image-box">
              {uploadedImages && uploadedImages[index] ? (
                <img
                  src={uploadedImages[index]}
                  alt="Uploaded"
                  className="uploaded-image"
                />
              ) : (
                <div className="image-placeholder">📷</div>
              )}
              <p className="image-text">
                {uploadedImages && uploadedImages[index]
                  ? `Uploaded Image ${index + 1}`
                  : "Name of image"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Section - Shorter Sidebar & Log Out on Top */}
      <aside className="sidebar">
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
        <h2 className="sidebar-title">My Profile</h2>
        <nav className="sidebar-nav">
          <button className="sidebar-item">Saved Captions</button>
          <button className="sidebar-item">Settings</button>
        </nav>
      </aside>
    </div>
  );
};


export default UserProfile;
