import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-text-primary">Admin Dashboard</h1>
      <p className="text-text-secondary mb-6">Manage the Sahyatri platform</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-text-primary">Users</h3>
          <p className="text-3xl font-bold text-accent-primary">1,254</p>
          <p className="text-text-secondary">Total registered users</p>
        </div>
        
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-text-primary">Stations</h3>
          <p className="text-3xl font-bold text-accent-primary">87</p>
          <p className="text-text-secondary">Stations with indoor maps</p>
        </div>
        
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-text-primary">Bookings</h3>
          <p className="text-3xl font-bold text-accent-primary">342</p>
          <p className="text-text-secondary">Total bookings today</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Admin Tools</h2>
          </div>
          
          <div className="space-y-4">
            <Link to="/admin/map-editor" className="block p-4 border border-border rounded hover:bg-accent-secondary hover:text-white transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Map Editor</span>
                <span>&rarr;</span>
              </div>
            </Link>
            
            <div className="block p-4 border border-border rounded hover:bg-accent-secondary hover:text-white transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">User Management</span>
                <span>&rarr;</span>
              </div>
            </div>
            
            <div className="block p-4 border border-border rounded hover:bg-accent-secondary hover:text-white transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Station Information</span>
                <span>&rarr;</span>
              </div>
            </div>
            
            <div className="block p-4 border border-border rounded hover:bg-accent-secondary hover:text-white transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Messaging System</span>
                <span>&rarr;</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">System Status</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-text-primary">Database Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Operational</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-primary">Maps API</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Operational</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-primary">Booking System</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Operational</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-primary">Notification Service</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Partial Outage</span>
            </div>
          </div>
          
          <button className="mt-6 px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary transition w-full">
            View Full Status
          </button>
        </div>
      </div>
    </div>
  );
}