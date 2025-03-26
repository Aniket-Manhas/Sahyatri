const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

export const searchPlaces = async (query, nearLocation = null) => {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: 1,
      limit: 10
    });

    // If nearLocation is provided, add viewbox parameter to bias results
    if (nearLocation) {
      const [lat, lon] = nearLocation;
      const delta = 0.1; // roughly 11km radius
      params.append('viewbox', `${lon-delta},${lat-delta},${lon+delta},${lat+delta}`);
      params.append('bounded', '1');
    }

    const response = await fetch(`${NOMINATIM_API}/search?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch places');
    }

    const data = await response.json();
    return data.map(place => ({
      id: place.place_id,
      name: place.display_name,
      type: place.type,
      position: [parseFloat(place.lat), parseFloat(place.lon)],
      address: place.address
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    throw error;
  }
};