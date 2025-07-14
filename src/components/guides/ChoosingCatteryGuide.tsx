import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Star, MapPin, Phone, Clock, Heart } from 'lucide-react';
import Footer from '../Footer';

const ChoosingCatteryGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 py-16">
        <div className="container mx-auto px-6">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🔍 Complete Guide to Choosing the Right Cattery
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl">
            Everything you need to know to find the perfect home away from home for your feline friend.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-emerald-100">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              8 min read
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
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
          
          {/* Introduction */}
          <div className="prose prose-invert prose-lg max-w-none mb-12">
            <p className="text-xl text-zinc-300 leading-relaxed">
              Choosing the right cattery for your beloved feline is one of the most important decisions you'll make as a cat parent. This comprehensive guide will walk you through everything you need to know to ensure your cat receives the best possible care while you're away.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">📋 What You'll Learn</h2>
            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Essential questions to ask potential catteries
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Red flags to watch out for during visits
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Understanding licensing and certifications
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Evaluating facilities and accommodations
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                Comparing costs and value propositions
              </li>
            </ul>
          </div>

          {/* Essential Questions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">❓ Essential Questions to Ask</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-3">Staff Qualifications & Experience</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• What training do staff members receive?</li>
                  <li>• How long have the current staff been working there?</li>
                  <li>• Is there always someone on-site, including overnight?</li>
                  <li>• How do they handle medical emergencies?</li>
                </ul>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-3">Health & Safety Protocols</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• What vaccinations are required?</li>
                  <li>• How do they prevent disease transmission?</li>
                  <li>• What's their cleaning and disinfection schedule?</li>
                  <li>• Do they have relationships with local veterinarians?</li>
                </ul>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-3">Daily Care & Activities</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• How many times per day are cats fed?</li>
                  <li>• What enrichment activities are provided?</li>
                  <li>• How much individual attention does each cat receive?</li>
                  <li>• Can they accommodate special dietary needs?</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Red Flags */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🚩 Red Flags to Watch For</h2>
            
            <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-3">Warning Signs</h3>
                  <ul className="space-y-3 text-zinc-300">
                    <li>• <strong>Strong odors</strong> - Indicates poor cleaning practices</li>
                    <li>• <strong>Overcrowding</strong> - Too many cats in limited space</li>
                    <li>• <strong>Unwillingness to show facilities</strong> - Transparency is crucial</li>
                    <li>• <strong>No licensing or certifications</strong> - Legal compliance matters</li>
                    <li>• <strong>Sick-looking animals</strong> - Poor health management</li>
                    <li>• <strong>Stressed staff</strong> - High turnover or burnout</li>
                    <li>• <strong>No emergency procedures</strong> - Lack of crisis planning</li>
                    <li>• <strong>Extremely low prices</strong> - May indicate corner-cutting</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Facility Evaluation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🏠 Evaluating Facilities</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Indoor Spaces</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• Clean, well-ventilated rooms</li>
                  <li>• Comfortable temperature control</li>
                  <li>• Separate areas for eating, sleeping, and playing</li>
                  <li>• Easy-to-clean surfaces</li>
                  <li>• Natural light when possible</li>
                </ul>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">Safety Features</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li>• Secure enclosures with proper latches</li>
                  <li>• No sharp edges or hazardous materials</li>
                  <li>• Fire safety systems in place</li>
                  <li>• Backup power for essential systems</li>
                  <li>• First aid supplies readily available</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cost Considerations */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">💰 Understanding Costs</h2>
            
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">What's Typically Included</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Standard Services</h4>
                  <ul className="space-y-1 text-zinc-300 text-sm">
                    <li>• Daily feeding (your cat's food)</li>
                    <li>• Fresh water</li>
                    <li>• Litter box maintenance</li>
                    <li>• Basic playtime</li>
                    <li>• Health monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Premium Add-ons</h4>
                  <ul className="space-y-1 text-zinc-300 text-sm">
                    <li>• Extended play sessions</li>
                    <li>• Grooming services</li>
                    <li>• Daily photo updates</li>
                    <li>• Medication administration</li>
                    <li>• Special dietary accommodations</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Pro Tip:</strong> Don't choose based on price alone. The cheapest option may not provide the level of care your cat deserves. Focus on value and peace of mind.
                </p>
              </div>
            </div>
          </section>

          {/* Final Checklist */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">✅ Final Decision Checklist</h2>
            
            <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">Before You Book</h3>
              <div className="space-y-3">
                {[
                  'Visit during operating hours to see daily operations',
                  'Ask for references from current clients',
                  'Review their policies on feeding, medication, and emergencies',
                  'Confirm they can accommodate your cat\'s specific needs',
                  'Get all agreements in writing',
                  'Schedule a meet-and-greet if possible',
                  'Trust your instincts - you know your cat best'
                ].map((item, index) => (
                  <label key={index} className="flex items-start gap-3 text-zinc-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-4 h-4 text-emerald-500 bg-zinc-700 border-zinc-600 rounded focus:ring-emerald-500"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Find the Perfect Cattery?
            </h2>
            <p className="text-emerald-100 mb-6">
              Join Purrfect Stays to access our curated network of premium catteries, all pre-vetted to meet our high standards.
            </p>
            <Link
              to="/"
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors inline-flex items-center gap-2"
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

export default ChoosingCatteryGuide;