import { useState } from 'react';
import { getLiveTrainStatus } from '../../services/api/eRailService';

export default function LiveTrainStatus() {
  const [trainNumber, setTrainNumber] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [trainStatus, setTrainStatus] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const status = await getLiveTrainStatus(trainNumber, date);
      setTrainStatus(status);
    } catch (err) {
      setError('Unable to fetch train status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="live-status-container">
      <h2 className="text-xl font-semibold mb-4">Check Live Train Status</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="trainNumber" className="block mb-2 font-medium">Train Number</label>
            <input
              id="trainNumber"
              type="text"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              placeholder="Enter train number"
              className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block mb-2 font-medium">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
              required
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-accent-primary text-white rounded hover:bg-accent-secondary transition"
            >
              {loading ? 'Loading...' : 'Check Status'}
            </button>
          </div>
        </div>
      </form>
      
      {error && <div className="error-alert p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>}
      
      {trainStatus && (
        <div className="train-status bg-bg-secondary p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary">{trainStatus.train_name}</h3>
              <p className="text-text-secondary">Train No: {trainStatus.train_number}</p>
            </div>
            <div className="status-badge px-3 py-1 rounded text-white text-sm" 
              style={{ backgroundColor: getStatusColor(trainStatus.status) }}>
              {trainStatus.status}
            </div>
          </div>
          
          <div className="train-info grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-medium text-text-secondary">Current Station:</p>
              <p className="text-text-primary">{trainStatus.current_station_name}</p>
            </div>
            <div>
              <p className="font-medium text-text-secondary">Last Updated:</p>
              <p className="text-text-primary">{new Date(trainStatus.last_updated).toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="upcoming-stations mt-4">
            <h4 className="font-medium mb-2 text-text-primary">Upcoming Stations:</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-text-secondary">Station</th>
                    <th className="text-left py-2 text-text-secondary">Scheduled Arrival</th>
                    <th className="text-left py-2 text-text-secondary">Expected Arrival</th>
                    <th className="text-left py-2 text-text-secondary">Delay</th>
                  </tr>
                </thead>
                <tbody>
                  {trainStatus.upcoming_stations && trainStatus.upcoming_stations.map((station, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-2 text-text-primary">{station.station_name}</td>
                      <td className="py-2 text-text-primary">{station.scheduled_arrival}</td>
                      <td className="py-2 text-text-primary">{station.expected_arrival}</td>
                      <td className="py-2 text-text-primary">{station.delay_minutes ? `${station.delay_minutes} mins` : 'On time'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  if (status.toLowerCase().includes('running')) return '#4CAF50';
  if (status.toLowerCase().includes('late')) return '#FF9800';
  if (status.toLowerCase().includes('arrived')) return '#2196F3';
  return '#9E9E9E';
}