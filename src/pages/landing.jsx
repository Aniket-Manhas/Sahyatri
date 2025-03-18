import React from "react";
import { useNavigate } from "react-router-dom";
import "../styling/landing.css";
import LandingMap from "../component/station.png";

const LandingPage = () => {
  const navigate = useNavigate();

  // Navigation items for the grid
  const navItems = [
    { name: "Home", icon: "fa-solid fa-home", path: "/" },
    { name: "Platform", icon: "fa-solid fa-ticket", path: "/platform" },
    { name: "Book a Ride", icon: "fa-solid fa-book", path: "/book-ride" },
    { name: "Live Maps", icon: "fa-solid fa-map-location-dot", path: "/map" },
    { name: "Waiting Room", icon: "fa-solid fa-clock", path: "/waiting-room" },
    {
      name: "Route Planner",
      icon: "fa-solid fa-route",
      path: "/route-planner",
    },
    { name: "Ticket Gate", icon: "fa-solid fa-qrcode", path: "/ticket-gates" },
  ];

  return (
    <div className="landing-wrapper">
      <div className="landing-container">
        <div className="landing-grid-section">
          <h2>Train Navigation Services</h2>
          <div className="nav-grid">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="grid-item"
                onClick={() => navigate(item.path)}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="landing-info-section">
          <div className="station-map">
            <h3>Station Map</h3>
            <div className="map-container">
              <img src={LandingMap} alt="Station Map View" />
            </div>
          </div>
        </div>
      </div>

      <div className="welcome-section">
        <div className="info-box">
          <h2>Welcome to Train Navigation</h2>
          <p>
            Your ultimate companion for all railway travel needs. Get real-time
            updates, book tickets, and navigate through stations with ease.
          </p>
          <ul>
            <li>Real-time train status and platform information</li>
            <li>Interactive station maps</li>
            <li>Personalized travel recommendations</li>
          </ul>
          <button
            className="info-button"
            onClick={() => navigate("/book-ride")}
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
