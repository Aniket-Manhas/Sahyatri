import React from 'react';

export default function TransportBooking() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">Book Local Transport</h1>
      
      <div className="bg-bg-secondary p-6 rounded-lg shadow-md mb-8">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pickupLocation" className="block mb-2 font-medium text-text-primary">Pickup Location</label>
              <input 
                type="text" 
                id="pickupLocation" 
                placeholder="Enter pickup address or station"
                className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
              />
            </div>
            
            <div>
              <label htmlFor="dropLocation" className="block mb-2 font-medium text-text-primary">Drop Location</label>
              <input 
                type="text" 
                id="dropLocation" 
                placeholder="Enter destination address"
                className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
              />
            </div>
            
            <div>
              <label htmlFor="transportDate" className="block mb-2 font-medium text-text-primary">Date</label>
              <input 
                type="date" 
                id="transportDate"
                className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block mb-2 font-medium text-text-primary">Time</label>
              <input 
                type="time" 
                id="time"
                className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
              />
            </div>
            
            <div>
              <label htmlFor="vehicleType" className="block mb-2 font-medium text-text-primary">Vehicle Type</label>
              <select 
                id="vehicleType"
                className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
              >
                <option value="auto">Auto Rickshaw</option>
                <option value="taxi">Taxi</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="passengers" className="block mb-2 font-medium text-text-primary">Passengers</label>
              <select 
                id="passengers"
                className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
              >
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4 Passengers</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit"
            className="mt-6 px-6 py-3 bg-accent-primary text-white rounded hover:bg-accent-secondary transition w-full md:w-auto"
          >
            Find Transport
          </button>
        </form>
      </div>
      
      <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">Available Options</h2>
        <p className="text-text-secondary italic">Search for transport to see available options.</p>
      </div>
    </div>
  );
}