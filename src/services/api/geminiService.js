import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// List of app routes for navigation
const APP_ROUTES = {
  'home': '/',
  'login': '/login',
  'register': '/register',
  'signup': '/register',
  'map': '/map',
  'train map': '/map',
  'profile': '/profile',
  'account': '/profile',
  'user profile': '/profile',
  'booking': '/booking/train',
  'train booking': '/booking/train',
  'transport booking': '/booking/transport',
  'cab booking': '/booking/transport',
  'taxi booking': '/booking/transport',
  'pnr': '/pnr',
  'pnr status': '/pnr',
  'check pnr': '/pnr',
  'admin': '/admin',
  'admin dashboard': '/admin',
  'map editor': '/admin/map-editor',
  'voice assistant': '/assistant',
  'assistant': '/assistant'
};

// Common questions and their answers for quick response
const COMMON_QUESTIONS = {
  'how to check pnr': 'To check your PNR status, navigate to the PNR page and enter your 10-digit PNR number in the input field. The system will display your current booking status, train details, and journey information.',
  'what is sahyatri': 'Sahyatri is a comprehensive train navigation website that helps you track trains, check PNR status, navigate stations, book tickets, and get real-time updates about Indian Railways.',
  'how to book tickets': 'You can book train tickets by navigating to the booking page. Enter your source, destination, date of travel, and select your preferred train. Follow the instructions to complete the payment process.',
  'how to use the map': 'The train map feature allows you to track train locations in real-time. Navigate to the map page, search for your train number or name, and the system will display its current location and route.',
  'how to find platform': 'You can find your platform information on the PNR status page if you have a confirmed ticket. Alternatively, check the train information screens at the station or ask station staff.',
  'what is pnr': 'PNR (Passenger Name Record) is a unique 10-digit number assigned to your ticket when you book a train journey. It contains all your journey and passenger details.',
  'train schedule': 'You can check train schedules by searching for your train on the home page or booking page. The schedule will display departure and arrival times at all stations on the route.',
  'how to track train': 'To track a train, go to the train map page and enter the train number. The system will show you the current location and status of your train in real-time.',
  'station facilities': 'Most major Indian railway stations offer facilities like waiting rooms, food stalls, ATMs, medical services, wheelchairs, and luggage assistance. Specific facilities vary by station.',
  'help': 'I can help you navigate the Sahyatri website, answer questions about Indian Railways, assist with bookings, provide train information, and guide you through the station. What specifically do you need help with?'
};

export const askGemini = async (prompt) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?key=${GEMINI_API_KEY}`, 
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }
    );

    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    console.error('Error querying Gemini API:', error);
    throw error;
  }
};

// Function to detect navigation intent from user query
export const detectNavigationIntent = (query) => {
  // Convert to lowercase for easier matching
  const lowercaseQuery = query.toLowerCase();
  
  // Navigation phrases to detect
  const navigationPhrases = [
    'take me to', 'go to', 'navigate to', 'open', 'show me', 
    'switch to', 'move to', 'access', 'visit', 'bring me to'
  ];
  
  // Check for navigation intent
  for (const phrase of navigationPhrases) {
    if (lowercaseQuery.includes(phrase)) {
      // Extract the page name from the query
      const pageNameStartIndex = lowercaseQuery.indexOf(phrase) + phrase.length;
      let pageName = lowercaseQuery.substring(pageNameStartIndex).trim();
      
      // Remove common words like "the", "page", etc.
      pageName = pageName.replace(/^the\s+|(\s+page|\s+screen)$/g, '').trim();
      
      // Check if we have a route for this page name
      for (const [routeName, routePath] of Object.entries(APP_ROUTES)) {
        if (pageName.includes(routeName) || routeName.includes(pageName)) {
          return {
            isNavigation: true,
            destination: routeName,
            path: routePath
          };
        }
      }
    }
  }
  
  // Direct page mentions
  for (const [routeName, routePath] of Object.entries(APP_ROUTES)) {
    if (lowercaseQuery.includes(routeName)) {
      return {
        isNavigation: true,
        destination: routeName,
        path: routePath
      };
    }
  }
  
  return { isNavigation: false };
};

// Check if the query matches a common question
const checkCommonQuestion = (query) => {
  const lowercaseQuery = query.toLowerCase().trim();
  
  // Check for direct matches first
  if (COMMON_QUESTIONS[lowercaseQuery]) {
    return COMMON_QUESTIONS[lowercaseQuery];
  }
  
  // Check for partial matches
  for (const [question, answer] of Object.entries(COMMON_QUESTIONS)) {
    // Check if the user query contains the key question
    if (lowercaseQuery.includes(question)) {
      return answer;
    }
    
    // Check for keyword matches (if the query is at least 3 words long)
    const queryWords = lowercaseQuery.split(' ');
    const questionWords = question.split(' ');
    
    if (queryWords.length >= 3) {
      const matchingWords = questionWords.filter(word => 
        word.length > 3 && queryWords.includes(word)
      );
      
      // If at least 2 significant words match, return the answer
      if (matchingWords.length >= 2) {
        return answer;
      }
    }
  }
  
  return null;
};

// Function to get train navigation assistance
export const getTrainNavigationHelp = async (query) => {
  // Check for navigation intent first
  const navigationIntent = detectNavigationIntent(query);
  
  if (navigationIntent.isNavigation) {
    return `I'll navigate you to the ${navigationIntent.destination} page. [NAVIGATION:${navigationIntent.path}]`;
  }
  
  // Check if it matches a common question
  const commonAnswer = checkCommonQuestion(query);
  if (commonAnswer) {
    return commonAnswer;
  }
  
  // If not navigation or common question, proceed with Gemini API
  try {
    const enhancedPrompt = `You are Sahyatri's AI train assistant for an Indian Railways navigation website. Provide helpful, concise information about Indian Railways.
    
    Sahyatri features include:
    - Train tracking and live status
    - PNR status checking
    - Station navigation and indoor maps
    - Ticket booking for trains and local transport
    - User profiles and journey history
    
    Answer in a friendly, informative way. The user's question is: "${query}"
    
    If the question is not related to train travel, stations, navigation, or the Sahyatri website, politely redirect the user to ask about these topics.
    Keep your answer under 4 sentences unless complex instructions are needed.
    
    Important: DO NOT include instructions for the user to navigate to any page - navigation commands are handled separately.`;
    
    return await askGemini(enhancedPrompt);
  } catch (error) {
    console.error('Error getting response from Gemini:', error);
    
    // Fallback response if API fails
    return "I'm sorry, I couldn't process your request right now. Please try asking a simple question about train travel, checking PNR status, or navigating stations. You can also try navigation commands like 'Take me to the PNR page'.";
  }
};

// Function to get station information
export const getStationInfo = async (stationName) => {
  const enhancedPrompt = `You are Sahyatri's AI train assistant. Provide detailed information about ${stationName} railway station in India.
  Include details about platforms, amenities, nearby landmarks, and any special features of the station. Focus only on factual information.`;
  
  return askGemini(enhancedPrompt);
};

// Function to get navigation directions
export const getNavigationDirections = async (from, to) => {
  const enhancedPrompt = `You are Sahyatri's AI navigation assistant. Provide step-by-step directions for navigating from ${from} to ${to} within an Indian railway station.
  Include platform information, amenities along the way, and approximate walking time. Be clear and concise.`;
  
  return askGemini(enhancedPrompt);
}; 