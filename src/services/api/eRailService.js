import axios from 'axios';

const API_KEY = import.meta.env.VITE_ERAIL_API_KEY;
const BASE_URL = 'http://api.erail.in/';

// Get live train status
export const getLiveTrainStatus = async (trainNumber, date) => {
  try {
    // Convert date to DD-MM-YYYY format for eRail API
    const formattedDate = formatDateForERail(date);
    
    const response = await axios.get(
      `${BASE_URL}live-train-status/train/${trainNumber}/date/${formattedDate}/apikey/${API_KEY}/`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching train status:', error);
    throw error;
  }
};

// Search stations by name
export const searchStations = async (stationName) => {
  try {
    const response = await axios.get(
      `${BASE_URL}stations/?names=${stationName}&apikey=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error searching stations:', error);
    throw error;
  }
};

// Get train schedule
export const getTrainSchedule = async (trainNumber, date) => {
  try {
    const formattedDate = formatDateForERail(date);
    
    const response = await axios.get(
      `${BASE_URL}train-schedule/train/${trainNumber}/date/${formattedDate}/apikey/${API_KEY}/`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching train schedule:', error);
    throw error;
  }
};

// Get train fares
export const getTrainFare = async (trainNumber, fromStation, toStation, date) => {
  try {
    const formattedDate = formatDateForERail(date);
    
    const response = await axios.get(
      `${BASE_URL}fare/${trainNumber}/${fromStation}/${toStation}/${formattedDate}/apikey/${API_KEY}/`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching train fares:', error);
    throw error;
  }
};

// Search trains between stations
export const searchTrains = async (fromStation, toStation, date) => {
  try {
    const formattedDate = formatDateForERail(date);
    
    const response = await axios.get(
      `${BASE_URL}live-trains/?stnfrom=${fromStation}&stnto=${toStation}&date=${formattedDate}&sort=depttime&order=asc&apikey=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error searching trains:', error);
    throw error;
  }
};

// Helper function to format date for eRail API (DD-MM-YYYY)
const formatDateForERail = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}-${month}-${year}`;
}; 