// PNR Status API Service

const PNR_API_KEY = import.meta.env.VITE_PNR_API_KEY;
const PNR_API_HOST = 'real-time-pnr-status-api-for-indian-railways.p.rapidapi.com';

export const checkPnrStatus = async (pnrNumber) => {
  try {
    const url = `https://${PNR_API_HOST}/name/${pnrNumber}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': PNR_API_KEY,
        'x-rapidapi-host': PNR_API_HOST
      }
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking PNR status:', error);
    throw error;
  }
}; 