import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrainNavigationHelp } from '../../services/api/geminiService';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Check if speech recognition is supported
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  // Start listening
  const startListening = () => {
    setTranscript('');
    setResponse('');
    setErrorMessage('');
    setIsNavigating(false);
    setIsListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const userQuery = event.results[current][0].transcript;
      setTranscript(userQuery);
      handleQuery(userQuery);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setErrorMessage(`Speech recognition error: ${event.error}. Please try again.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Process response for navigation commands
  const processResponse = (response) => {
    // Check if the response contains a navigation command
    const navigationMatch = response.match(/\[NAVIGATION:([^\]]+)\]/);
    
    if (navigationMatch && navigationMatch[1]) {
      const path = navigationMatch[1];
      // Remove the navigation command from display text
      const cleanResponse = response.replace(/\[NAVIGATION:[^\]]+\]/, '').trim();
      
      // Set navigating state to update UI feedback
      setIsNavigating(true);
      
      // Navigate after a short delay to allow the user to see/hear the message
      setTimeout(() => {
        navigate(path);
      }, 2000);
      
      return cleanResponse;
    }
    
    return response;
  };

  // Handle user query
  const handleQuery = async (query) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const rawResponse = await getTrainNavigationHelp(query);
      const processedResponse = processResponse(rawResponse);
      setResponse(processedResponse);
      speakResponse(processedResponse);
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      const errorResponse = 'Sorry, I encountered an error. Please try again with a question about trains, PNR status, or station navigation.';
      setResponse(errorResponse);
      speakResponse(errorResponse);
      setErrorMessage('Failed to get response. Check your network connection or try a different question.');
    } finally {
      setLoading(false);
    }
  };

  // Speak response using speech synthesis
  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Example question categories
  const categories = [
    {
      title: "Navigation Commands",
      examples: [
        "Take me to the PNR status page",
        "Show me the train map",
        "Navigate to the booking page",
        "Go to my profile"
      ]
    },
    {
      title: "Train Information",
      examples: [
        "What is a PNR number?",
        "How do I find my platform?",
        "How to track my train?",
        "What facilities are available at stations?"
      ]
    },
    {
      title: "Using Sahyatri",
      examples: [
        "How do I book tickets?",
        "Tell me about Sahyatri",
        "How can I check my booking history?",
        "How to use the map feature?"
      ]
    }
  ];

  return (
    <div className="voice-assistant-container my-6 p-4 bg-bg-secondary rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        Voice Assistant
      </h2>

      <div className="mb-6">
        <p className="text-text-secondary mb-4">Click the microphone to start speaking your questions or commands.</p>
        <div className="flex justify-center">
          <button 
            className={`p-4 rounded-full ${isListening ? 'bg-red-500' : 'bg-accent-primary'} text-white hover:opacity-90 transition`}
            onClick={startListening}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
        {isListening && <p className="text-center mt-2 text-text-primary">Listening...</p>}
        {transcript && <p className="text-center mt-4 text-text-primary">"{transcript}"</p>}
      </div>

      <div className="command-examples">
        <h3 className="font-semibold mb-3 text-text-primary">Example Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-bg-primary p-4 rounded-lg border border-border">
              <h4 className="font-medium mb-2 text-text-primary">{category.title}</h4>
              <ul className="space-y-2">
                {category.examples.map((example, idx) => (
                  <li key={idx} className="text-text-secondary hover:text-text-primary cursor-pointer transition">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
}