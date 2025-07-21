import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Shield, FileText, Cookie, Heart, QrCode } from 'lucide-react';
import { navigateToLandingPage, navigateToSupport, navigateToPrivacy, navigateToTerms, navigateToCookies, navigateToQRCode } from '../utils/navigation';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { setCurrentStep } = useApp();

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Logo size="md" variant="full" className="mb-4" />
            <p className="font-manrope text-zinc-400 mb-6 max-w-md">
              Revolutionizing cattery bookings by connecting cat parents with premium catteries. 
              Join our early access community and help shape the future of cat care.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="font-manrope text-zinc-400">
                Made with love for the cat community
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-manrope font-bold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setCurrentStep('registration')}
                  className="font-manrope text-zinc-400 hover:text-white transition-colors text-left"
                >
                  Cattery Owner?
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentStep('explore-catteries')}
                  className="font-manrope text-zinc-400 hover:text-white transition-colors text-left"
                >
                  Preview Platform
                </button>
              </li>
              <li>
                <button
                  onClick={navigateToQRCode}
                  className="font-manrope text-zinc-400 hover:text-white transition-colors flex items-center space-x-2 text-left"
                >
                  <QrCode className="h-4 w-4" />
                  <span>QR Code</span>
                </button>
              </li>
              <li>
                <a
                  href="mailto:hello@purrfectstays.org"
                  className="font-manrope text-zinc-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="font-manrope font-bold text-white mb-4">Legal & Support</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={navigateToPrivacy}
                  className="font-manrope text-zinc-400 hover:text-white transition-colors flex items-center space-x-2 text-left"
                >
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={navigateToTerms}
                  className="font-manrope text-zinc-400 hover:text-white transition-colors flex items-center space-x-2 text-left"
                >
                  <FileText className="h-4 w-4" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={navigateToCookies}
                  className="font-manrope text-zinc-400 hover:text-white transition-colors flex items-center space-x-2 text-left"
                >
                  <Cookie className="h-4 w-4" />
                  <span>Cookie Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={navigateToSupport}
                  className="font-manrope text-zinc-400 hover:text-white transition-colors flex items-center space-x-2 text-left"
                >
                  <Mail className="h-4 w-4" />
                  <span>Support</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="font-manrope text-zinc-400 text-sm">
                © 2025 Purrfect Stays. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-zinc-500">
                <span>🚀 Beta launching Q4 2025</span>
                <span>•</span>
                <span>🐱 Built for cat lovers</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                Early Access Open
              </div>
              <div className="text-zinc-400 text-xs">
                Limited Spots Available
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Extra bottom padding to prevent chatbot overlap */}
      <div className="h-20"></div>
    </footer>
  );
};

export default Footer;