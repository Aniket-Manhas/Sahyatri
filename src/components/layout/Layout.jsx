import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';
import ChatbotWidget from '../chatbot/ChatbotWidget';

export default function Layout() {
  const { darkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="app-container bg-bg-primary text-text-primary">
        <Header />
        <main className="main-content min-h-screen">
          <Outlet />
        </main>
        <Footer />
        <ChatbotWidget />
      </div>
    </div>
  );
}