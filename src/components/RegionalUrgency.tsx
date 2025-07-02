import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { GeolocationService } from '../services/geolocationService';

interface LocationData {
  country: string;
  region: string;
  city: string;
  countryCode: string;
}

interface RegionalUrgencyProps {
  variant?: 'banner' | 'card' | 'inline';
  showDetails?: boolean;
  className?: string;
}

const RegionalUrgency: React.FC<RegionalUrgencyProps> = ({ 
  variant = 'banner', 
  showDetails = true,
  className = ''
}) => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        // Get real user location for factual display only
        const location = await GeolocationService.getUserLocation();
        setLocationData(location);
        setLoading(false);
      } catch (error) {
        console.log('Location detection failed:', error);
        setLocationData(null);
        setLoading(false);
      }
    };

    loadLocationData();
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse bg-slate-800 rounded-lg p-4 ${className}`}>
        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  // Don't show anything if location detection failed - no fake data
  if (!locationData) {
    return null;
  }

  // Simple factual location display - no fake urgency or waitlist data
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-4 mb-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <MapPin className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">
              Building Early Access Community
            </h3>
            <p className="text-sm text-slate-300">
              Join cat lovers from {locationData.country} and around the world in shaping the future of cattery bookings.
            </p>
            {showDetails && (
              <div className="flex items-center mt-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Detected location: {locationData.city}, {locationData.region}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Early Access Community
          </h3>
          <p className="text-slate-400 mb-4">
            {locationData.city}, {locationData.region}
          </p>
          <p className="text-sm text-slate-300">
            Join cat lovers from {locationData.country} in building the future of cattery bookings.
          </p>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <MapPin className="w-4 h-4 text-indigo-400" />
      <span className="text-sm text-slate-300">
        {locationData.city}, {locationData.country}
      </span>
    </div>
  );
};

export default RegionalUrgency;