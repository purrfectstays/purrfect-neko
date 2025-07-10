import React, { useState } from 'react';
import { Download, FileText, Shield, X, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ResourceAccessButton: React.FC = () => {
  const { userEmail, isVerified } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show for registered users
  const hasResourceAccess = userEmail && userEmail.length > 0;

  if (!hasResourceAccess) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mb-2 space-y-2 animate-in slide-in-from-bottom-2 duration-200">
          {/* Travel Checklist */}
          <div
            onClick={() => {
              window.location.href = '/cat-travel-checklist';
              setIsExpanded(false);
            }}
            className="flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer transition-all transform hover:scale-105 min-w-[200px]"
          >
            <FileText className="h-4 w-4 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-sm">Travel Checklist</p>
              <p className="text-xs text-indigo-200">Interactive guide</p>
            </div>
          </div>

          {/* Evaluation Guide */}
          <div
            onClick={() => {
              window.location.href = '/cattery-evaluation-guide';
              setIsExpanded(false);
            }}
            className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer transition-all transform hover:scale-105 min-w-[200px]"
          >
            <Shield className="h-4 w-4 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-sm">Evaluation Guide</p>
              <p className="text-xs text-purple-200">Assessment tool</p>
            </div>
          </div>

          {/* All Resources Hub */}
          <div
            onClick={() => {
              window.location.href = '/early-access-resources';
              setIsExpanded(false);
            }}
            className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer transition-all transform hover:scale-105 min-w-[200px]"
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-sm">All Resources</p>
              <p className="text-xs text-green-200">Resource hub</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform ${
          isExpanded 
            ? 'bg-zinc-700 hover:bg-zinc-600 rotate-180' 
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-110'
        }`}
        title={hasResourceAccess ? "Your Free Resources" : "Join to Access Resources"}
      >
        {isExpanded ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <Download className="h-6 w-6 text-white" />
            {/* Status indicator */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              isVerified ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
          </div>
        )}
      </button>

      {/* Tooltip for new users */}
      {!isExpanded && (
        <div className="absolute bottom-16 right-0 bg-zinc-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isVerified ? 'Your Premium Resources' : 'Access Your Free Guides'}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-800"></div>
        </div>
      )}
    </div>
  );
};

export default ResourceAccessButton;