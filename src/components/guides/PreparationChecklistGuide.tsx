import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Heart, Calendar, Package, FileText, Phone } from 'lucide-react';
import Footer from '../Footer';

const PreparationChecklistGuide: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const ChecklistItem: React.FC<{
    id: string;
    children: React.ReactNode;
    important?: boolean;
  }> = ({ id, children, important = false }) => (
    <label className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
      checkedItems.has(id) 
        ? 'bg-green-900/20 border border-green-600/30' 
        : important 
          ? 'bg-red-900/10 border border-red-600/20 hover:bg-red-900/20'
          : 'bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800/50'
    }`}>
      <input 
        type="checkbox" 
        checked={checkedItems.has(id)}
        onChange={() => toggleCheck(id)}
        className="mt-1 w-4 h-4 text-green-500 bg-zinc-700 border-zinc-600 rounded focus:ring-green-500"
      />
      <span className={`${checkedItems.has(id) ? 'text-green-300' : 'text-zinc-300'} ${important ? 'font-medium' : ''}`}>
        {children}
      </span>
    </label>
  );

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-600 to-rose-700 py-16">
        <div className="container mx-auto px-6">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-pink-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📋 Pre-Boarding Preparation Checklist
          </h1>
          <p className="text-xl text-pink-100 max-w-3xl">
            A comprehensive checklist to prepare your cat for their boarding experience and ensure peace of mind.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-pink-100">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              6 min read
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Beginner
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Cat Parent Guide
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress Indicator */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Preparation Progress</h2>
              <span className="text-sm text-zinc-400">
                {checkedItems.size} completed
              </span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(checkedItems.size / 25) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-zinc-400 mt-2">
              Complete all items for the best boarding experience
            </p>
          </div>

          {/* Timeline */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">📅 Preparation Timeline</h2>
            
            <div className="space-y-6">
              {/* 2-4 Weeks Before */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    2-4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-400">2-4 Weeks Before</h3>
                    <p className="text-zinc-400 text-sm">Early preparation and bookings</p>
                  </div>
                </div>
                
                <div className="ml-16 space-y-3">
                  <ChecklistItem id="research-catteries" important>
                    Research and visit potential catteries
                  </ChecklistItem>
                  <ChecklistItem id="book-cattery" important>
                    Book your preferred cattery (especially for holidays)
                  </ChecklistItem>
                  <ChecklistItem id="health-check">
                    Schedule a wellness check with your veterinarian
                  </ChecklistItem>
                  <ChecklistItem id="update-vaccinations" important>
                    Ensure all vaccinations are current (most require rabies, FVRCP)
                  </ChecklistItem>
                  <ChecklistItem id="flea-treatment">
                    Apply flea and tick prevention treatment
                  </ChecklistItem>
                </div>
              </div>

              {/* 1-2 Weeks Before */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    1-2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-400">1-2 Weeks Before</h3>
                    <p className="text-zinc-400 text-sm">Documentation and final preparations</p>
                  </div>
                </div>
                
                <div className="ml-16 space-y-3">
                  <ChecklistItem id="gather-documents" important>
                    Gather vaccination records and health certificates
                  </ChecklistItem>
                  <ChecklistItem id="emergency-contacts">
                    Prepare emergency contact information
                  </ChecklistItem>
                  <ChecklistItem id="food-supply">
                    Purchase extra food (enough for the entire stay)
                  </ChecklistItem>
                  <ChecklistItem id="medication-prep">
                    Organize medications with clear instructions
                  </ChecklistItem>
                  <ChecklistItem id="comfort-items">
                    Select comfort items (favorite blanket, toy)
                  </ChecklistItem>
                </div>
              </div>

              {/* 1-3 Days Before */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                    1-3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-400">1-3 Days Before</h3>
                    <p className="text-zinc-400 text-sm">Final arrangements and packing</p>
                  </div>
                </div>
                
                <div className="ml-16 space-y-3">
                  <ChecklistItem id="confirm-booking" important>
                    Confirm your booking and drop-off time
                  </ChecklistItem>
                  <ChecklistItem id="pack-supplies">
                    Pack all necessary supplies in labeled containers
                  </ChecklistItem>
                  <ChecklistItem id="care-instructions">
                    Write detailed care instructions
                  </ChecklistItem>
                  <ChecklistItem id="carrier-prep">
                    Clean and prepare the travel carrier
                  </ChecklistItem>
                  <ChecklistItem id="grooming">
                    Give your cat a gentle grooming session
                  </ChecklistItem>
                </div>
              </div>

              {/* Day of Drop-off */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    📅
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-400">Day of Drop-off</h3>
                    <p className="text-zinc-400 text-sm">Final steps before departure</p>
                  </div>
                </div>
                
                <div className="ml-16 space-y-3">
                  <ChecklistItem id="morning-routine">
                    Keep your cat's morning routine normal
                  </ChecklistItem>
                  <ChecklistItem id="no-big-meals">
                    Avoid large meals 2-3 hours before travel
                  </ChecklistItem>
                  <ChecklistItem id="double-check">
                    Double-check all packed items
                  </ChecklistItem>
                  <ChecklistItem id="contact-info">
                    Provide current contact information to staff
                  </ChecklistItem>
                  <ChecklistItem id="stay-calm">
                    Stay calm and positive during drop-off
                  </ChecklistItem>
                </div>
              </div>
            </div>
          </section>

          {/* Essential Packing List */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🎒 Essential Packing Checklist</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-400">Must-Have Items</h3>
                </div>
                <div className="space-y-2">
                  <ChecklistItem id="food-labeled">Food in labeled containers (enough for entire stay)</ChecklistItem>
                  <ChecklistItem id="medication-labeled">Medications with detailed instructions</ChecklistItem>
                  <ChecklistItem id="comfort-blanket">Familiar blanket or towel with your scent</ChecklistItem>
                  <ChecklistItem id="favorite-toy">One or two favorite toys (not too precious)</ChecklistItem>
                  <ChecklistItem id="vaccination-records">Current vaccination records</ChecklistItem>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400">Important Documents</h3>
                </div>
                <div className="space-y-2">
                  <ChecklistItem id="emergency-contacts-written">Emergency contact numbers</ChecklistItem>
                  <ChecklistItem id="vet-contact">Your veterinarian's contact information</ChecklistItem>
                  <ChecklistItem id="care-sheet">Detailed care instruction sheet</ChecklistItem>
                  <ChecklistItem id="feeding-schedule">Feeding schedule and portion sizes</ChecklistItem>
                  <ChecklistItem id="behavioral-notes">Notes about behavior and preferences</ChecklistItem>
                </div>
              </div>
            </div>
          </section>

          {/* Care Instructions Template */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">📝 Care Instructions Template</h2>
            
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">What to Include in Your Care Sheet</h3>
              
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-white mb-2">🍽️ Feeding Information</h4>
                    <ul className="space-y-1 text-zinc-300">
                      <li>• Brand and type of food</li>
                      <li>• Feeding times and portion sizes</li>
                      <li>• Treats (what and how often)</li>
                      <li>• Foods to avoid</li>
                      <li>• Water preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">💊 Medical Information</h4>
                    <ul className="space-y-1 text-zinc-300">
                      <li>• Current medications and dosages</li>
                      <li>• Administration times</li>
                      <li>• Known allergies</li>
                      <li>• Chronic conditions</li>
                      <li>• Signs of distress to watch for</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-white mb-2">😸 Personality & Preferences</h4>
                    <ul className="space-y-1 text-zinc-300">
                      <li>• Favorite hiding spots</li>
                      <li>• Play preferences</li>
                      <li>• Sociability level</li>
                      <li>• Stress responses</li>
                      <li>• Comforting techniques</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">📞 Emergency Contacts</h4>
                    <ul className="space-y-1 text-zinc-300">
                      <li>• Your primary phone number</li>
                      <li>• Secondary contact person</li>
                      <li>• Your veterinarian's details</li>
                      <li>• After-hours emergency vet</li>
                      <li>• Travel itinerary (if possible)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final Tips */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">💡 Final Tips for Success</h2>
            
            <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-600/30 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-pink-400 mb-3">Reducing Stress</h3>
                  <ul className="space-y-2 text-zinc-300 text-sm">
                    <li>• Keep your own emotions calm and positive</li>
                    <li>• Don't make a big deal about leaving</li>
                    <li>• Consider a trial day visit beforehand</li>
                    <li>• Bring items that smell like home</li>
                    <li>• Trust the professionals - they've done this before</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-pink-400 mb-3">Communication</h3>
                  <ul className="space-y-2 text-zinc-300 text-sm">
                    <li>• Ask about their update policy</li>
                    <li>• Request photos if available</li>
                    <li>• Don't hesitate to call if you're worried</li>
                    <li>• Be available for emergencies</li>
                    <li>• Schedule your pickup time in advance</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready for a Stress-Free Boarding Experience?
            </h2>
            <p className="text-pink-100 mb-6">
              Join Purrfect Stays to access catteries that make preparation easy with detailed guides and support.
            </p>
            <Link
              to="/"
              className="bg-white text-pink-600 px-8 py-4 rounded-xl font-bold hover:bg-pink-50 transition-colors inline-flex items-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Join Purrfect Stays
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PreparationChecklistGuide;