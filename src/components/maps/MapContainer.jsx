import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from '../../context/LocationContext';
import { Icon } from 'leaflet';
import { searchPlaces } from '../../services/api/geocodingService';

// Fix for Leaflet marker icon issue with webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Component to handle user location updates
function UserLocationMarker() {
  const { userLocation, startWatchingLocation } = useLocation();
  const map = useMap();

  useEffect(() => {
    startWatchingLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], map.getZoom());
    }
  }, [userLocation, map]);

  if (!userLocation) return null;

  return (
    <>
      <Marker position={[userLocation.lat, userLocation.lng]} icon={defaultIcon}>
        <Popup>
          <div>
            <strong>Your Location</strong>
            <br />
            Accuracy: {Math.round(userLocation.accuracy)}m
          </div>
        </Popup>
      </Marker>
      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={userLocation.accuracy}
        pathOptions={{ color: '#4299e1', fillColor: '#4299e1', fillOpacity: 0.2 }}
      />
    </>
  );
}

// Component to handle zoom level changes
function ZoomHandler({ onZoomChange }) {
  const map = useMap();
  
  useEffect(() => {
    const handleZoomEnd = () => {
      onZoomChange(map.getZoom());
    };
    
    map.on('zoomend', handleZoomEnd);
    
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map, onZoomChange]);
  
  return null;
}

// Component to handle map center changes based on search
function SearchHandler({ searchLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (searchLocation) {
      map.flyTo(searchLocation, 13);
    }
  }, [map, searchLocation]);
  
  return null;
}

export default function TrainMapContainer() {
  const { darkMode } = useTheme();
  const [zoom, setZoom] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState(null);
  const [searchResults, setSearchResults] = useState({ stations: [], places: [] });
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stations] = useState([
    { id: 1, name: 'Delhi Railway Station', position: [28.6419, 77.2194] },
    { id: 2, name: 'Mumbai Central', position: [18.9712, 72.8212] },
    { id: 3, name: 'Chennai Central', position: [13.0827, 80.2707] }
  ]);
  
  const [places, setPlaces] = useState([]);
  
  // Choose tile layer based on theme
  const tileLayer = darkMode 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  const attribution = darkMode
    ? '&copy; <a href="https://carto.com/">CARTO</a> | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    : '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
  
  const handleZoomChange = (newZoom) => {
    setZoom(newZoom);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Search stations
      const matchingStations = stations.filter(station => 
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Search places if not filtering for stations only
      let matchingPlaces = [];
      if (selectedType !== 'stations') {
        matchingPlaces = await searchPlaces(searchTerm);
        setPlaces(matchingPlaces);
      }

      setSearchResults({
        stations: matchingStations,
        places: matchingPlaces
      });

      // Set location to first result
      const firstResult = matchingStations[0] || matchingPlaces[0];
      if (firstResult) {
        setSearchLocation(firstResult.position);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-80">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stations and places..."
              className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          <div className="flex gap-2 text-sm">
            <label className="flex items-center">
              <input
                type="radio"
                name="searchType"
                value="all"
                checked={selectedType === 'all'}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mr-1"
              />
              All
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="searchType"
                value="stations"
                checked={selectedType === 'stations'}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mr-1"
              />
              Stations Only
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="searchType"
                value="places"
                checked={selectedType === 'places'}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mr-1"
              />
              Places Only
            </label>
          </div>

          {/* Search Results */}
          {(searchResults.stations.length > 0 || searchResults.places.length > 0) && (
            <div className="mt-2 max-h-60 overflow-y-auto">
              {searchResults.stations.length > 0 && (
                <div className="mb-2">
                  <h3 className="font-semibold text-sm mb-1">Stations</h3>
                  <ul className="space-y-1">
                    {searchResults.stations.map(station => (
                      <li 
                        key={station.id}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded text-sm"
                        onClick={() => setSearchLocation(station.position)}
                      >
                        {station.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {searchResults.places.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-1">Places</h3>
                  <ul className="space-y-1">
                    {searchResults.places.map(place => (
                      <li 
                        key={place.id}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded text-sm"
                        onClick={() => setSearchLocation(place.position)}
                      >
                        {place.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </form>

      <div className="map-container" style={{ height: '500px', width: '100%' }}>
        <MapContainer 
          center={[20.5937, 78.9629]}
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url={tileLayer}
            attribution={attribution}
          />
          
          <ZoomHandler onZoomChange={handleZoomChange} />
          <SearchHandler searchLocation={searchLocation} />
          <UserLocationMarker />
          
          {/* Render railway stations */}
          {stations.map(station => (
            <Marker 
              key={station.id} 
              position={station.position}
              icon={defaultIcon}
            >
              <Popup>
                <strong>{station.name}</strong><br />
                {zoom > 12 && (
                  <button 
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() => window.location.href = `/station/${station.id}`}
                  >
                    Indoor Map
                  </button>
                )}
              </Popup>
            </Marker>
          ))}

          {/* Render places */}
          {places.map(place => (
            <Marker 
              key={place.id} 
              position={place.position}
              icon={defaultIcon}
            >
              <Popup>
                <div>
                  <strong>{place.name}</strong>
                  <br />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {place.type}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {zoom < 12 && (
          <div className="zoom-instruction absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-opacity-70 bg-black text-white p-3 rounded-lg">
            Zoom in closer to a station to view indoor maps
          </div>
        )}
      </div>
    </div>
  );
}