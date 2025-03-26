import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">Your Profile</h1>
      
      <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
          <div className="user-avatar w-20 h-20 rounded-full bg-accent-primary flex items-center justify-center text-white text-2xl font-bold mr-4 mb-4 md:mb-0">
            {currentUser?.displayName?.charAt(0) || 'U'}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">{currentUser?.displayName || 'User'}</h2>
            <p className="text-text-secondary">{currentUser?.email}</p>
          </div>
        </div>
        
        <div className="border-t border-border pt-6">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">Recent Activity</h3>
          <p className="text-text-secondary italic">No recent activity to display.</p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">Saved Stations</h3>
          <p className="text-text-secondary italic mb-4">You haven't saved any stations yet.</p>
          
          <button className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary transition">
            Browse Stations
          </button>
        </div>
        
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-text-primary">Travel History</h3>
          <p className="text-text-secondary italic">No travel history to display.</p>
        </div>
      </div>
    </div>
  );
}