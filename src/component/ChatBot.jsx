import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styling/chatbot.css";

const ChatBot = () => {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn("Navigation context not available:", error);
    // Create a fallback navigate function
    navigate = (path) => {
      console.warn("Navigation attempted but router context is not available. Path:", path);
      // Fallback to window.location if needed
      if (path && typeof window !== 'undefined') {
        window.location.href = path;
      }
    };
  }
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your train navigation assistant. How can I help you today?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Track if voice is globally enabled
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Navigation paths mapping for voice commands
  const navigationPaths = {
    "home": "/",
    "landing": "/",
    "main": "/",
    "map": "/map",
    "route": "/route-planner",
    "routes": "/route-planner",
    "route planner": "/route-planner",
    "platform": "/platform",
    "platforms": "/platform",
    "book": "/book-ride",
    "booking": "/book-ride",
    "book ride": "/book-ride",
    "book a ride": "/book-ride",
    "ticket": "/ticket-gates",
    "tickets": "/ticket-gates",
    "ticket gates": "/ticket-gates",
    "waiting": "/waiting-room",
    "waiting room": "/waiting-room",
    "help": "/help",
    "support": "/help",
    "login": "/login",
    "sign in": "/login",
    "settings": "/settings",
    "profile": "/settings"
  };

  // Predefined responses for when API key is not available or fails
  const predefinedResponses = {
    "train schedule": "The next trains are at 10:15, 10:45, and 11:15. You can view the full schedule on the main screen.",
    "platform": "Your train will depart from Platform 3. Follow the blue signs to reach it.",
    "ticket": "You can purchase tickets at the kiosk or through our mobile app. Would you like me to guide you?",
    "baggage": "You can store your luggage in the overhead compartments or designated luggage areas on the train.",
    "delay": "I'm checking for delays... Currently, all trains are running on schedule.",
    "food": "There's a café on Platform 2 and vending machines available on all platforms.",
    "wifi": "Free WiFi is available throughout the station. Connect to 'TrainStation-Free' network.",
    "accessibility": "Wheelchair access is available at all platforms. Staff are ready to assist if needed.",
    "help": "I can help with train schedules, platform information, tickets, and general station services. What do you need?",
    "location": "You can find your current location on the interactive map in the Map section of the app.",
    "contact": "Customer service can be reached at 1-800-TRAIN-HELP or through the Help section of this app.",
    "safety": "In case of emergency, please follow the lighted signs to the nearest exit or find station staff for assistance.",
    "thank": "You're welcome! Happy to help with your journey.",
    "hi": "Hello! How can I assist with your train journey today?",
    "hello": "Hi there! How can I help you with your train navigation?"
  };

  // Initialize speech recognition
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        // Auto-submit after voice recognition
        handleVoiceInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && window.speechSynthesis && voiceEnabled) {
      // Welcome message when opening chat
      const welcomeMsg = "Hi, I'm your train navigation assistant. You can ask me for help or say where you want to go.";
      speakText(welcomeMsg);
    }
  };

  const toggleListening = () => {
    if (!isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error('Speech recognition error:', e);
        }
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const speakText = (text) => {
    // Don't speak if voice is disabled
    if (!voiceEnabled) {
      console.log("Voice output is disabled, not speaking:", text);
      return;
    }
    
    if (window.speechSynthesis) {
      // Cancel any ongoing speech first
      stopSpeaking();
      
      try {
        // Set speaking state immediately for better UI responsiveness
        setIsSpeaking(true);
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher pitch for female voice
        utterance.volume = 1.0;
        
        // Get available voices and select a female voice
        let voices = window.speechSynthesis.getVoices();
        
        // In some browsers, getVoices() is async and requires a callback
        if (voices.length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            selectFemaleVoice(utterance, voices);
          };
        } else {
          selectFemaleVoice(utterance, voices);
        }
        
        // Attach event handlers
        utterance.onstart = () => {
          console.log("Speech started");
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log("Speech ended");
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.error("Speech error:", event);
          setIsSpeaking(false);
        };
        
        // Safety timeout in case events don't fire
        const safetyTimeout = setTimeout(() => {
          if (window.speechSynthesis.speaking) {
            console.log("Speech is still ongoing after timeout");
          } else {
            console.log("Safety timeout: setting speaking to false");
            setIsSpeaking(false);
          }
        }, text.length * 50); // Approximate timeout based on text length
        
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Speech synthesis error:", error);
        setIsSpeaking(false);
      }
    }
  };

  // Helper function to select a female voice
  const selectFemaleVoice = (utterance, voices) => {
    if (!voices || voices.length === 0) return;
    
    console.log("Selecting from", voices.length, "voices");
    
    // Try to find a female voice
    let femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman')
    );
    
    // If no explicit female voice, try voices with common female names
    if (!femaleVoice) {
      const femaleNames = ['samantha', 'victoria', 'karen', 'tessa', 'monica', 'amy', 'lisa', 'sarah', 'zira'];
      femaleVoice = voices.find(voice => 
        femaleNames.some(name => voice.name.toLowerCase().includes(name))
      );
    }
    
    // If still no match, try to use Google US/UK female voice if available
    if (!femaleVoice) {
      femaleVoice = voices.find(voice => 
        voice.name.includes('Google US English Female') ||
        voice.name.includes('Google UK English Female')
      );
    }
    
    if (femaleVoice) {
      console.log("Using female voice:", femaleVoice.name);
      utterance.voice = femaleVoice;
    } else {
      console.log("No female voice found, using default voice");
    }
  };

  const handleVoiceInput = (transcript) => {
    // Auto-submit the form with the transcript
    const syntheticEvent = { preventDefault: () => {} };
    setInputText(transcript);
    handleSendMessage(syntheticEvent, transcript);
  };

  // Check if input contains a navigation command
  const checkForNavigation = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    // Check for "go to", "navigate to", "take me to" phrases
    let command = "";
    const navigationPhrases = ["go to", "navigate to", "take me to", "open", "show me", "show", "visit"];
    
    for (const phrase of navigationPhrases) {
      if (lowercaseInput.includes(phrase)) {
        // Extract the part after the phrase
        const startIndex = lowercaseInput.indexOf(phrase) + phrase.length;
        command = lowercaseInput.slice(startIndex).trim();
        break;
      }
    }
    
    // If no navigation phrase was found, check if the input directly matches a destination
    if (!command) {
      for (const [key, path] of Object.entries(navigationPaths)) {
        if (lowercaseInput.includes(key)) {
          command = key;
          break;
        }
      }
    }
    
    // Try to find a matching route
    if (command) {
      for (const [key, path] of Object.entries(navigationPaths)) {
        if (command.includes(key)) {
          return {
            found: true,
            destination: key,
            path: path
          };
        }
      }
    }
    
    return { found: false };
  };

  const getSimpleResponse = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (lowercaseInput.includes(keyword)) {
        return response;
      }
    }
    
    // Default response if no keywords match
    return "I'm not sure about that. You can ask me to navigate to different parts of the app like 'Go to map' or 'Show me the routes'.";
  };

  // Safe navigation function
  const safeNavigate = (path) => {
    try {
      if (typeof navigate === 'function') {
        navigate(path);
      } else {
        // Fallback to window.location
        console.warn("Using fallback navigation");
        window.location.href = path;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Final fallback
      window.location.href = path;
    }
  };

  const handleSendMessage = async (e, voiceInput = null) => {
    e.preventDefault();
    
    const inputToProcess = voiceInput || inputText;
    
    if (!inputToProcess.trim()) return;
    
    // Add user message to chat
    const userMessage = { text: inputToProcess, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    const currentInputText = inputToProcess;
    setInputText("");
    setIsLoading(true);
    
    // Check for voice control commands
    const voiceCommand = checkForVoiceControl(currentInputText);
    if (voiceCommand.isVoiceCommand) {
      const newState = voiceCommand.enable;
      setVoiceEnabled(newState);
      
      // Stop any ongoing speech if disabling
      if (!newState) {
        stopSpeaking();
      }
      
      const responseText = newState 
        ? "Voice output is now enabled. I'll speak my responses." 
        : "Voice output is now disabled. I'll stay silent.";
      
      setMessages(prev => [...prev, { 
        text: responseText, 
        sender: "bot"
      }]);
      
      // Announce the change if enabling
      if (newState && window.speechSynthesis) {
        // Use native speech synthesis to avoid infinite loop
        const utterance = new SpeechSynthesisUtterance("Voice output enabled.");
        window.speechSynthesis.speak(utterance);
      }
      
      setIsLoading(false);
      return;
    }
    
    // Check if this is a navigation request
    const navigationCheck = checkForNavigation(currentInputText);
    if (navigationCheck.found) {
      const navigationResponse = `Taking you to ${navigationCheck.destination} page.`;
      setMessages(prev => [...prev, { 
        text: navigationResponse, 
        sender: "bot",
        isNavigation: true,
        destination: navigationCheck.path
      }]);
      
      // Speak the navigation response
      speakText(navigationResponse);
      
      // Navigate after a short delay to allow the message to be read
      setTimeout(() => {
        safeNavigate(navigationCheck.path);
      }, 1500);
      
      setIsLoading(false);
      return;
    }
    
    try {
      // Use fallback responses if no API key or key starts with "your_" (placeholder)
      if (!apiKey || apiKey.startsWith("your_")) {
        console.log("Using fallback responses (no API key available)");
        await new Promise(resolve => setTimeout(resolve, 800));
        const response = getSimpleResponse(currentInputText);
        setMessages(prev => [...prev, { 
          text: response, 
          sender: "bot" 
        }]);
        
        // Speak the response
        speakText(response);
        setIsLoading(false);
        return;
      }
      
      // API request body according to Gemini API specs
      const requestBody = {
        contents: [{
          parts: [{
            text: `You are a helpful train navigation assistant. You help users navigate the train navigation app.
            Here are the available pages:
            - Home/Landing page: General information
            - Map: Interactive map of the train stations
            - Route Planner: Plan your journey
            - Platform: Platform information
            - Book Ride: Book train tickets
            - Ticket Gates: Information about ticket validation
            - Waiting Room: Virtual waiting room
            - Help: Support and assistance
            - Login: User authentication
            - Settings: User preferences
            
            If the user is asking to navigate to any of these pages, respond with "I'll help you navigate to [page name]."
            Otherwise, provide helpful information about train navigation.
            Keep responses concise and focused on helping the user.
            
            User query: ${currentInputText}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        }
      };
      
      console.log("Sending request to Gemini API with key:", apiKey.substring(0, 4) + "...");
      
      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Gemini API error:", response.status, errorData);
        throw new Error(`API error: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      console.log("Gemini API response:", data);
      
      // Handle different response formats
      let responseText = "";
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          responseText = candidate.content.parts[0].text || "";
        }
      }
      
      if (responseText) {
        // Check if the AI suggested navigation
        const aiNavigationCheck = checkForNavigation(responseText);
        
        setMessages(prev => [...prev, { 
          text: responseText, 
          sender: "bot",
          isNavigation: aiNavigationCheck.found,
          destination: aiNavigationCheck.found ? aiNavigationCheck.path : null
        }]);
        
        // Speak the response
        speakText(responseText);
        
        // If navigation was detected in AI response, navigate after a short delay
        if (aiNavigationCheck.found) {
          setTimeout(() => {
            safeNavigate(aiNavigationCheck.path);
          }, 2000);
        }
      } else {
        console.error("No valid text in API response:", data);
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error with chat response:", error);
      
      // Use fallback response when API fails
      const response = getSimpleResponse(currentInputText);
      setMessages(prev => [...prev, { 
        text: response,
        sender: "bot"
      }]);
      
      // Speak the fallback response
      speakText(response);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      try {
        // Cancel all speech
        window.speechSynthesis.cancel();
        
        // Force UI update immediately
        setIsSpeaking(false);
        
        console.log("Speech cancelled");
      } catch (error) {
        console.error("Error stopping speech:", error);
      }
    }
  };

  // Check if the message contains voice control commands
  const checkForVoiceControl = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    // Voice enabling phrases
    const enablePhrases = [
      "unmute", "turn on sound", "enable voice", "speak to me", 
      "turn on voice", "enable audio", "start speaking", "talk to me"
    ];
    
    // Voice disabling phrases
    const disablePhrases = [
      "mute", "turn off sound", "disable voice", "stop speaking", 
      "be quiet", "silence", "no sound", "turn off voice", "don't talk"
    ];
    
    // Check for enable commands
    for (const phrase of enablePhrases) {
      if (lowercaseInput.includes(phrase)) {
        return { isVoiceCommand: true, enable: true };
      }
    }
    
    // Check for disable commands
    for (const phrase of disablePhrases) {
      if (lowercaseInput.includes(phrase)) {
        return { isVoiceCommand: true, enable: false };
      }
    }
    
    return { isVoiceCommand: false };
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      {!isOpen ? (
        <button className="chatbot-button" onClick={toggleChat}>
          <span className="chatbot-icon">💬</span>
        </button>
      ) : (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <h3>Train Assistant</h3>
            <div className="chatbot-controls">
              <button 
                className="control-button"
                onClick={() => {
                  if (voiceEnabled) {
                    stopSpeaking();
                    setVoiceEnabled(false);
                  } else {
                    setVoiceEnabled(true);
                  }
                }} 
                title={voiceEnabled ? (isSpeaking ? "Stop current speech" : "Voice output enabled") : "Voice output disabled"}
              >
                <i className={`fas ${voiceEnabled ? (isSpeaking ? "fa-volume-high" : "fa-volume") : "fa-volume-xmark"}`}></i>
              </button>
              <button className="close-button" onClick={toggleChat}>×</button>
            </div>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === "bot" ? "bot-message" : "user-message"} ${message.error ? "error-message" : ""} ${message.isNavigation ? "navigation-message" : ""}`}
              >
                {message.text}
                {message.isNavigation && (
                  <div className="navigation-indicator">
                    <i className="fas fa-arrow-right"></i> Navigating...
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message loading">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={isListening ? "Listening..." : "Type or speak your message..."}
              disabled={isLoading || isListening}
            />
            <button 
              type="button" 
              className={`voice-button ${isListening ? "listening" : ""}`} 
              onClick={toggleListening}
              disabled={isLoading}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              <i className={`fas ${isListening ? "fa-stop" : "fa-microphone"}`}></i>
            </button>
            <button type="submit" disabled={isLoading || !inputText.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;