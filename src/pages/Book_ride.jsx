import React from "react";
import "../styling/book-ride.css";

const BookRide = () => {
  const redirectToUber = () => {
    window.open("https://www.uber.com/", "_blank");
  };

  const redirectToIRCTC = () => {
    window.open("https://www.irctc.co.in/", "_blank");
  };

  return (
    <div className="book-ride-container">
      <h1 className="booking-title">Book a Ride</h1>
      <p className="booking-description">
        Select your preferred transportation option
      </p>

      <div className="booking-options">
        <button
          className="booking-option train-option "
          onClick={redirectToIRCTC}
        >
          <span className="option-title">Train Ticket</span>
          <span className="option-subtitle">Book via IRCTC</span>
        </button>

        <button className="booking-option" onClick={redirectToUber}>
          <span className="option-title">Cab Ride</span>
          <span className="option-subtitle">Book via Uber</span>
        </button>
      </div>
    </div>
  );
};

export default BookRide;
