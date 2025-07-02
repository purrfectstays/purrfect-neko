import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface SimpleQRCodeProps {
  url?: string;
  size?: number;
  className?: string;
}

const SimpleQRCode: React.FC<SimpleQRCodeProps> = ({
  url = 'https://purrfectstays.org',
  size = 150,
  className = ''
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsGenerating(true);
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 1,
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

  if (isGenerating) {
    return (
      <div 
        className={`bg-white rounded-lg p-2 flex items-center justify-center ${className}`}
        style={{ width: size + 16, height: size + 16 }}
      >
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-2 ${className}`}>
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
          <span className="text-gray-500 text-xs">QR Error</span>
        </div>
      )}
    </div>
  );
};

export default SimpleQRCode;