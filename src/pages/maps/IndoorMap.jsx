import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../context/ThemeContext';
import { Icon } from 'leaflet';

// Placeholder for station data - in a real app, this would come from Firebase
const stationData = {
  "1": {
    name: "Delhi Railway Station",
    platforms: [
      {
        id: 1,
        name: "Platform 1",
        coordinates: [
          [28.6429, 77.2184],
          [28.6429, 77.2204],
          [28.6409, 77.2204],
          [28.6409, 77.2184]
        ]
      },
      {
        id: 2,
        name: "Platform 2",
        coordinates: [
          [28.6429, 77.2164],
          [28.6429, 77.2184],
          [28.6409, 77.2184],
          [28.6409, 77.2164]
        ]
      }
    ],
    amenities: [
      { id: 1, name: "Restroom", type: "restroom", position: [28.6419, 77.2174] },
      { id: 2, name: "Food Court", type: "food", position: [28.6419, 77.2194] },
      { id: 3, name: "Ticket Counter", type: "ticket", position: [28.6425, 77.2190] }
    ]
  },
  "2": {
    name: "Mumbai Central",
    platforms: [
      {
        id: 1,
        name: "Platform 1",
        coordinates: [
          [18.9722, 72.8202],
          [18.9722, 72.8222],
          [18.9702, 72.8222],
          [18.9702, 72.8202]
        ]
      },
      {
        id: 2,
        name: "Platform 2",
        coordinates: [
          [18.9722, 72.8182],
          [18.9722, 72.8202],
          [18.9702, 72.8202],
          [18.9702, 72.8182]
        ]
      }
    ],
    amenities: [
      { id: 1, name: "Restroom", type: "restroom", position: [18.9712, 72.8192] },
      { id: 2, name: "Food Court", type: "food", position: [18.9712, 72.8212] },
      { id: 3, name: "Ticket Counter", type: "ticket", position: [18.9718, 72.8208] }
    ]
  },
  "3": {
    name: "Chennai Central",
    platforms: [
      {
        id: 1,
        name: "Platform 1",
        coordinates: [
          [13.0837, 80.2697],
          [13.0837, 80.2717],
          [13.0817, 80.2717],
          [13.0817, 80.2697]
        ]
      },
      {
        id: 2,
        name: "Platform 2",
        coordinates: [
          [13.0837, 80.2677],
          [13.0837, 80.2697],
          [13.0817, 80.2697],
          [13.0817, 80.2677]
        ]
      }
    ],
    amenities: [
      { id: 1, name: "Restroom", type: "restroom", position: [13.0827, 80.2687] },
      { id: 2, name: "Food Court", type: "food", position: [13.0827, 80.2707] },
      { id: 3, name: "Ticket Counter", type: "ticket", position: [13.0833, 80.2703] }
    ]
  }
};

export default function IndoorMap() {
  const { stationId } = useParams();
  const { darkMode } = useTheme();
  const [station, setStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ platforms: [], amenities: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  
  useEffect(() => {
    // In a real app, fetch station data from Firebase
    // For now, use our placeholder data
    if (stationData[stationId]) {
      setStation(stationData[stationId]);
    }
  }, [stationId]);
  
  useEffect(() => {
    if (station && searchTerm) {
      const term = searchTerm.toLowerCase();
      setSearchResults({
        platforms: station.platforms.filter(p => 
          p.name.toLowerCase().includes(term)
        ),
        amenities: station.amenities.filter(a => 
          a.name.toLowerCase().includes(term) || 
          a.type.toLowerCase().includes(term)
        )
      });
    } else {
      setSearchResults({ platforms: [], amenities: [] });
    }
  }, [searchTerm, station]);
  
  if (!station) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading station map...</div>;
  }
  
  // Choose tile layer based on theme
  const tileLayer = darkMode 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  const platformColors = [
    "#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c"
  ];

  const handleItemClick = (item) => {
    setSelectedItem(item);
    // For platforms, use the first coordinate as the center
    const position = item.coordinates ? item.coordinates[0] : item.position;
    const mapInstance = document.querySelector('.leaflet-container')?._leaflet_map;
    if (mapInstance) {
      mapInstance.flyTo(position, 19);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-text-primary">{station.name}</h1>
      <p className="mb-6 text-text-secondary">Indoor navigation map</p>
      
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search platforms and amenities..."
          className="w-full px-4 py-2 rounded-lg border border-border bg-bg-secondary text-text-primary"
        />
        
        {(searchResults.platforms.length > 0 || searchResults.amenities.length > 0) && (
          <div className="mt-2 p-4 bg-bg-secondary rounded-lg border border-border">
            {searchResults.platforms.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-text-primary">Platforms</h3>
                <ul className="space-y-2">
                  {searchResults.platforms.map(platform => (
                    <li 
                      key={platform.id}
                      className="cursor-pointer hover:bg-bg-primary p-2 rounded"
                      onClick={() => handleItemClick(platform)}
                    >
                      {platform.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {searchResults.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-text-primary">Amenities</h3>
                <ul className="space-y-2">
                  {searchResults.amenities.map(amenity => (
                    <li 
                      key={amenity.id}
                      className="cursor-pointer hover:bg-bg-primary p-2 rounded"
                      onClick={() => handleItemClick(amenity)}
                    >
                      {amenity.name} ({amenity.type})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="map-wrapper rounded-lg overflow-hidden shadow-lg" style={{ height: "70vh" }}>
        <MapContainer 
          center={station.platforms[0].coordinates[0]} 
          zoom={18}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url={tileLayer} />
          
          {/* Render Platforms */}
          {station.platforms.map((platform, index) => (
            <Polygon 
              key={platform.id} 
              positions={platform.coordinates}
              pathOptions={{ 
                color: platformColors[index % platformColors.length],
                fillOpacity: selectedItem?.id === platform.id ? 0.8 : 0.5, 
                weight: selectedItem?.id === platform.id ? 3 : 2
              }}
            >
              <Popup>
                <div className="text-text-primary">
                  <h3 className="font-bold">{platform.name}</h3>
                  <p>Departures from this platform</p>
                  <button className="mt-2 px-3 py-1 bg-accent-primary text-white rounded text-sm hover:bg-accent-secondary transition">
                    View Schedule
                  </button>
                </div>
              </Popup>
            </Polygon>
          ))}
          
          {/* Render Amenities */}
          {station.amenities.map(amenity => (
            <Marker 
              key={amenity.id} 
              position={amenity.position}
              opacity={selectedItem?.id === amenity.id ? 1 : 0.7}
            >
              <Popup>
                <div className="text-text-primary">
                  <h3 className="font-bold">{amenity.name}</h3>
                  <p>Type: {amenity.type}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-8 bg-bg-secondary p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2 text-text-primary">Platforms</h3>
            <ul className="list-disc pl-5 space-y-2">
              {station.platforms.map(platform => (
                <li 
                  key={platform.id} 
                  className="text-text-primary cursor-pointer hover:text-accent-primary"
                  onClick={() => handleItemClick(platform)}
                >
                  {platform.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-text-primary">Amenities</h3>
            <ul className="list-disc pl-5 space-y-2">
              {station.amenities.map(amenity => (
                <li 
                  key={amenity.id} 
                  className="text-text-primary cursor-pointer hover:text-accent-primary"
                  onClick={() => handleItemClick(amenity)}
                >
                  {amenity.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-bold mb-2 text-text-primary">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {station.platforms.map((platform, index) => (
              <div key={platform.id} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-2" 
                  style={{ backgroundColor: platformColors[index % platformColors.length] }}
                ></div>
                <span className="text-text-primary">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}