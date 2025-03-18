import React, { useContext } from 'react';
import { UserContext } from '../App';
import '../styling/settings.css';

const Settings = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      {user && (
        <div className="user-profile-section">
          <img src={user.picture} alt={user.name} className="profile-image" />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
      
      <div className="settings-section">
        <h3>App Settings</h3>
        <div className="setting-item">
          <span>Dark Mode</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="setting-item">
          <span>Notifications</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="setting-item">
          <span>Location Services</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Account Settings</h3>
        <button className="settings-button">Change Password</button>
        <button className="settings-button">Privacy Settings</button>
        <button className="settings-button danger">Delete Account</button>
      </div>
    </div>
  );
};

export default Settings; 