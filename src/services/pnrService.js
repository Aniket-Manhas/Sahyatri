/**
 * Service for fetching PNR status information using RapidAPI
 */

const PNR_API_URL = 'https://irctc1.p.rapidapi.com/api/v3/getPNRStatusDetail';
const RAPID_API_KEY = 'd243bb478emshe51e059332870f5p1868a2jsn6b4d9b9c8e96';
const RAPID_API_HOST = 'irctc1.p.rapidapi.com';

/**
 * Fetch PNR status details from RapidAPI
 * @param {string} pnrNumber - The 10-digit PNR number to check
 * @returns {Promise<object>} - PNR status information
 */
export const getPNRStatus = async (pnrNumber) => {
  if (!pnrNumber || pnrNumber.length !== 10) {
    throw new Error('Please enter a valid 10-digit PNR number');
  }

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': RAPID_API_HOST
    }
  };

  try {
    const url = `${PNR_API_URL}?pnrNumber=${pnrNumber}`;
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching PNR status:', error);
    throw error;
  }
} 