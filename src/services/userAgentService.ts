interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isSamsung: boolean;
  isSlowDevice: boolean;
  hasTouch: boolean;
  screenSize: 'small' | 'medium' | 'large';
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  deviceMemory: number | null;
  hardwareConcurrency: number;
  isBot: boolean;
}

class UserAgentService {
  private static instance: UserAgentService;
  private deviceInfo: DeviceInfo | null = null;
  private userAgent: string;

  private constructor() {
    this.userAgent = navigator.userAgent.toLowerCase();
  }

  public static getInstance(): UserAgentService {
    if (!UserAgentService.instance) {
      UserAgentService.instance = new UserAgentService();
    }
    return UserAgentService.instance;
  }

  public getDeviceInfo(): DeviceInfo {
    if (this.deviceInfo) {
      return this.deviceInfo;
    }

    // Detect in the right order to avoid circular dependencies
    const isTablet = this.detectTablet();
    const isMobile = this.detectMobile(isTablet);
    const isDesktop = !isMobile && !isTablet;

    this.deviceInfo = {
      isMobile,
      isTablet,
      isDesktop,
      isIOS: this.detectIOS(),
      isAndroid: this.detectAndroid(),
      isSafari: this.detectSafari(),
      isChrome: this.detectChrome(),
      isFirefox: this.detectFirefox(),
      isSamsung: this.detectSamsung(),
      isSlowDevice: this.detectSlowDevice(),
      hasTouch: this.detectTouch(),
      screenSize: this.detectScreenSize(),
      connectionType: this.detectConnectionType(),
      deviceMemory: this.detectDeviceMemory(),
      hardwareConcurrency: this.detectHardwareConcurrency(),
      isBot: this.detectBot()
    };

    return this.deviceInfo;
  }

  private detectMobile(isTablet?: boolean): boolean {
    // If it's a tablet, it's not mobile
    if (isTablet) {
      return false;
    }
    
    const mobileRegex = /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i;
    return mobileRegex.test(this.userAgent) || (window.innerWidth < 768 && !isTablet);
  }

  private detectTablet(): boolean {
    // iPad detection is more reliable with user agent
    const isIPad = /ipad/i.test(this.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Android tablets don't have "mobile" in their user agent
    const isAndroidTablet = /android/i.test(this.userAgent) && !/mobile/i.test(this.userAgent);
    
    // Generic tablet detection
    const isGenericTablet = /tablet/i.test(this.userAgent);
    
    return isIPad || isAndroidTablet || isGenericTablet;
  }

  private detectIOS(): boolean {
    return /iphone|ipad|ipod/.test(this.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  private detectAndroid(): boolean {
    return /android/.test(this.userAgent);
  }

  private detectSafari(): boolean {
    return /safari/.test(this.userAgent) && !/chrome/.test(this.userAgent);
  }

  private detectChrome(): boolean {
    return /chrome/.test(this.userAgent) && !/edge/.test(this.userAgent);
  }

  private detectFirefox(): boolean {
    return /firefox/.test(this.userAgent);
  }

  private detectSamsung(): boolean {
    return /samsungbrowser/.test(this.userAgent);
  }

  private detectSlowDevice(): boolean {
    // Check various indicators of a slow device
    const isLowMemory = this.detectDeviceMemory() !== null && this.detectDeviceMemory()! < 4;
    const isLowCores = this.detectHardwareConcurrency() < 4;
    const isSlowConnection = ['slow-2g', '2g', '3g'].includes(this.detectConnectionType());
    const isOldAndroid = this.detectAndroid() && this.getAndroidVersion() < 8;
    
    return isLowMemory || isLowCores || isSlowConnection || isOldAndroid;
  }

  private detectTouch(): boolean {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           (navigator as any).msMaxTouchPoints > 0;
  }

  private detectScreenSize(): 'small' | 'medium' | 'large' {
    const width = window.innerWidth;
    if (width < 640) return 'small';
    if (width < 1024) return 'medium';
    return 'large';
  }

  private detectConnectionType(): 'slow-2g' | '2g' | '3g' | '4g' | 'unknown' {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (!connection) return 'unknown';
    
    const effectiveType = connection.effectiveType;
    if (effectiveType) return effectiveType as any;
    
    // Fallback to checking downlink speed
    if (connection.downlink) {
      if (connection.downlink < 0.25) return 'slow-2g';
      if (connection.downlink < 0.75) return '2g';
      if (connection.downlink < 1.4) return '3g';
      return '4g';
    }
    
    return 'unknown';
  }

  private detectDeviceMemory(): number | null {
    return (navigator as any).deviceMemory || null;
  }

  private detectHardwareConcurrency(): number {
    return navigator.hardwareConcurrency || 1;
  }

  private detectBot(): boolean {
    const botRegex = /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|slack/i;
    return botRegex.test(this.userAgent);
  }

  private getAndroidVersion(): number {
    const match = this.userAgent.match(/android\s([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  // Performance optimization helpers
  public shouldReduceMotion(): boolean {
    const deviceInfo = this.getDeviceInfo();
    return deviceInfo.isSlowDevice || 
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  public shouldUseLowQualityImages(): boolean {
    const deviceInfo = this.getDeviceInfo();
    return deviceInfo.isSlowDevice || 
           ['slow-2g', '2g'].includes(deviceInfo.connectionType);
  }

  public shouldLazyLoadHeavyComponents(): boolean {
    const deviceInfo = this.getDeviceInfo();
    return deviceInfo.isMobile || deviceInfo.isSlowDevice;
  }

  public getOptimalImageFormat(): 'webp' | 'jpeg' {
    const deviceInfo = this.getDeviceInfo();
    // Use WebP for modern browsers, JPEG for older devices
    const supportsWebP = !deviceInfo.isSlowDevice && 
                        (deviceInfo.isChrome || deviceInfo.isFirefox || 
                         (deviceInfo.isSafari && this.getSafariVersion() >= 14));
    return supportsWebP ? 'webp' : 'jpeg';
  }

  private getSafariVersion(): number {
    const match = this.userAgent.match(/version\/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  public getRecommendedChunkSize(): number {
    const deviceInfo = this.getDeviceInfo();
    if (deviceInfo.connectionType === 'slow-2g') return 50; // 50KB chunks
    if (deviceInfo.connectionType === '2g') return 100; // 100KB chunks
    if (deviceInfo.connectionType === '3g') return 200; // 200KB chunks
    return 500; // 500KB chunks for 4G/unknown
  }

  public shouldPrefetch(): boolean {
    const deviceInfo = this.getDeviceInfo();
    return !deviceInfo.isSlowDevice && 
           ['4g', 'unknown'].includes(deviceInfo.connectionType) &&
           !deviceInfo.isBot;
  }
}

export const userAgentService = UserAgentService.getInstance();
export type { DeviceInfo };