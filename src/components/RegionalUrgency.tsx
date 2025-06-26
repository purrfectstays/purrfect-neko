import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, AlertTriangle } from 'lucide-react';
import { GeolocationService, RegionalWaitlistData } from '../services/geolocationService';

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
  const [waitlistData, setWaitlistData] = useState<RegionalWaitlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRegionalData = async () => {
      try {
        setLoading(true);
        const data = await GeolocationService.getRegionalWaitlistData();
        setWaitlistData(data);
      } catch (err) {
        setError('Unable to load regional data');
        console.error('Failed to load regional data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRegionalData();
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse bg-slate-800 rounded-lg p-4 ${className}`}>
        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !waitlistData) {
    return null; // Gracefully fail without showing anything
  }

  const stats = GeolocationService.getRegionalStats(waitlistData);
  const urgencyMessage = GeolocationService.getUrgencyMessage(waitlistData);
  const isHighUrgency = GeolocationService.shouldShowHighUrgency(waitlistData);

  if (variant === 'banner') {
    return (
      <div className={`
        ${isHighUrgency 
          ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border-red-500/30' 
          : 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30'
        } 
        border rounded-xl p-4 mb-6 ${className}
      `}>
        <div className="flex items-start space-x-3">
          <div className={`
            mt-1 p-2 rounded-lg
            ${isHighUrgency ? 'bg-red-500/20' : 'bg-indigo-500/20'}
          `}>
            {isHighUrgency ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : (
              <MapPin className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold ${isHighUrgency ? 'text-red-300' : 'text-white'}`}>
                {waitlistData.country} Early Access
              </h3>
              <span className="text-sm text-slate-400">
                <MapPin className="w-4 h-4 inline mr-1" />
                {waitlistData.region}
              </span>
            </div>
            
            <p className={`text-sm mb-3 ${isHighUrgency ? 'text-red-200' : 'text-slate-300'}`}>
              {urgencyMessage}
            </p>
            
            {showDetails && (
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {stats.positionText}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {stats.spotsText}
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    stats.urgencyColor === 'red' ? 'bg-red-400' :
                    stats.urgencyColor === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                  {stats.fillPercentage}% filled
                </div>
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
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isHighUrgency ? 'bg-red-500/20' : 'bg-indigo-500/20'
          }`}>
            <MapPin className={`w-8 h-8 ${isHighUrgency ? 'text-red-400' : 'text-indigo-400'}`} />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            {waitlistData.country} Waitlist
          </h3>
          
          <p className="text-slate-400 mb-4">
            {waitlistData.region}
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Your Position:</span>
              <span className="text-white font-semibold">#{waitlistData.currentPosition}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Remaining Spots:</span>
              <span className={`font-semibold ${isHighUrgency ? 'text-red-400' : 'text-green-400'}`}>
                {waitlistData.remainingSpots}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Capacity:</span>
              <span className="text-white font-semibold">{waitlistData.totalSpots}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isHighUrgency 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${stats.fillPercentage}%` }}
            ></div>
          </div>
          
          <p className={`text-sm ${isHighUrgency ? 'text-red-300' : 'text-slate-300'}`}>
            {urgencyMessage}
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
        {waitlistData.country}: {waitlistData.remainingSpots} spots left
      </span>
      <div className={`w-2 h-2 rounded-full ${
        stats.urgencyColor === 'red' ? 'bg-red-400' :
        stats.urgencyColor === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'
      }`}></div>
    </div>
  );
};

export default RegionalUrgency;