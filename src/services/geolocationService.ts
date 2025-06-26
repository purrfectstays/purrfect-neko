interface LocationData {
  country: string;
  region: string;
  city: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

interface RegionalWaitlistData {
  region: string;
  country: string;
  totalSpots: number;
  remainingSpots: number;
  currentPosition: number;
  urgencyLevel: 'high' | 'medium' | 'low';
}

export class GeolocationService {
  private static cachedLocation: LocationData | null = null;
  
  // Regional limits for early access (you can adjust these)
  private static readonly REGIONAL_LIMITS = {
    'New Zealand': { total: 50, regions: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'] },
    'Australia': { total: 150, regions: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'] },
    'United States': { total: 200, regions: ['California', 'New York', 'Texas', 'Florida'] },
    'United Kingdom': { total: 100, regions: ['London', 'Manchester', 'Birmingham', 'Glasgow'] },
    'Canada': { total: 80, regions: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'] },
    'Singapore': { total: 30, regions: ['Central Singapore', 'East Singapore', 'West Singapore'] },
    'Other': { total: 50, regions: ['International'] }
  };

  /**
   * Get user's location using multiple fallback methods
   */
  static async getUserLocation(): Promise<LocationData> {
    if (this.cachedLocation) {
      return this.cachedLocation;
    }

    try {
      // Method 1: Try browser geolocation first (most accurate)
      const browserLocation = await this.getBrowserGeolocation();
      if (browserLocation) {
        this.cachedLocation = browserLocation;
        return browserLocation;
      }
    } catch (error) {
      console.log('Browser geolocation failed, trying IP-based location');
    }

    try {
      // Method 2: Fallback to IP-based geolocation
      const ipLocation = await this.getIPBasedLocation();
      this.cachedLocation = ipLocation;
      return ipLocation;
    } catch (error) {
      console.error('All geolocation methods failed:', error);
      // Return default location
      return this.getDefaultLocation();
    }
  }

  /**
   * Get location using browser's geolocation API
   */
  private static async getBrowserGeolocation(): Promise<LocationData | null> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocode the coordinates
            const location = await this.reverseGeocode(
              position.coords.latitude, 
              position.coords.longitude
            );
            resolve(location);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Get location based on IP address
   */
  private static async getIPBasedLocation(): Promise<LocationData> {
    // Using a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('IP geolocation service unavailable');
    }

    const data = await response.json();
    
    return {
      country: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      countryCode: data.country_code || 'XX',
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone
    };
  }

  /**
   * Reverse geocode coordinates to location data
   */
  private static async reverseGeocode(lat: number, lng: number): Promise<LocationData> {
    // Using a simple reverse geocoding approach
    // In production, you might want to use Google Maps API or similar
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      
      return {
        country: data.countryName || 'Unknown',
        region: data.principalSubdivision || 'Unknown',
        city: data.city || data.locality || 'Unknown',
        countryCode: data.countryCode || 'XX',
        latitude: lat,
        longitude: lng
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Fallback to IP-based location
      return this.getIPBasedLocation();
    }
  }

  /**
   * Get default location when all methods fail
   */
  private static getDefaultLocation(): LocationData {
    return {
      country: 'Unknown',
      region: 'Unknown', 
      city: 'Unknown',
      countryCode: 'XX'
    };
  }

  /**
   * Get regional waitlist data for urgency messaging
   */
  static async getRegionalWaitlistData(location?: LocationData): Promise<RegionalWaitlistData> {
    if (!location) {
      location = await this.getUserLocation();
    }

    const countryLimits = this.REGIONAL_LIMITS[location.country] || this.REGIONAL_LIMITS['Other'];
    
    // Simulate current registrations (in production, this would come from your database)
    const simulatedRegistrations = this.getSimulatedRegistrations(location.country);
    const remainingSpots = Math.max(0, countryLimits.total - simulatedRegistrations);
    
    // Calculate urgency level
    const fillPercentage = (simulatedRegistrations / countryLimits.total) * 100;
    let urgencyLevel: 'high' | 'medium' | 'low';
    
    if (fillPercentage >= 85) {
      urgencyLevel = 'high';
    } else if (fillPercentage >= 60) {
      urgencyLevel = 'medium'; 
    } else {
      urgencyLevel = 'low';
    }

    return {
      region: location.region,
      country: location.country,
      totalSpots: countryLimits.total,
      remainingSpots,
      currentPosition: simulatedRegistrations + 1,
      urgencyLevel
    };
  }

  /**
   * Simulate current registrations for demo purposes
   * In production, this would query your actual database
   */
  private static getSimulatedRegistrations(country: string): number {
    const limits = this.REGIONAL_LIMITS[country] || this.REGIONAL_LIMITS['Other'];
    const baseRegistrations = {
      'New Zealand': 42,
      'Australia': 128,
      'United States': 167,
      'United Kingdom': 89,
      'Canada': 63,
      'Singapore': 26,
      'Other': 31
    };
    
    // Add some randomness to make it feel more real
    const base = baseRegistrations[country] || baseRegistrations['Other'];
    const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
    
    return Math.min(limits.total - 1, Math.max(0, base + variance));
  }

  /**
   * Get urgency message based on regional data
   */
  static getUrgencyMessage(waitlistData: RegionalWaitlistData): string {
    const { country, remainingSpots, urgencyLevel } = waitlistData;
    
    if (urgencyLevel === 'high') {
      return `🔥 URGENT: Only ${remainingSpots} spots left in ${country}! Register now to secure your position.`;
    } else if (urgencyLevel === 'medium') {
      return `⚡ Limited Time: ${remainingSpots} early access spots remaining in ${country}.`;
    } else {
      return `🚀 Join ${waitlistData.currentPosition - 1} others in ${country} who've already secured their spot!`;
    }
  }

  /**
   * Get regional stats for display
   */
  static getRegionalStats(waitlistData: RegionalWaitlistData) {
    const fillPercentage = ((waitlistData.totalSpots - waitlistData.remainingSpots) / waitlistData.totalSpots) * 100;
    
    return {
      fillPercentage: Math.round(fillPercentage),
      spotsText: `${waitlistData.remainingSpots} of ${waitlistData.totalSpots} spots remaining`,
      positionText: `You would be #${waitlistData.currentPosition} in ${waitlistData.country}`,
      urgencyColor: waitlistData.urgencyLevel === 'high' ? 'red' : 
                   waitlistData.urgencyLevel === 'medium' ? 'yellow' : 'green'
    };
  }

  /**
   * Check if user should see high urgency messaging
   */
  static shouldShowHighUrgency(waitlistData: RegionalWaitlistData): boolean {
    return waitlistData.urgencyLevel === 'high' || waitlistData.remainingSpots <= 10;
  }
}

export type { LocationData, RegionalWaitlistData };