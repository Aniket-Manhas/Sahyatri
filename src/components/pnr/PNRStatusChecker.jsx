import { useState } from 'react';
import { getPNRStatus } from '../../services/pnrService';

export default function PNRStatusChecker() {
  const [pnrNumber, setPnrNumber] = useState('');
  const [pnrData, setPnrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPnrData(null);

    try {
      const data = await getPNRStatus(pnrNumber);
      setPnrData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch PNR status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-bg-secondary rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Check PNR Status</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="pnr" className="block mb-2">
            Enter PNR Number
          </label>
          <input
            type="text"
            id="pnr"
            value={pnrNumber}
            onChange={(e) => setPnrNumber(e.target.value)}
            placeholder="10-digit PNR number"
            pattern="[0-9]{10}"
            title="PNR should be a 10-digit number"
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-accent-primary text-white rounded hover:bg-accent-secondary transition duration-200"
        >
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {pnrData && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-4">PNR Status Details</h3>
          
          {pnrData.data ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Train Number:</div>
                <div>{pnrData.data.trainNumber}</div>
                
                <div className="font-medium">Train Name:</div>
                <div>{pnrData.data.trainName}</div>
                
                <div className="font-medium">Date of Journey:</div>
                <div>{pnrData.data.doj}</div>
                
                <div className="font-medium">From:</div>
                <div>{pnrData.data.fromStation}</div>
                
                <div className="font-medium">To:</div>
                <div>{pnrData.data.toStation}</div>
                
                <div className="font-medium">Class:</div>
                <div>{pnrData.data.class}</div>
                
                <div className="font-medium">Chart Status:</div>
                <div>{pnrData.data.chartPrepared ? 'Prepared' : 'Not Prepared'}</div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Passengers:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-bg-secondary">
                      <tr>
                        <th className="px-4 py-2 text-left">No.</th>
                        <th className="px-4 py-2 text-left">Booking Status</th>
                        <th className="px-4 py-2 text-left">Current Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pnrData.data.passengers.map((passenger, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">{passenger.bookingStatus}</td>
                          <td className="px-4 py-2">{passenger.currentStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-text-secondary">No data available for this PNR</p>
          )}
        </div>
      )}
    </div>
  );
} 