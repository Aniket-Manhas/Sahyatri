import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';
import { FaTrain } from 'react-icons/fa';

// This could be fetched from an API in a real app
const UPCOMING_TRAINS = [
  {
    id: 1,
    number: '12301',
    name: 'Howrah Rajdhani',
    from: 'NDLS',
    to: 'HWH',
    departure: '16:55',
    platform: '3',
    status: 'On Time',
    type: 'Rajdhani'
  },
  {
    id: 2,
    number: '12311',
    name: 'Kalka Mail',
    from: 'NDLS',
    to: 'KLKA',
    departure: '17:40',
    platform: '9',
    status: 'Delayed by 15m',
    type: 'Mail'
  },
  {
    id: 3,
    number: '12259',
    name: 'Sealdah Duronto',
    from: 'NDLS',
    to: 'SDAH',
    departure: '19:15',
    platform: '5',
    status: 'On Time',
    type: 'Duronto'
  },
  {
    id: 4,
    number: '12019',
    name: 'Dehradun Shatabdi',
    from: 'NDLS',
    to: 'DDN',
    departure: '18:40',
    platform: '2',
    status: 'On Time',
    type: 'Shatabdi'
  }
];

export default function UpcomingTrains() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setTrains(UPCOMING_TRAINS);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="upcoming-trains bg-bg-secondary rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center">
          <FiClock className="mr-2" />
          Upcoming Trains
        </h2>
        <Link 
          to="/trains" 
          className="text-sm text-accent-primary hover:underline"
        >
          View All →
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loader"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trains.map(train => (
            <div 
              key={train.id} 
              className="train-card border border-border rounded-lg p-3 hover:bg-bg-primary transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-1">
                    <FaTrain className="text-accent-primary mr-1.5" />
                    <span className="font-semibold">{train.number}</span>
                    <span className="mx-1.5">|</span>
                    <span>{train.name}</span>
                  </div>
                  
                  <div className="text-sm text-text-secondary flex items-center">
                    <span>{train.from}</span>
                    <span className="mx-2">→</span>
                    <span>{train.to}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">{train.departure}</div>
                  <div className="text-sm text-text-secondary">
                    Platform {train.platform}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-2 pt-2 border-t border-border">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  train.status === 'On Time' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {train.status}
                </span>
                
                <span className="text-xs px-2 py-0.5 rounded bg-bg-primary text-text-secondary">
                  {train.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 