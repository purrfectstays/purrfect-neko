import React from 'react';
import { userAgentService } from '../services/userAgentService';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import MobileOptimizedImage from './MobileOptimizedImage';
import { SlowConnectionFallback, MobileOnly, DesktopOnly } from './MobileOptimizationProvider';

export default function MobileOptimizationDemo() {
  const deviceInfo = userAgentService.getDeviceInfo();
  const { 
    shouldReduceMotion,
    shouldUseLowQualityImages,
    shouldLazyLoad,
    imageFormat,
    chunkSize,
    shouldPrefetch
  } = useMobileOptimization();

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Device Information */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Device Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-400">Device Type:</span>
              <span className="ml-2 font-semibold">
                {deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400">Connection:</span>
              <span className="ml-2 font-semibold">{deviceInfo.connectionType}</span>
            </div>
            <div>
              <span className="text-zinc-400">OS:</span>
              <span className="ml-2 font-semibold">
                {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Other'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400">Browser:</span>
              <span className="ml-2 font-semibold">
                {deviceInfo.isChrome ? 'Chrome' : 
                 deviceInfo.isSafari ? 'Safari' : 
                 deviceInfo.isFirefox ? 'Firefox' : 'Other'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400">Device Memory:</span>
              <span className="ml-2 font-semibold">
                {deviceInfo.deviceMemory ? `${deviceInfo.deviceMemory}GB` : 'Unknown'}
              </span>
            </div>
            <div>
              <span className="text-zinc-400">CPU Cores:</span>
              <span className="ml-2 font-semibold">{deviceInfo.hardwareConcurrency}</span>
            </div>
            <div>
              <span className="text-zinc-400">Screen Size:</span>
              <span className="ml-2 font-semibold">{deviceInfo.screenSize}</span>
            </div>
            <div>
              <span className="text-zinc-400">Slow Device:</span>
              <span className="ml-2 font-semibold">{deviceInfo.isSlowDevice ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Optimization Settings */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Active Optimizations</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${shouldReduceMotion ? 'bg-green-500' : 'bg-zinc-600'}`} />
              <span>Reduced Motion {shouldReduceMotion ? '(Active)' : '(Inactive)'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${shouldUseLowQualityImages ? 'bg-green-500' : 'bg-zinc-600'}`} />
              <span>Low Quality Images {shouldUseLowQualityImages ? '(Active)' : '(Inactive)'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${shouldLazyLoad ? 'bg-green-500' : 'bg-zinc-600'}`} />
              <span>Lazy Loading {shouldLazyLoad ? '(Active)' : '(Inactive)'}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${shouldPrefetch ? 'bg-green-500' : 'bg-zinc-600'}`} />
              <span>Resource Prefetching {shouldPrefetch ? '(Active)' : '(Inactive)'}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <p className="text-sm text-zinc-400">
              Image Format: <span className="font-semibold">{imageFormat.toUpperCase()}</span>
            </p>
            <p className="text-sm text-zinc-400">
              Chunk Size: <span className="font-semibold">{chunkSize}KB</span>
            </p>
          </div>
        </div>

        {/* Responsive Components Demo */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Responsive Components</h2>
          
          {/* Mobile Only Content */}
          <MobileOnly>
            <div className="bg-indigo-600 rounded-lg p-4 mb-4">
              <p className="font-semibold">📱 Mobile-Only Content</p>
              <p className="text-sm mt-2">This content is only visible on mobile devices.</p>
            </div>
          </MobileOnly>

          {/* Desktop Only Content */}
          <DesktopOnly>
            <div className="bg-purple-600 rounded-lg p-4 mb-4">
              <p className="font-semibold">💻 Desktop-Only Content</p>
              <p className="text-sm mt-2">This content is only visible on desktop devices.</p>
            </div>
          </DesktopOnly>

          {/* Connection-based Content */}
          <SlowConnectionFallback
            fallback={
              <div className="bg-yellow-600 rounded-lg p-4">
                <p className="font-semibold">🐌 Simplified Content</p>
                <p className="text-sm mt-2">You're on a slow connection. Showing simplified content.</p>
              </div>
            }
          >
            <div className="bg-green-600 rounded-lg p-4">
              <p className="font-semibold">🚀 Rich Content</p>
              <p className="text-sm mt-2">You're on a fast connection. Enjoying full experience!</p>
            </div>
          </SlowConnectionFallback>
        </div>

        {/* Optimized Image Demo */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Optimized Image Loading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Priority Image</h3>
              <MobileOptimizedImage
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&auto=format"
                alt="Priority loaded cat"
                priority
                className="rounded-lg"
                width={400}
                height={300}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Lazy Loaded Image</h3>
              <MobileOptimizedImage
                src="https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400&h=300&fit=crop&auto=format"
                alt="Lazy loaded cattery"
                className="rounded-lg"
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Performance Recommendations</h2>
          <ul className="space-y-2 text-sm">
            {deviceInfo.isSlowDevice && (
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <span>Your device is detected as slow. Animations and effects have been reduced.</span>
              </li>
            )}
            {['slow-2g', '2g'].includes(deviceInfo.connectionType) && (
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <span>You're on a very slow connection. Images are loading in low quality.</span>
              </li>
            )}
            {deviceInfo.deviceMemory && deviceInfo.deviceMemory < 4 && (
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <span>Your device has limited memory. Some features may be simplified.</span>
              </li>
            )}
            {deviceInfo.isMobile && !deviceInfo.hasTouch && (
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">ℹ️</span>
                <span>Mobile device without touch detected. Consider updating your browser.</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}