import { useState, useEffect } from 'react';
import LiveTrainStatus from '../../components/trains/LiveTrainStatus';
import PaymentForm from './PaymentForm';
import { searchTrains, searchStations, getTrainFare } from '../../services/api/eRailService';
import { Link } from 'react-router-dom';

export default function TrainBooking() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromStationCode, setFromStationCode] = useState('');
  const [toStationCode, setToStationCode] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Station search suggestions
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Handle station search for "From" field
  const handleFromSearch = async (value) => {
    setFrom(value);
    if (value.length > 2) {
      try {
        const stations = await searchStations(value);
        setFromSuggestions(stations);
        setShowFromSuggestions(true);
      } catch (err) {
        console.error('Error fetching stations:', err);
      }
    } else {
      setShowFromSuggestions(false);
    }
  };

  // Handle station search for "To" field
  const handleToSearch = async (value) => {
    setTo(value);
    if (value.length > 2) {
      try {
        const stations = await searchStations(value);
        setToSuggestions(stations);
        setShowToSuggestions(true);
      } catch (err) {
        console.error('Error fetching stations:', err);
      }
    } else {
      setShowToSuggestions(false);
    }
  };

  // Select a station from suggestions for "From" field
  const handleSelectFromStation = (station) => {
    setFrom(station.name);
    setFromStationCode(station.code);
    setShowFromSuggestions(false);
  };

  // Select a station from suggestions for "To" field
  const handleSelectToStation = (station) => {
    setTo(station.name);
    setToStationCode(station.code);
    setShowToSuggestions(false);
  };

  // Search for trains
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!fromStationCode || !toStationCode) {
      setError('Please select stations from the suggestions.');
      setLoading(false);
      return;
    }
    
    try {
      const trains = await searchTrains(fromStationCode, toStationCode, date);
      setSearchResults(trains);
    } catch (err) {
      setError('Unable to find trains for this route. Please try different stations or date.');
    } finally {
      setLoading(false);
    }
  };

  // Select a train and get fare
  const handleSelectTrain = async (train) => {
    try {
      setLoading(true);
      // Get fare details for the selected train
      const fareDetails = await getTrainFare(
        train.train_number, 
        fromStationCode, 
        toStationCode, 
        date
      );
      
      // Update the train object with fare information
      const trainWithFare = {
        ...train,
        fare: fareDetails.fare
      };
      
      setSelectedTrain(trainWithFare);
      setShowPayment(true);
    } catch (err) {
      setError('Unable to fetch fare details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResponse) => {
    setBookingComplete(true);
    setShowPayment(false);
    setBookingDetails({
      bookingId: 'BK' + Math.floor(Math.random() * 1000000),
      train: selectedTrain,
      passengers,
      date,
      from,
      to,
      fromCode: fromStationCode,
      toCode: toStationCode,
      transactionId: paymentResponse.transactionId,
      amount: selectedTrain.fare * passengers
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedTrain(null);
  };

  // Set current date as default
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Book Train Tickets</h1>
          
          {!bookingComplete ? (
            <>
              <div className="bg-bg-secondary p-6 rounded-lg shadow-md mb-8">
                <form onSubmit={handleSearch}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label htmlFor="from" className="block mb-2 font-medium text-text-primary">From</label>
                      <input 
                        type="text" 
                        id="from" 
                        value={from}
                        onChange={(e) => handleFromSearch(e.target.value)}
                        placeholder="Search departure station"
                        className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
                        required
                      />
                      {showFromSuggestions && fromSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-bg-primary border border-border rounded shadow-lg max-h-60 overflow-y-auto">
                          {fromSuggestions.map((station) => (
                            <div 
                              key={station.code} 
                              className="p-2 hover:bg-bg-secondary cursor-pointer"
                              onClick={() => handleSelectFromStation(station)}
                            >
                              <div className="font-medium text-text-primary">{station.name}</div>
                              <div className="text-text-secondary text-sm">{station.code}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <label htmlFor="to" className="block mb-2 font-medium text-text-primary">To</label>
                      <input 
                        type="text" 
                        id="to" 
                        value={to}
                        onChange={(e) => handleToSearch(e.target.value)}
                        placeholder="Search arrival station"
                        className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
                        required
                      />
                      {showToSuggestions && toSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-bg-primary border border-border rounded shadow-lg max-h-60 overflow-y-auto">
                          {toSuggestions.map((station) => (
                            <div 
                              key={station.code} 
                              className="p-2 hover:bg-bg-secondary cursor-pointer"
                              onClick={() => handleSelectToStation(station)}
                            >
                              <div className="font-medium text-text-primary">{station.name}</div>
                              <div className="text-text-secondary text-sm">{station.code}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="date" className="block mb-2 font-medium text-text-primary">Date</label>
                      <input 
                        type="date" 
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="passengers" className="block mb-2 font-medium text-text-primary">Passengers</label>
                      <select 
                        id="passengers"
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="mt-6 px-6 py-3 bg-accent-primary text-white rounded hover:bg-accent-secondary transition w-full md:w-auto disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search Trains'}
                  </button>
                </form>
              </div>

              {searchResults && !showPayment && (
                <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4 text-text-primary">Available Trains</h2>
                  
                  {searchResults.length === 0 ? (
                    <p className="text-center text-text-secondary py-4">No trains found for this route. Please try different stations or date.</p>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map(train => (
                        <div key={train.train_number} className="train-card p-4 border border-border rounded hover:border-accent-primary transition">
                          <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div className="mb-3 md:mb-0">
                              <h3 className="font-bold text-text-primary">{train.train_name}</h3>
                              <p className="text-text-secondary text-sm">{train.train_number}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              <div className="time-info text-center">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="font-bold text-text-primary">{train.departure_time}</p>
                                    <p className="text-text-secondary text-xs">{train.from_station_name}</p>
                                  </div>
                                  <div className="text-text-secondary">→</div>
                                  <div>
                                    <p className="font-bold text-text-primary">{train.arrival_time}</p>
                                    <p className="text-text-secondary text-xs">{train.to_station_name}</p>
                                  </div>
                                </div>
                                <p className="text-xs text-text-secondary mt-1">{train.duration}</p>
                              </div>

                              <div className="availability text-center px-3 py-1 rounded" 
                                style={{ 
                                  backgroundColor: train.availability === 'Available' ? '#e6f7e6' : '#fff3e6',
                                  color: train.availability === 'Available' ? '#2e7d32' : '#ed6c02'
                                }}>
                                {train.availability || 'Check Availability'}
                              </div>

                              <button 
                                onClick={() => handleSelectTrain(train)}
                                className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary transition"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showPayment && selectedTrain && (
                <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4 text-text-primary">Complete Your Booking</h2>
                  
                  <div className="booking-summary mb-6 p-4 bg-bg-primary rounded border border-border">
                    <h3 className="font-bold mb-2 text-text-primary">Booking Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-text-secondary">Train</p>
                        <p className="text-text-primary">{selectedTrain.train_name} ({selectedTrain.train_number})</p>
                      </div>
                      <div>
                        <p className="text-text-secondary">Journey Date</p>
                        <p className="text-text-primary">{new Date(date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary">From - To</p>
                        <p className="text-text-primary">{from} - {to}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary">Passengers</p>
                        <p className="text-text-primary">{passengers}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary">Departure</p>
                        <p className="text-text-primary">{selectedTrain.departure_time} ({selectedTrain.from_station_name})</p>
                      </div>
                      <div>
                        <p className="text-text-secondary">Arrival</p>
                        <p className="text-text-primary">{selectedTrain.arrival_time} ({selectedTrain.to_station_name})</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between font-bold">
                        <span className="text-text-primary">Total Fare:</span>
                        <span className="text-text-primary">₹{(selectedTrain.fare * passengers).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <PaymentForm 
                    amount={selectedTrain.fare * passengers} 
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
              <div className="text-center mb-6">
                <div className="inline-block p-3 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
                <p className="text-text-secondary">Your train ticket has been booked successfully.</p>
              </div>
              
              <div className="booking-details p-4 bg-bg-primary rounded border border-border mb-6">
                <h3 className="font-bold mb-3">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-text-secondary">Booking ID</p>
                    <p className="font-medium">{bookingDetails.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Transaction ID</p>
                    <p className="font-medium">{bookingDetails.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Train</p>
                    <p>{bookingDetails.train.train_name} ({bookingDetails.train.train_number})</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Journey Date</p>
                    <p>{new Date(bookingDetails.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">From - To</p>
                    <p>{bookingDetails.from} ({bookingDetails.fromCode}) - {bookingDetails.to} ({bookingDetails.toCode})</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Passengers</p>
                    <p>{bookingDetails.passengers}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Departure</p>
                    <p>{bookingDetails.train.departure_time}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Arrival</p>
                    <p>{bookingDetails.train.arrival_time}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount Paid:</span>
                    <span>₹{bookingDetails.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-3">Want to check your booking status?</h3>
                <p className="mb-3">Your PNR number: <span className="font-bold">{bookingDetails.pnrNumber || '2749628734'}</span></p>
                <Link to={`/pnr?pnr=${bookingDetails.pnrNumber || '2749628734'}`} className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary transition">
                  Check PNR Status
                </Link>
              </div>
              
              <div className="flex justify-between">
                <button className="px-4 py-2 border border-border rounded hover:bg-bg-secondary transition">
                  Download E-Ticket
                </button>
                <button 
                  onClick={() => {
                    setBookingComplete(false);
                    setSearchResults(null);
                    setSelectedTrain(null);
                    setFrom('');
                    setTo('');
                    setFromStationCode('');
                    setToStationCode('');
                    const today = new Date();
                    setDate(today.toISOString().split('T')[0]);
                    setPassengers(1);
                  }}
                  className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary transition"
                >
                  Book Another Ticket
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="live-status">
          <LiveTrainStatus />
        </div>
      </div>
    </div>
  );
}