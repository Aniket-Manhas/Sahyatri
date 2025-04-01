import React from "react";
import fb from "../logos/fb.svg";
import ig from "../logos/ig.svg";
import x from "../logos/x.svg";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-accent-primary">Sahyatri</h1>
          <p className="text-sm">Your train station navigation companion</p>
          <div className="flex space-x-6 mt-4">
            <a href="#" aria-label="Twitter">
              <img src={x} alt="X" className="w-auto h-8" />
            </a>
            <a href="#" aria-label="Facebook">
              <img src={fb} alt="Facebook" className="w-auto h-8" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src={ig} alt="Instagram" className="w-auto h-8" />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-12 mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="font-bold mb-2">Navigation</h2>
            <ul className="space-y-1">
              <li>Home</li>
              <li>Maps</li>
              <li>About</li>
            </ul>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="font-bold mb-2">Resources</h2>
            <ul className="space-y-1">
              <li>Emergency Guide</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold mb-2">Legal</h2>
            <ul className="space-y-1">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col mb-6">
          <h2 className="font-bold mb-2">Stay Updated</h2>
          <p className="mb-4">
            Subscribe to our newsletter for the latest updates
          </p>
          <input
            type="email"
            placeholder="Your email address"
            className="p-2 rounded-md mb-2 text-gray-800 w-64"
          />
          <button className="bg-blue-500 text-white p-2 rounded-md">
            Subscribe
          </button>
        </div>
      </div>

      <div className="bg-purple-600 text-center p-4 mt-8">
        <h3 className="font-bold">24/7 Emergency Helpline</h3>
        <p>For immediate assistance, call our emergency number</p>
        <p className="text-2xl font-bold">1-800-123-4567</p>
      </div>

      <div className="text-center text-sm mt-4">
        <p>2025 Created by Team Digital Defenders. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
