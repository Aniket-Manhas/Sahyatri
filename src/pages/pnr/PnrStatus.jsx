import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PnrStatusChecker from '../../components/trains/PnrStatusChecker';

export default function PnrStatus() {
  const [searchParams] = useSearchParams();
  const [initialPnr, setInitialPnr] = useState('');
  
  useEffect(() => {
    const pnrFromUrl = searchParams.get('pnr');
    if (pnrFromUrl) {
      setInitialPnr(pnrFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">PNR Status</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PnrStatusChecker initialPnr={initialPnr} />
        </div>
        
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">What is PNR?</h2>
          <p className="text-text-secondary mb-4">
            PNR (Passenger Name Record) is a unique 10-digit number which is generated 
            when you book a train ticket. You can use this number to check the status 
            of your booking and get details about your journey.
          </p>
          
          <h3 className="font-medium mb-2">Where to find PNR?</h3>
          <ul className="list-disc list-inside text-text-secondary space-y-1 mb-4">
            <li>On your e-ticket or physical ticket</li>
            <li>In the booking confirmation SMS</li>
            <li>In your booking history on the IRCTC website</li>
          </ul>
          
          <h3 className="font-medium mb-2">Status Meanings:</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
              <p><strong>CNF/Confirmed</strong> - Ticket is confirmed</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <p><strong>RAC</strong> - Reservation Against Cancellation</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
              <p><strong>WL</strong> - Waitlisted</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
              <p><strong>RLWL</strong> - Remote Location Waitlist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 