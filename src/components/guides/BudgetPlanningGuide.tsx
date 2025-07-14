import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Calculator, Target, TrendingUp, Clock, Heart, AlertCircle } from 'lucide-react';
import Footer from '../Footer';

const BudgetPlanningGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-700 py-16">
        <div className="container mx-auto px-6">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            💰 Budget Planning for Cat Boarding
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Smart financial planning to ensure quality care without breaking the bank.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-blue-100">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              5 min read
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
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
              Planning your budget for cat boarding doesn't have to be stressful. With the right approach, you can ensure your feline friend receives excellent care while staying within your financial comfort zone. This guide will help you understand costs, plan ahead, and make smart decisions.
            </p>
          </div>

          {/* Average Costs Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">📊 Understanding Average Costs</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-400 mb-2">Budget Option</h3>
                <p className="text-2xl font-bold text-white mb-2">$35-50</p>
                <p className="text-green-200 text-sm">per night</p>
                <ul className="text-xs text-zinc-300 mt-3 space-y-1">
                  <li>• Basic care & feeding</li>
                  <li>• Shared spaces</li>
                  <li>• Standard cleaning</li>
                </ul>
              </div>

              <div className="bg-blue-900/20 border border-blue-600/30 rounded-xl p-6 text-center">
                <Calculator className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-blue-400 mb-2">Standard Option</h3>
                <p className="text-2xl font-bold text-white mb-2">$50-75</p>
                <p className="text-blue-200 text-sm">per night</p>
                <ul className="text-xs text-zinc-300 mt-3 space-y-1">
                  <li>• Individual accommodations</li>
                  <li>• Daily playtime</li>
                  <li>• Photo updates</li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-600/30 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-purple-400 mb-2">Premium Option</h3>
                <p className="text-2xl font-bold text-white mb-2">$75-120</p>
                <p className="text-purple-200 text-sm">per night</p>
                <ul className="text-xs text-zinc-300 mt-3 space-y-1">
                  <li>• Luxury suites</li>
                  <li>• Extended playtime</li>
                  <li>• Grooming services</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-200 text-sm">
                  <strong>Note:</strong> Prices vary significantly by location, season, and facility quality. Urban areas typically cost 20-40% more than rural locations.
                </p>
              </div>
            </div>
          </section>

          {/* Hidden Costs */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🔍 Hidden Costs to Consider</h2>
            
            <div className="space-y-4">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-400 mb-3">Additional Fees</h3>
                <div className="grid md:grid-cols-2 gap-4 text-zinc-300">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Common Add-ons</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Holiday surcharges (25-50% extra)</li>
                      <li>• Peak season rates</li>
                      <li>• Last-minute booking fees</li>
                      <li>• Extended checkout fees</li>
                      <li>• Food provision charges</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Medical & Special Care</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Medication administration ($5-15/day)</li>
                      <li>• Special diet preparation</li>
                      <li>• Extra cleaning for messy cats</li>
                      <li>• Veterinary visit coordination</li>
                      <li>• Behavioral support services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Budget Calculator */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🧮 Simple Budget Calculator</h2>
            
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Calculate Your Trip Cost</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Number of nights
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 7"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Daily rate (NZD)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 60"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Additional services
                    </label>
                    <select className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option value="0">None</option>
                      <option value="50">Basic add-ons (~$50)</option>
                      <option value="150">Premium add-ons (~$150)</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                  <h4 className="font-bold text-blue-400 mb-3">Estimated Total</h4>
                  <div className="space-y-2 text-sm text-zinc-300">
                    <div className="flex justify-between">
                      <span>Base cost:</span>
                      <span className="text-white">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Add-ons:</span>
                      <span className="text-white">$0</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-600/30 pt-2">
                      <span className="font-bold text-blue-400">Total:</span>
                      <span className="font-bold text-blue-400">$0</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-zinc-400">
                    * Excludes potential holiday surcharges and taxes
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Money-Saving Tips */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">💡 Money-Saving Strategies</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-4">Smart Booking Tips</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">•</span>
                    <span><strong>Book early:</strong> Many catteries offer 10-15% discounts for advance bookings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">•</span>
                    <span><strong>Avoid peak times:</strong> Holiday periods can cost 50% more</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">•</span>
                    <span><strong>Compare packages:</strong> Longer stays often have better nightly rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">•</span>
                    <span><strong>Group discounts:</strong> Multiple cats may qualify for reduced rates</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-4">Cost-Effective Choices</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong>Bring your own food:</strong> Saves $5-10 per day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong>Skip unnecessary add-ons:</strong> Focus on essential care</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong>Consider location:</strong> Suburban catteries often cost less</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span><strong>Check for loyalty programs:</strong> Regular customers get discounts</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Budget Planning Template */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">📋 Budget Planning Template</h2>
            
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Annual Cat Boarding Budget</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Planned trips per year
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 3"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Average nights per trip
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 5"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Target nightly rate
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 60"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mt-4">
                  <div className="text-center">
                    <p className="text-yellow-200 mb-2">Estimated Annual Budget</p>
                    <p className="text-3xl font-bold text-yellow-400">$0</p>
                    <p className="text-sm text-yellow-300 mt-1">≈ $0 per month to save</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Find Affordable Quality Care?
            </h2>
            <p className="text-blue-100 mb-6">
              Join Purrfect Stays to access transparent pricing and verified quality catteries that fit your budget.
            </p>
            <Link
              to="/"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Join Purrfect Stays
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BudgetPlanningGuide;