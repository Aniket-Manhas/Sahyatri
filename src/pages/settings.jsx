import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import "../styling/settings.css";

const Settings = () => {
  const { user } = useContext(UserContext);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
      document.querySelectorAll("button").forEach((button) => {
        button.style.backgroundColor = "#1E1E1E";
        button.style.color = "#ffffff";
      });
      document.body.style.color = "#ffffff";
    } else {
      document.body.classList.remove("dark-mode");
      document.querySelectorAll("button").forEach((button) => {
        button.style.backgroundColor = "#ffffff";
        button.style.color = "#000000";
      });
      document.body.style.color = "#000000";
    }
  };

  return (
    <div className={`settings-container ${darkMode ? "dark-mode" : ""}`}>
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
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
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
