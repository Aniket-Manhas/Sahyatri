import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrainNavigationHelp, getStationInfo, getNavigationDirections } from '../../services/api/geminiService';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m Sahyatri\'s AI assistant. I can help you with train information, navigation, and using our website. Try asking me about PNR status, train tracking, station facilities, or say "Take me to the map" to navigate.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Process response for navigation commands
  const processResponse = (response) => {
    // Check if the response contains a navigation command
    const navigationMatch = response.match(/\[NAVIGATION:([^\]]+)\]/);
    
    if (navigationMatch && navigationMatch[1]) {
      const path = navigationMatch[1];
      // Remove the navigation command from display text
      const cleanResponse = response.replace(/\[NAVIGATION:[^\]]+\]/, '').trim();
      
      // Navigate after a short delay to allow the user to see the message
      setTimeout(() => {
        navigate(path);
      }, 1500);
      
      return cleanResponse;
    }
    
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Clear input
    const userQuery = input;
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get response from Gemini
      const rawResponse = await getTrainNavigationHelp(userQuery);
      
      // Process response for navigation commands
      const processedResponse = processResponse(rawResponse);
      
      // Add assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: processedResponse }]);
    } catch (error) {
      // Handle error
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick suggestions
  const handleQuickSuggestion = async (question) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get response from Gemini
      const rawResponse = await getTrainNavigationHelp(question);
      
      // Process response for navigation commands
      const processedResponse = processResponse(rawResponse);
      
      // Add assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: processedResponse }]);
    } catch (error) {
      // Handle error
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample questions the user could ask
  const questionSuggestions = [
    "How do I find my platform?",
    "Take me to PNR status",
    "Show me the train map",
    "What is a PNR number?",
    "How to track my train?",
    "What facilities are at stations?",
    "How to book tickets?",
    "Tell me about Sahyatri"
  ];

  // Get 3 random suggestions to display
  const getRandomSuggestions = (count = 3) => {
    const shuffled = [...questionSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const [currentSuggestions] = useState(getRandomSuggestions());

  return (
    <div className="chatbot-widget fixed bottom-5 right-5 z-50">
      {/* Chat toggle button */}
      <button 
        onClick={toggleChat} 
        className="chat-toggle-btn w-14 h-14 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-lg hover:bg-accent-secondary transition"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="chat-window w-80 sm:w-96 h-96 bg-bg-primary shadow-xl rounded-lg overflow-hidden absolute bottom-16 right-0 flex flex-col border border-border">
          {/* Chat header */}
          <div className="chat-header bg-accent-primary text-white p-3 flex items-center">
            <div className="avatar w-8 h-8 rounded-full bg-white text-accent-primary flex items-center justify-center font-bold mr-2">
              S
            </div>
            <div>
              <h3 className="font-bold">Sahyatri Assistant</h3>
              <p className="text-xs opacity-80">AI-powered travel guide</p>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="chat-messages flex-1 p-3 overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message mb-3 ${
                  message.role === 'user' ? 'user-message text-right' : 'assistant-message'
                }`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-accent-primary text-white rounded-tr-none' 
                      : 'bg-bg-secondary text-text-primary rounded-tl-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="assistant-message mb-3">
                <div className="inline-block p-3 rounded-lg bg-bg-secondary text-text-primary rounded-tl-none">
                  <div className="typing-indicator flex space-x-1">
                    <div className="dot w-2 h-2 bg-accent-primary rounded-full animate-bounce"></div>
                    <div className="dot w-2 h-2 bg-accent-primary rounded-full animate-bounce delay-100"></div>
                    <div className="dot w-2 h-2 bg-accent-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length < 3 && (
            <div className="quick-suggestions p-3 border-t border-border">
              <p className="text-text-secondary text-xs mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {currentSuggestions.map((suggestion, index) => (
                  <button 
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="suggestion-btn text-xs bg-bg-secondary py-1 px-2 rounded-full hover:bg-accent-secondary hover:text-white transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat input */}
          <form onSubmit={handleSubmit} className="chat-input p-3 border-t border-border">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question or navigate to a page..."
                className="flex-1 p-2 border border-border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-accent-primary bg-bg-primary text-text-primary"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-accent-primary text-white px-4 rounded-r-lg hover:bg-accent-secondary transition disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}