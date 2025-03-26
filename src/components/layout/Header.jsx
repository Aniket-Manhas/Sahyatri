import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

export default function Header() {
  const { currentUser, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="header bg-bg-primary shadow-md relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-bg-secondary"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <Link to="/" className="logo">
          <h1 className="text-2xl font-bold text-accent-primary">Sahyatri</h1>
        </Link>

        <nav className={`${isMobileMenuOpen ? 'absolute top-full left-0 right-0 bg-bg-primary border-t border-border shadow-lg md:border-none md:shadow-none' : 'hidden'} md:block md:static`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0">
            <li><Link to="/" className="block py-2 md:py-0 hover:text-accent-primary transition" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/map" className="block py-2 md:py-0 hover:text-accent-primary transition" onClick={() => setIsMobileMenuOpen(false)}>Train Map</Link></li>
            <li><Link to="/booking/train" className="block py-2 md:py-0 hover:text-accent-primary transition" onClick={() => setIsMobileMenuOpen(false)}>Book Ticket</Link></li>
            <li><Link to="/pnr" className="block py-2 md:py-0 hover:text-accent-primary transition" onClick={() => setIsMobileMenuOpen(false)}>PNR Status</Link></li>
            <li><Link to="/booking/transport" className="block py-2 md:py-0 hover:text-accent-primary transition" onClick={() => setIsMobileMenuOpen(false)}>Transport Booking</Link></li>
            <li>
              <Link to="/assistant" className="block py-2 md:py-0 hover:text-accent-primary transition" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Assistant
                </span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link to="/admin" className="text-accent-primary">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="profile-link hover:text-accent-primary transition">
                {currentUser.displayName || 'Profile'}
              </Link>
              <button 
                onClick={() => logout()}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login" className="btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn-secondary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}