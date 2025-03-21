import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styling/map.css";

// Set Mapbox access token
mapboxgl.accessToken = "Api key of map box";

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapStyle, setMapStyle] = useState("streets");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.style.height = "600px";

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [77.4126, 23.2599],
      zoom: 15,
      maxZoom: 22,
      renderWorldCopies: false,
      attributionControl: false,
      trackResize: true,
      pitchWithRotate: true,
    });
    mapInstanceRef.current = map;

    // Add navigation controls
    map.addControl(
      new mapboxgl.NavigationControl({ position: "bottom-right" })
    );

    // Add scale control
    map.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: "metric",
        position: "bottom-left",
      })
    );

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 0,
      },
      trackUserLocation: true,
      showAccuracyCircle: true,
      showUserHeading: true,
      fitBoundsOptions: {
        maxZoom: 18,
      },
    });

    map.addControl(geolocateControl, "bottom-right");

    // Add event listeners for the geolocate control
    geolocateControl.on("geolocate", (position) => {
      console.log("Location updated:", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        heading: position.coords.heading,
      });
    });

    geolocateControl.on("error", (error) => {
      setError(`Location error: ${error.message}`);
      setTimeout(() => setError(null), 3000);
    });

    // Add custom style control
    map.on("load", () => {
      const styleControl = document.createElement("div");
      styleControl.className =
        "mapboxgl-ctrl mapboxgl-ctrl-group style-control";

      styleControl.innerHTML = `
        <button id="streets-style" class="style-button active" title="Streets style">Streets</button>
        <button id="satellite-style" class="style-button" title="Satellite style">Satellite</button>
        <button id="navigation-style" class="style-button" title="Navigation style">Navigation</button>
      `;

      mapRef.current.appendChild(styleControl);

      // Add event listeners to style buttons
      document.getElementById("streets-style").addEventListener("click", () => {
        map.setStyle("mapbox://styles/mapbox/streets-v11");
        setActiveStyleButton("streets-style");
        setMapStyle("streets");
      });

      document
        .getElementById("satellite-style")
        .addEventListener("click", () => {
          map.setStyle("mapbox://styles/mapbox/satellite-streets-v11");
          setActiveStyleButton("satellite-style");
          setMapStyle("satellite");
        });

      document
        .getElementById("navigation-style")
        .addEventListener("click", () => {
          map.setStyle("mapbox://styles/mapbox/navigation-day-v1");
          setActiveStyleButton("navigation-style");
          setMapStyle("navigation");
        });

      function setActiveStyleButton(id) {
        document.querySelectorAll(".style-button").forEach((button) => {
          button.classList.remove("active");
        });
        document.getElementById(id).classList.add("active");
      }

      setLoading(false);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-ref" />

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading-indicator">Loading...</div>}
    </div>
  );
};

export default Map;
