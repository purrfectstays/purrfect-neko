import React from 'react';
import { ArrowLeft, Smartphone, QrCode } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { navigateToLandingPage } from '../utils/navigation';

const QRCodePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900/20 py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back to Landing Page */}
        <div className="mb-8">
          <button
            onClick={navigateToLandingPage}
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Landing Page</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <QrCode className="h-8 w-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">QR Code Access</h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Quick access to Purrfect Stays - scan with your phone's camera to visit our platform instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* QR Code Section */}
          <div className="text-center">
            <QRCodeGenerator 
              url="https://purrfectstays.org"
              size={300}
              title="Visit Purrfect Stays"
              description="Point your camera at this code"
              showActions={true}
            />
          </div>

          {/* Instructions and Info */}
          <div className="space-y-8">
            {/* How to Scan */}
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-800/30">
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-semibold text-white">How to Scan</h2>
              </div>
              <ol className="space-y-3 text-zinc-300">
                <li className="flex items-start space-x-3">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                  <span>Open your phone's camera app</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                  <span>Point the camera at the QR code</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                  <span>Tap the notification that appears</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                  <span>You'll be taken to purrfectstays.org</span>
                </li>
              </ol>
            </div>

            {/* Platform Info */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-lg font-semibold text-green-400 mb-3">
                🐱 What You'll Find
              </h3>
              <ul className="space-y-2 text-zinc-300 text-sm">
                <li>• Revolutionary cattery booking platform</li>
                <li>• Early access registration for founding members</li>
                <li>• Exclusive benefits and priority access</li>
                <li>• Shape the future of cat care services</li>
              </ul>
            </div>

            {/* Mobile Optimized */}
            <div className="bg-indigo-500/10 rounded-xl p-6 border border-indigo-500/30">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                📱 Mobile Optimized
              </h3>
              <p className="text-zinc-300 text-sm">
                Our platform is fully optimized for mobile devices. Scan the QR code to experience 
                our seamless mobile interface designed specifically for cat parents and cattery owners.
              </p>
            </div>

            {/* Share Options */}
            <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                🚀 Share with Others
              </h3>
              <p className="text-zinc-300 text-sm mb-4">
                Help us grow our community! Download or share this QR code with fellow cat parents 
                and cattery owners who would benefit from Purrfect Stays.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400">
                <div>
                  <strong className="text-purple-300">For Cat Parents:</strong>
                  <br />Find premium cattery services
                </div>
                <div>
                  <strong className="text-purple-300">For Cattery Owners:</strong>
                  <br />Connect with more clients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 border border-indigo-800/30">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-zinc-300 mb-6">
              Join thousands of cat parents and cattery owners already on our waitlist
            </p>
            <button
              onClick={navigateToLandingPage}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              Explore Purrfect Stays
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;