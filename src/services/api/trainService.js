import axios from 'axios';

const API_KEY = import.meta.env.VITE_INDIAN_RAIL_API_KEY;
const BASE_URL = 'http://indianrailapi.com/api/v2';

export const getTrainLiveStatus = async (trainNumber, date) => {
  try {
    const formattedDate = formatDate(date);
    const response = await axios.get(
      `${BASE_URL}/livetrainstatus/apikey/${API_KEY}/trainnumber/${trainNumber}/date/${formattedDate}/`
    );
    
    if (response.data.status === true) {
      return {
        train_number: response.data.train.number,
        train_name: response.data.train.name,
        status: response.data.position,
        current_station_name: response.data.current_station.name,
        last_updated: response.data.last_update.time,
        upcoming_stations: response.data.upcoming_stations.map(station => ({
          station_name: station.name,
          scheduled_arrival: station.schdep,
          expected_arrival: station.actdep || station.schdep,
          delay_minutes: station.delaymin || 0
        }))
      };
    } else {
      throw new Error(response.data.message || 'Unable to fetch train status');
    }
  } catch (error) {
    console.error('Error fetching train status:', error);
    throw error;
  }
};

// Format date to YYYYMMDD
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const searchTrains = async (from, to, date) => {
  // Existing implementation
};

export const getTrainSchedule = async (trainNumber) => {
  // Existing implementation
};