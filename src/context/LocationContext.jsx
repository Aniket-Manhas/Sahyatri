import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const startWatchingLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    try {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );
      setWatchId(id);
      setIsWatching(true);
    } catch (error) {
      setLocationError(error.message);
    }
  };

  const stopWatchingLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
    }
  };

  useEffect(() => {
    return () => {
      stopWatchingLocation();
    };
  }, []);

  return (
    <LocationContext.Provider value={{
      userLocation,
      locationError,
      isWatching,
      startWatchingLocation,
      stopWatchingLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}