import { useState } from 'react';
import { processPayment } from '../../services/payment/paymentService';

export default function PaymentForm({ amount, onSuccess, onCancel }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const paymentDetails = {
        amount,
        cardNumber,
        cardName,
        expiryDate,
        // Never send CVV to your server in a real app
        // This is just for demonstration
      };

      const response = await processPayment(paymentDetails);
      onSuccess(response);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">Payment Details</h3>
      
      {error && <div className="error-alert p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="cardName" className="block mb-2 font-medium text-text-primary">Cardholder Name</label>
          <input
            id="cardName"
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block mb-2 font-medium text-text-primary">Card Number</label>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
            className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="expiryDate" className="block mb-2 font-medium text-text-primary">Expiry Date</label>
            <input
              id="expiryDate"
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
              placeholder="MM/YY"
              required
            />
          </div>
          
          <div>
            <label htmlFor="cvv" className="block mb-2 font-medium text-text-primary">CVV</label>
            <input
              id="cvv"
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
              className="w-full p-3 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent-primary bg-bg-primary text-text-primary"
              placeholder="123"
              required
            />
          </div>
        </div>
        
        <div className="payment-summary mb-6 p-4 bg-bg-primary rounded border border-border">
          <div className="flex justify-between mb-2">
            <span className="text-text-primary">Subtotal:</span>
            <span className="text-text-primary">₹{(amount - 50).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-text-primary">Convenience Fee:</span>
            <span className="text-text-primary">₹50.00</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-border">
            <span className="text-text-primary">Total Amount:</span>
            <span className="text-text-primary">₹{amount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-accent-primary text-white rounded hover:bg-accent-secondary transition"
          >
            {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-border rounded hover:bg-bg-secondary transition text-text-primary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}