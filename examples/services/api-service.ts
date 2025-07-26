// Pattern: External API service with fallback strategies
interface GeoLocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  region: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pattern: Service class with caching and fallbacks
export class ExampleApiService {
  // Pattern: Static configuration
  private static readonly API_ENDPOINTS = {
    geolocation: 'https://api.ipgeolocation.io/ipgeo',
    weather: 'https://api.openweathermap.org/data/2.5/weather'
  };

  // Pattern: In-memory cache
  private static cache = new Map<string, { data: unknown; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Pattern: API key management
  private static getApiKey(service: string): string | null {
    const keys = {
      geolocation: import.meta.env.VITE_GEO_API_KEY,
      weather: import.meta.env.VITE_WEATHER_API_KEY
    };
    return keys[service as keyof typeof keys] || null;
  }

  // Pattern: Cache management
  private static getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private static setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Pattern: Fetch with timeout and error handling
  private static async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 5000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Pattern: Get user location with multiple fallbacks
  static async getUserLocation(): Promise<GeoLocationData> {
    const cacheKey = 'user_location';
    
    // Pattern: Check cache first
    const cached = this.getCached<GeoLocationData>(cacheKey);
    if (cached) return cached;

    try {
      // Pattern: Try browser geolocation first
      const browserLocation = await this.getBrowserLocation();
      if (browserLocation) {
        this.setCache(cacheKey, browserLocation);
        return browserLocation;
      }
    } catch {
      console.log('Browser geolocation failed, trying IP-based');
    }

    try {
      // Pattern: Fallback to IP-based geolocation
      const ipLocation = await this.getIpLocation();
      if (ipLocation) {
        this.setCache(cacheKey, ipLocation);
        return ipLocation;
      }
    } catch (error) {
      console.error('IP geolocation failed:', error);
    }

    // Pattern: Final fallback
    const defaultLocation: GeoLocationData = {
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
      country: 'US',
      region: 'NY'
    };
    
    this.setCache(cacheKey, defaultLocation);
    return defaultLocation;
  }

  // Pattern: Browser geolocation wrapper
  private static async getBrowserLocation(): Promise<GeoLocationData | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Pattern: Reverse geocoding
            const response = await this.fetchWithTimeout(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
            );
            
            const data = await response.json();
            
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              city: data.city || 'Unknown',
              country: data.countryCode || 'Unknown',
              region: data.principalSubdivision || 'Unknown'
            });
          } catch {
            resolve(null);
          }
        },
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  }

  // Pattern: IP-based geolocation
  private static async getIpLocation(): Promise<GeoLocationData | null> {
    const apiKey = this.getApiKey('geolocation');
    if (!apiKey) {
      console.warn('Geolocation API key not configured');
      return null;
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.API_ENDPOINTS.geolocation}?apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data = await response.json();

      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        city: data.city,
        country: data.country_code2,
        region: data.state_prov
      };
    } catch (error) {
      console.error('IP geolocation error:', error);
      return null;
    }
  }

  // Pattern: Weather API with error handling
  static async getWeather(
    latitude: number,
    longitude: number
  ): Promise<ApiResponse<WeatherData>> {
    const cacheKey = `weather_${latitude}_${longitude}`;
    
    // Check cache
    const cached = this.getCached<WeatherData>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const apiKey = this.getApiKey('weather');
    if (!apiKey) {
      return {
        success: false,
        error: 'Weather service not configured'
      };
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.API_ENDPOINTS.weather}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6) // m/s to km/h
      };

      this.setCache(cacheKey, weatherData);

      return {
        success: true,
        data: weatherData
      };
    } catch (error) {
      console.error('Weather API error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch weather'
      };
    }
  }

  // Pattern: Batch API calls with Promise.all
  static async getLocationWithWeather(): Promise<{
    location: GeoLocationData;
    weather: WeatherData | null;
  }> {
    try {
      // Get location first
      const location = await this.getUserLocation();
      
      // Then get weather for that location
      const weatherResponse = await this.getWeather(
        location.latitude,
        location.longitude
      );

      return {
        location,
        weather: weatherResponse.success ? weatherResponse.data! : null
      };
    } catch (error) {
      console.error('Location with weather error:', error);
      
      // Return location with null weather on error
      const location = await this.getUserLocation();
      return {
        location,
        weather: null
      };
    }
  }

  // Pattern: Rate limiting helper
  private static lastRequestTime = new Map<string, number>();
  private static readonly MIN_REQUEST_INTERVAL = 1000; // 1 second

  private static async enforceRateLimit(endpoint: string): Promise<void> {
    const lastTime = this.lastRequestTime.get(endpoint) || 0;
    const timeSinceLastRequest = Date.now() - lastTime;
    
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => 
        setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime.set(endpoint, Date.now());
  }

  // Pattern: Retry with exponential backoff
  private static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  // Pattern: Health check endpoint
  static async checkApiHealth(): Promise<{
    geolocation: boolean;
    weather: boolean;
  }> {
    const results = {
      geolocation: false,
      weather: false
    };

    // Check geolocation
    try {
      const location = await this.getIpLocation();
      results.geolocation = location !== null;
    } catch {
      results.geolocation = false;
    }

    // Check weather (using default coordinates)
    try {
      const weather = await this.getWeather(40.7128, -74.0060);
      results.weather = weather.success;
    } catch {
      results.weather = false;
    }

    return results;
  }
}

export default ExampleApiService;