import { useState, useEffect } from 'react';
import { GeolocationService, LocationData, RegionalWaitlistData } from '../services/geolocationService';

interface UseGeolocationReturn {
  location: LocationData | null;
  waitlistData: RegionalWaitlistData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [waitlistData, setWaitlistData] = useState<RegionalWaitlistData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user location
      const userLocation = await GeolocationService.getUserLocation();
      setLocation(userLocation);
      
      // Get regional waitlist data
      const regionalData = await GeolocationService.getRegionalWaitlistData(userLocation);
      setWaitlistData(regionalData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
      console.error('Geolocation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't auto-fetch on mount to avoid permission dialogs and errors
  // Users can manually trigger via refetch()
  // useEffect(() => {
  //   fetchLocationData();
  // }, []);

  const refetch = () => {
    fetchLocationData();
  };

  return {
    location,
    waitlistData,
    loading,
    error,
    refetch
  };
};

// Hook specifically for urgency messaging
export const useRegionalUrgency = () => {
  const { waitlistData, loading, error } = useGeolocation();
  
  const urgencyMessage = waitlistData ? GeolocationService.getUrgencyMessage(waitlistData) : null;
  const isHighUrgency = waitlistData ? GeolocationService.shouldShowHighUrgency(waitlistData) : false;
  const stats = waitlistData ? GeolocationService.getRegionalStats(waitlistData) : null;
  
  return {
    waitlistData,
    urgencyMessage,
    isHighUrgency,
    stats,
    loading,
    error
  };
};