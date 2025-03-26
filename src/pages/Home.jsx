import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero bg-accent-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Complete Train Travel Companion</h1>
          <p className="text-xl md:text-2xl mb-8">Track trains, check PNR status, and book tickets all in one place</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/map" className="btn-primary text-lg px-6 py-3 rounded-lg">
              Train Map
            </Link>
            {!currentUser && (
              <Link to="/register" className="btn-secondary text-lg px-6 py-3 rounded-lg">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features That Make Travel Easier</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card p-6 rounded-lg shadow-md">
              <div className="icon-container mb-4 text-accent-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Train Tracking</h3>
              <p>Track any train in real-time and get accurate arrival information</p>
            </div>
            
            <div className="feature-card p-6 rounded-lg shadow-md">
              <div className="icon-container mb-4 text-accent-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">PNR Status Check</h3>
              <p>Instantly check your PNR status and get booking confirmation details</p>
            </div>
            
            <div className="feature-card p-6 rounded-lg shadow-md">
              <div className="icon-container mb-4 text-accent-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Station Maps</h3>
              <p>Navigate train stations easily with detailed maps and platform information</p>
            </div>
            
            <div className="feature-card p-6 rounded-lg shadow-md">
              <div className="icon-container mb-4 text-accent-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ticket Booking</h3>
              <p>Book train tickets quickly and securely with our easy booking system</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta bg-accent-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to simplify your train travel?</h2>
          <p className="text-xl mb-8">Join thousands of travelers who use Sahyatri for a stress-free journey</p>
          
          <Link to={currentUser ? "/map" : "/register"} className="btn-white text-accent-primary font-bold text-lg px-6 py-3 rounded-lg">
            {currentUser ? "Train Map" : "Register Now"}
          </Link>
        </div>
      </section>
    </div>
  );
} 