import { useState, useEffect } from 'react';
import { checkPnrStatus } from '../../services/api/pnrService';

export default function PnrStatusChecker({ initialPnr = '' }) {
  const [pnrNumber, setPnrNumber] = useState(initialPnr);
  const [pnrStatus, setPnrStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPnr && initialPnr.length === 10) {
      handleCheckPnr(initialPnr);
    }
  }, [initialPnr]);

  const handleCheckPnr = async (pnr) => {
    if (!/^\d{10}$/.test(pnr)) {
      setError('Invalid PNR number. Please enter a 10-digit PNR.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const status = await checkPnrStatus(pnr);
      setPnrStatus(status);
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCheckPnr(pnrNumber);
  };

  return (
    <div className="pnr-status-container">
      <h2 className="text-xl font-semibold mb-4">PNR Status Check</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={pnrNumber}
              onChange={(e) => setPnrNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit PNR number"
              className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-accent-primary text-white rounded hover:bg-accent-secondary transition"
          >
            {loading ? 'Loading...' : 'Check Status'}
          </button>
        </div>
        
        {error && <div className="mt-3 text-red-600">{error}</div>}
      </form>
      
      {pnrStatus && (
        <div className="pnr-details bg-bg-secondary p-6 rounded-lg shadow-md">
          <div className="mb-4 pb-4 border-b border-border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-text-primary">{pnrStatus.trainName}</h3>
                <p className="text-text-secondary">Train Number: {pnrStatus.trainNumber}</p>
              </div>
              <div className="status-badge px-3 py-1 rounded text-white text-sm" 
                style={{ backgroundColor: getStatusColor(pnrStatus.status) }}>
                {pnrStatus.status}
              </div>
            </div>
          </div>
          
          <div className="journey-details grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-text-secondary text-sm">From Station</p>
              <p className="font-medium text-text-primary">{pnrStatus.from}</p>
              <p className="text-text-primary">{pnrStatus.departureTime}</p>
              <p className="text-text-secondary text-sm">{pnrStatus.departureDate}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">To Station</p>
              <p className="font-medium text-text-primary">{pnrStatus.to}</p>
              <p className="text-text-primary">{pnrStatus.arrivalTime}</p>
              <p className="text-text-secondary text-sm">{pnrStatus.arrivalDate}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-3 text-text-primary">Passenger Information</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="text-left text-text-secondary text-sm">
                    <th className="px-3 py-2">No.</th>
                    <th className="px-3 py-2">Booking Status</th>
                    <th className="px-3 py-2">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pnrStatus.passengers.map((passenger, index) => (
                    <tr key={index} className="text-text-primary">
                      <td className="px-3 py-2 whitespace-nowrap">{index + 1}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{passenger.bookingStatus}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{passenger.currentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center">
              <span className="text-text-secondary mr-2">Chart Status:</span>
              <span className="text-text-primary">{pnrStatus.chartPrepared ? 'Prepared' : 'Not Prepared'}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-text-secondary mr-2">Class:</span>
              <span className="text-text-primary">{pnrStatus.class}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  if (status.toLowerCase().includes('confirm')) return '#4CAF50';
  if (status.toLowerCase().includes('rac')) return '#FF9800';
  if (status.toLowerCase().includes('wait')) return '#F44336';
  return '#9E9E9E';
}