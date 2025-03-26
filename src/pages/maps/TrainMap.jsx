import React from 'react';
import TrainMapContainer from '../../components/maps/MapContainer';

export default function TrainMap() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Train Station Map</h1>
      <p className="mb-6">Explore train stations across the country. Zoom in on a station to view detailed indoor maps.</p>
      
      <div className="map-wrapper rounded-lg overflow-hidden shadow-lg">
        <TrainMapContainer />
      </div>
      
      <div className="mt-8 bg-bg-secondary p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Use the Map</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use the <strong>+/-</strong> buttons to zoom in and out</li>
          <li>Click on a station marker to see station information</li>
          <li>Zoom in to level 12+ to access indoor maps</li>
          <li>Use two fingers to rotate the map on mobile devices</li>
        </ul>
      </div>
    </div>
  );
} 