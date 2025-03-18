import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styling/routeplanner.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYW5pa2V0LW1hbmhhczgwMSIsImEiOiJjbThkMXUwNXAyOW4yMmtzOGMxbzF2amZqIn0.sR-o50T71jwsT1JzNYxMlw";

const RoutePlanner = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const sourceMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState(null);
  const [suggestions, setSuggestions] = useState({ origin: [], destination: [] });
  const [activeInput, setActiveInput] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initializeMap = async () => {
      try {
        // Clear any existing content
        mapContainerRef.current.innerHTML = '';
        
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [77.4126, 23.2599],
          zoom: 12,
          pitchWithRotate: false,
          attributionControl: false
        });

        map.on('load', () => {
          console.log('Map loaded successfully');
          setMapLoaded(true);
          
          map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

          const geolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showAccuracyCircle: true
          });
          
          map.addControl(geolocateControl, 'bottom-right');

          geolocateControl.on('geolocate', (e) => {
            const { latitude, longitude } = e.coords;
            console.log('Geolocated:', { latitude, longitude });
            setCurrentLocation({ lat: latitude, lng: longitude });
            reverseGeocode([longitude, latitude], 'current');
          });

          map.on('click', handleMapClick);
        });

        map.on('error', (e) => {
          console.error('Map error:', e);
          setError('Error loading map. Please refresh the page.');
        });

        mapInstanceRef.current = map;

        return () => {
          map.remove();
          mapInstanceRef.current = null;
          setMapLoaded(false);
        };
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Error initializing map. Please refresh the page.');
      }
    };

    initializeMap();
  }, []);

  const searchLocation = async (query, type) => {
    if (!query) {
      setSuggestions(prev => ({ ...prev, [type]: [] }));
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=in&types=poi,place,address&proximity=${currentLocation ? currentLocation.lng + ',' + currentLocation.lat : '77.4126,23.2599'}&limit=5`
      );
      const data = await response.json();
      
      if (!data.features) {
        console.error('No features in response:', data);
        return;
      }

      // Filter for train stations and transit locations
      const filteredFeatures = data.features.filter(feature => 
        feature.place_type.includes('poi') &&
        (feature.properties?.category?.toLowerCase().includes('railway') ||
         feature.properties?.category?.toLowerCase().includes('train') ||
         feature.properties?.category?.toLowerCase().includes('station') ||
         feature.text.toLowerCase().includes('railway') ||
         feature.text.toLowerCase().includes('station'))
      );

      const suggestions = filteredFeatures.map(feature => ({
        place_name: feature.place_name,
        coordinates: feature.center,
        isStation: true
      }));

      if (type === 'origin' && currentLocation) {
        suggestions.unshift({
          place_name: 'Current Location',
          coordinates: [currentLocation.lng, currentLocation.lat],
          isCurrentLocation: true
        });
      }

      setSuggestions(prev => ({
        ...prev,
        [type]: suggestions
      }));
    } catch (err) {
      console.error('Error searching location:', err);
      setError('Error searching location. Please try again.');
    }
  };

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === 'origin') {
      setOrigin(value);
    } else {
      setDestination(value);
    }
    searchLocation(value, type);
  };

  const handleMapClick = (e) => {
    if (!activeInput) return;

    const coordinates = [e.lngLat.lng, e.lngLat.lat];
    console.log('Map clicked:', coordinates, 'for', activeInput);
    
    if (activeInput === 'origin') {
      setOriginCoords(coordinates);
    } else {
      setDestinationCoords(coordinates);
    }
    
    updateMarker(activeInput, coordinates);
    reverseGeocode(coordinates, activeInput);
  };

  const updateMarker = (type, coordinates) => {
    if (!coordinates || !mapInstanceRef.current) return;
    
    console.log('Updating marker:', type, coordinates);
    const map = mapInstanceRef.current;

    if (type === 'origin') {
      if (sourceMarkerRef.current) {
        sourceMarkerRef.current.remove();
      }
      setOriginCoords(coordinates);
    } else if (type === 'destination') {
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
      }
      setDestinationCoords(coordinates);
    }

    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `<div class="marker-pin ${type}-pin"></div>`;

    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'bottom'
    })
      .setLngLat(coordinates)
      .addTo(map);

    if (type === 'origin') {
      sourceMarkerRef.current = marker;
    } else {
      destMarkerRef.current = marker;
    }

    // Only adjust bounds if we have both markers
    if (originCoords && destinationCoords) {
      try {
        const bounds = new mapboxgl.LngLatBounds()
          .extend(originCoords)
          .extend(destinationCoords);
        map.fitBounds(bounds, { padding: 100 });
      } catch (err) {
        console.error('Error fitting bounds:', err);
      }
    } else {
      map.flyTo({
        center: coordinates,
        zoom: 14
      });
    }
  };

  const reverseGeocode = async (coordinates, type) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}&types=place,address`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        if (type === 'current') {
          setCurrentLocation(prev => ({
            ...prev,
            address: data.features[0].place_name
          }));
        } else if (type === 'origin') {
          setOrigin(data.features[0].place_name);
        } else {
          setDestination(data.features[0].place_name);
        }
      }
    } catch (err) {
      console.error('Error reverse geocoding:', err);
    }
  };

  const handleSuggestionSelect = (suggestion, type) => {
    console.log('Selected suggestion:', suggestion, 'for', type);
    
    const coordinates = suggestion.coordinates;
    console.log('Setting coordinates:', coordinates, 'for', type);

    if (type === 'origin') {
      setOrigin(suggestion.isCurrentLocation ? 'Current Location' : suggestion.place_name);
      setOriginCoords(coordinates);
    } else {
      setDestination(suggestion.place_name);
      setDestinationCoords(coordinates);
    }
    
    // Ensure the marker is updated with the correct coordinates
    updateMarker(type, coordinates);
    setSuggestions(prev => ({ ...prev, [type]: [] }));
  };

  const getRoute = async () => {
    console.log('Getting route with coords:', { originCoords, destinationCoords });
    
    if (!originCoords || !destinationCoords) {
      setError('Please select both origin and destination points');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format coordinates correctly
      const start = originCoords.join(',');
      const end = destinationCoords.join(',');
      const requestUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
      console.log('Request URL:', requestUrl);

      const response = await fetch(requestUrl);
      const data = await response.json();
      
      console.log('Route response:', data);

      if (!data.routes || data.routes.length === 0) {
        setError('No route found between these points');
        setLoading(false);
        return;
      }

      const route = data.routes[0];
      setRoute(route);
      
      const map = mapInstanceRef.current;
      if (!map) {
        console.error('Map not initialized');
        setError('Map not ready. Please try again.');
        setLoading(false);
        return;
      }
      
      // Wait for map to be loaded
      if (!map.loaded()) {
        await new Promise(resolve => map.once('load', resolve));
      }

      // Remove existing route layer and source
      if (map.getSource('route')) {
        try {
          if (map.getLayer('route')) {
            map.removeLayer('route');
          }
          map.removeSource('route');
        } catch (err) {
          console.error('Error removing existing route:', err);
        }
      }
      
      // Add new route layer
      try {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });
        
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });

        // Fit map to route bounds
        const coordinates = route.geometry.coordinates;
        
        if (coordinates && coordinates.length > 0) {
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

          map.fitBounds(bounds, {
            padding: 50
          });
        }
      } catch (err) {
        console.error('Error adding route to map:', err);
        setError('Error displaying route on map');
      }

    } catch (err) {
      console.error('Error getting route:', err);
      setError('Error finding route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="route-planner">
      <div className="search-container">
        <h2>Train Route Planner</h2>
        <div className="search-box">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter origin station or click for current location"
              value={origin}
              onChange={(e) => handleInputChange(e, 'origin')}
              onFocus={() => {
                setActiveInput('origin');
                if (currentLocation) {
                  setSuggestions(prev => ({
                    ...prev,
                    origin: [{
                      place_name: 'Current Location',
                      coordinates: [currentLocation.lng, currentLocation.lat],
                      isCurrentLocation: true
                    }]
                  }));
                }
              }}
            />
            {suggestions.origin.length > 0 && (
              <div className="suggestions">
                {suggestions.origin.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`suggestion ${suggestion.isCurrentLocation ? 'current-location' : ''}`}
                    onClick={() => handleSuggestionSelect(suggestion, 'origin')}
                  >
                    {suggestion.isCurrentLocation ? (
                      <>
                        <span className="suggestion-icon">📍</span>
                        <span>Current Location</span>
                      </>
                    ) : (
                      <>
                        <span className="suggestion-icon">🚉</span>
                        {suggestion.place_name}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Enter destination station"
              value={destination}
              onChange={(e) => handleInputChange(e, 'destination')}
              onFocus={() => setActiveInput('destination')}
            />
            {suggestions.destination.length > 0 && (
              <div className="suggestions">
                {suggestions.destination.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion"
                    onClick={() => handleSuggestionSelect(suggestion, 'destination')}
                  >
                    <span className="suggestion-icon">🚉</span>
                    {suggestion.place_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            className="search-button" 
            onClick={getRoute}
            disabled={loading || !originCoords || !destinationCoords}
          >
            {loading ? 'Finding Routes...' : 'Find Routes'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {route && (
          <div className="route-info">
            <p>Distance: {(route.distance / 1000).toFixed(2)} km</p>
            <p>Duration: {Math.round(route.duration / 60)} minutes</p>
          </div>
        )}
      </div>

      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default RoutePlanner;
