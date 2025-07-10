import React, { useState } from 'react';
import { CheckCircle, Download, Star, Clock, Shield, Heart, FileText, Printer } from 'lucide-react';

const FreeCatTravelChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({});

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const printChecklist = () => {
    window.print();
  };

  const checklistData = {
    "2-3 Weeks Before Travel": [
      {
        id: "book-cattery",
        task: "Book your preferred cattery (peak seasons fill up fast)",
        priority: "high"
      },
      {
        id: "vet-checkup",
        task: "Schedule vet checkup and update vaccinations",
        priority: "high"
      },
      {
        id: "special-diet",
        task: "Discuss your cat's diet and medication schedule with cattery",
        priority: "medium"
      },
      {
        id: "emergency-contact",
        task: "Provide cattery with emergency vet contact information",
        priority: "high"
      }
    ],
    "1 Week Before Travel": [
      {
        id: "comfort-items",
        task: "Prepare comfort items (favorite blanket, toy, or shirt with your scent)",
        priority: "medium"
      },
      {
        id: "food-prep",
        task: "Pack enough of their regular food for the entire stay + 2 extra days",
        priority: "high"
      },
      {
        id: "medication-prep",
        task: "Organize medications with clear instructions and dosage times",
        priority: "high"
      },
      {
        id: "carrier-practice",
        task: "Let your cat practice being in their carrier for short periods",
        priority: "medium"
      },
      {
        id: "contact-info",
        task: "Create contact card with your details, flight info, and destination",
        priority: "high"
      }
    ],
    "Day of Drop-off": [
      {
        id: "morning-routine",
        task: "Keep morning routine normal - feed breakfast as usual",
        priority: "medium"
      },
      {
        id: "carrier-prep",
        task: "Place familiar blanket in carrier before loading cat",
        priority: "medium"
      },
      {
        id: "final-instructions",
        task: "Go over feeding schedule and special instructions with staff",
        priority: "high"
      },
      {
        id: "contact-schedule",
        task: "Confirm communication schedule (daily updates, photos, etc.)",
        priority: "high"
      },
      {
        id: "quick-goodbye",
        task: "Keep goodbye brief and positive - cats pick up on your anxiety",
        priority: "medium"
      }
    ],
    "What to Pack": [
      {
        id: "regular-food",
        task: "Regular food (enough for stay + 2 extra days)",
        priority: "high"
      },
      {
        id: "favorite-treats",
        task: "Favorite treats for comfort and positive association",
        priority: "medium"
      },
      {
        id: "comfort-blanket",
        task: "Blanket or towel that smells like home",
        priority: "medium"
      },
      {
        id: "favorite-toy",
        task: "1-2 favorite toys (avoid bringing ALL toys)",
        priority: "low"
      },
      {
        id: "medications",
        task: "All medications with clear dosage instructions",
        priority: "high"
      },
      {
        id: "carrier-familiar",
        task: "Use their regular carrier (familiar scents reduce stress)",
        priority: "medium"
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <CheckCircle className="h-3 w-3" />;
    }
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = Object.values(checklistData).flat().length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-900 text-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-4">
          <Shield className="h-5 w-5 text-indigo-400" />
          <span className="text-indigo-400 font-semibold text-sm">EXCLUSIVE FOR EARLY ACCESS MEMBERS</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          The Ultimate Cat Travel Checklist
        </h1>
        
        <p className="text-xl text-zinc-300 mb-6 max-w-2xl mx-auto">
          Ensure your cat's comfort and your peace of mind with this comprehensive preparation guide
        </p>

        {/* Progress Bar */}
        <div className="bg-zinc-800 rounded-full h-3 mb-4 max-w-md mx-auto">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-zinc-400">
          {completedCount} of {totalCount} items completed ({completionPercentage}%)
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={printChecklist}
            className="inline-flex items-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Checklist</span>
          </button>
          <button
            onClick={() => window.open('/cat-travel-checklist.pdf', '_blank')}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-8">
        {Object.entries(checklistData).map(([sectionTitle, items]) => (
          <div key={sectionTitle} className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center space-x-2">
              <span className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                {Object.keys(checklistData).indexOf(sectionTitle) + 1}
              </span>
              <span>{sectionTitle}</span>
            </h2>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-zinc-700/30 ${
                    checkedItems[item.id] ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-700/20 border-zinc-600/30'
                  }`}
                  onClick={() => toggleCheck(item.id)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {checkedItems[item.id] ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-zinc-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-base ${checkedItems[item.id] ? 'line-through text-zinc-400' : 'text-white'}`}>
                      {item.task}
                    </p>
                  </div>
                  
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                    {getPriorityIcon(item.priority)}
                    <span className="capitalize">{item.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Expert Tips Section */}
      <div className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
        <h3 className="text-2xl font-bold mb-4 text-white flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-400" />
          <span>Expert Tips for Stress-Free Boarding</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">✅ Do This</h4>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>• Visit the cattery beforehand if possible</li>
                <li>• Keep your departure routine normal and calm</li>
                <li>• Ask for daily photo updates</li>
                <li>• Leave a piece of your clothing for comfort</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-red-400 mb-2">❌ Avoid This</h4>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>• Don't change their diet right before boarding</li>
                <li>• Avoid prolonged emotional goodbyes</li>
                <li>• Don't pack every single toy they own</li>
                <li>• Never skip the vet checkup requirement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center bg-zinc-800/30 rounded-xl p-8 border border-zinc-700">
        <h3 className="text-2xl font-bold mb-4 text-white">Want More Exclusive Resources?</h3>
        <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
          As an early access member, you'll get access to our complete library of cat care guides, 
          exclusive cattery previews, and direct input on platform features.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.href = '/register'}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-800 transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>Get Cattery Evaluation Guide</span>
          </button>
          <button
            onClick={() => window.location.href = '/#features'}
            className="inline-flex items-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white px-8 py-3 rounded-lg transition-colors"
          >
            <span>Learn More About Early Access</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-zinc-500 text-sm">
        <p>© 2025 Purrfect Stays • Created exclusively for our early access community</p>
      </div>
    </div>
  );
};

export default FreeCatTravelChecklist;