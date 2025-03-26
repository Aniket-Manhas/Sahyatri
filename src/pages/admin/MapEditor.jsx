import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import { useTheme } from '../../context/ThemeContext';

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    }
  });
  return null;
}

export default function MapEditor() {
  const { darkMode } = useTheme();
  const [points, setPoints] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [currentPlatform, setCurrentPlatform] = useState({ name: '', points: [] });
  const [isCreatingPlatform, setIsCreatingPlatform] = useState(false);
  
  // Choose tile layer based on theme
  const tileLayer = darkMode 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  const handleMapClick = (latlng) => {
    if (isCreatingPlatform) {
      setCurrentPlatform(prev => ({
        ...prev,
        points: [...prev.points, [latlng.lat, latlng.lng]]
      }));
    }
  };
  
  const startCreatingPlatform = () => {
    setIsCreatingPlatform(true);
    setCurrentPlatform({ name: `Platform ${platforms.length + 1}`, points: [] });
  };
  
  const finishPlatform = () => {
    if (currentPlatform.points.length >= 3) {
      setPlatforms([...platforms, { 
        id: Date.now(), 
        name: currentPlatform.name, 
        coordinates: currentPlatform.points 
      }]);
      setIsCreatingPlatform(false);
      setCurrentPlatform({ name: '', points: [] });
    } else {
      alert('A platform needs at least 3 points to form a polygon');
    }
  };
  
  const cancelPlatform = () => {
    setIsCreatingPlatform(false);
    setCurrentPlatform({ name: '', points: [] });
  };
  
  const platformColors = [
    "#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c"
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Map Editor</h1>
      <p className="text-text-secondary mb-6">Create and edit station maps</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="map-wrapper rounded-lg overflow-hidden shadow-lg" style={{ height: "70vh" }}>
            <MapContainer 
              center={[20.5937, 78.9629]} 
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url={tileLayer} />
              <MapClickHandler onMapClick={handleMapClick} />
              
              {/* Show current platform being created */}
              {isCreatingPlatform && currentPlatform.points.length >= 3 && (
                <Polygon 
                  positions={currentPlatform.points}
                  pathOptions={{ 
                    color: "#ff0000",
                    fillOpacity: 0.5, 
                    weight: 2,
                    dashArray: "5, 5"
                  }}
                />
              )}
              
              {/* Show points of current platform */}
              {isCreatingPlatform && currentPlatform.points.map((point, index) => (
                <Marker key={`temp-${index}`} position={point}>
                  <Popup>Point {index + 1}</Popup>
                </Marker>
              ))}
              
              {/* Show saved platforms */}
              {platforms.map((platform, index) => (
                <Polygon 
                  key={platform.id} 
                  positions={platform.coordinates}
                  pathOptions={{ 
                    color: platformColors[index % platformColors.length],
                    fillOpacity: 0.5, 
                    weight: 2 
                  }}
                >
                  <Popup>{platform.name}</Popup>
                </Polygon>
              ))}
            </MapContainer>
          </div>
        </div>
        
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Editor Tools</h2>
          
          {!isCreatingPlatform ? (
            <button 
              onClick={startCreatingPlatform}
              className="w-full py-2 px-4 bg-accent-primary text-white rounded hover:bg-accent-secondary transition mb-4"
            >
              Create New Platform
            </button>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block mb-2 text-text-primary">Platform Name</label>
                <input 
                  type="text" 
                  value={currentPlatform.name}
                  onChange={(e) => setCurrentPlatform({...currentPlatform, name: e.target.value})}
                  className="w-full p-2 border border-border rounded bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
              
              <p className="mb-2 text-text-primary">Points: {currentPlatform.points.length}</p>
              <p className="text-text-secondary mb-4">Click on the map to add points to your platform.</p>
              
              <div className="flex space-x-2">
                <button 
                  onClick={finishPlatform}
                  className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPlatform.points.length < 3}
                >
                  Save Platform
                </button>
                
                <button 
                  onClick={cancelPlatform}
                  className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {platforms.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-text-primary">Created Platforms</h3>
              <ul className="space-y-2">
                {platforms.map((platform) => (
                  <li key={platform.id} className="p-2 bg-bg-secondary rounded shadow border border-border text-text-primary">
                    {platform.name} ({platform.coordinates.length} points)
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {platforms.length > 0 && (
            <button 
              className="mt-4 w-full py-2 px-4 bg-accent-primary text-white rounded hover:bg-accent-secondary transition"
            >
              Save Station Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
}