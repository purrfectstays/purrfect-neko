import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Share2, Copy, Check } from 'lucide-react';

interface QRCodeGeneratorProps {
  url?: string;
  size?: number;
  className?: string;
  showActions?: boolean;
  title?: string;
  description?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  url = 'https://purrfectstays.org',
  size = 200,
  className = '',
  showActions = true,
  title = 'Scan to Visit Purrfect Stays',
  description = 'Open your camera app and point it at this QR code'
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsGenerating(true);
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#1f2937', // Dark gray for better contrast
            light: '#ffffff'
          }
        });
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCode();
  }, [url, size]);

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'purrfect-stays-qr-code.png';
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      if (navigator.share && qrCodeDataUrl) {
        // Convert data URL to blob for sharing
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'purrfect-stays-qr.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Purrfect Stays QR Code',
          text: 'Scan this QR code to visit Purrfect Stays!',
          files: [file]
        });
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
        // Clear existing timeout and set new one
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.log('Share cancelled or failed');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // Clear existing timeout and set new one
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  if (isGenerating) {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <div 
          className="bg-white rounded-lg p-4 shadow-lg flex items-center justify-center"
          style={{ width: size + 32, height: size + 32 }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
        <p className="text-zinc-400 text-sm">Generating QR code...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* QR Code Display */}
      <div className="bg-white rounded-lg p-4 shadow-lg">
        {qrCodeDataUrl ? (
          <img 
            src={qrCodeDataUrl} 
            alt="QR Code for Purrfect Stays"
            className="block"
            style={{ width: size, height: size }}
          />
        ) : (
          <div 
            className="bg-gray-200 rounded flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <span className="text-gray-500 text-sm">Failed to generate QR code</span>
          </div>
        )}
      </div>

      {/* Title and Description */}
      <div className="text-center">
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-zinc-400 text-sm">{description}</p>
        <p className="text-indigo-400 text-xs mt-2 font-mono">{url}</p>
      </div>

      {/* Action Buttons */}
      {showActions && qrCodeDataUrl && (
        <div className="flex space-x-3">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
            title="Download QR Code"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
            title="Share QR Code"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          
          <button
            onClick={handleCopyUrl}
            className="flex items-center space-x-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy URL'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;