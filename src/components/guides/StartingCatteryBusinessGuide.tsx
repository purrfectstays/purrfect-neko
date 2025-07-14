import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building, Users, FileText, DollarSign, Shield, Clock, Target, TrendingUp } from 'lucide-react';
import Footer from '../Footer';

const StartingCatteryBusinessGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 py-16">
        <div className="container mx-auto px-6">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-purple-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🏢 Starting Your Cattery Business
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl">
            Complete roadmap from concept to opening your professional cattery business.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-purple-100">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              12 min read
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Advanced
            </span>
            <span className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              Cattery Owner Guide
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
              Starting a cattery business is a rewarding venture that combines your love for cats with entrepreneurial success. This comprehensive guide covers everything from initial planning to grand opening, ensuring you build a sustainable and profitable business.
            </p>
          </div>

          {/* Business Planning */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">📊 Business Planning & Research</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Market Research</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Analyze Your Local Market</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• Research existing catteries in your area</li>
                      <li>• Identify gaps in services offered</li>
                      <li>• Study pricing strategies of competitors</li>
                      <li>• Assess seasonal demand patterns</li>
                      <li>• Survey potential customers about needs</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Target Customer Analysis</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• Demographics of cat owners in your area</li>
                      <li>• Average household income levels</li>
                      <li>• Travel patterns and frequency</li>
                      <li>• Preferred communication channels</li>
                      <li>• Price sensitivity and value priorities</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Business Model Options</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-blue-300 mb-2">Home-Based</h4>
                    <p className="text-xs text-zinc-300 mb-2">Small-scale operation from your property</p>
                    <ul className="text-xs text-zinc-400 space-y-1">
                      <li>• Lower startup costs</li>
                      <li>• Limited capacity (5-15 cats)</li>
                      <li>• Zoning restrictions apply</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-green-300 mb-2">Commercial Facility</h4>
                    <p className="text-xs text-zinc-300 mb-2">Dedicated commercial building</p>
                    <ul className="text-xs text-zinc-400 space-y-1">
                      <li>• Higher capacity (20-100+ cats)</li>
                      <li>• Professional appearance</li>
                      <li>• Significant investment required</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-purple-300 mb-2">Mobile/In-Home</h4>
                    <p className="text-xs text-zinc-300 mb-2">Care provided at client's location</p>
                    <ul className="text-xs text-zinc-400 space-y-1">
                      <li>• No facility costs</li>
                      <li>• Travel time considerations</li>
                      <li>• Different insurance needs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Legal & Licensing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">⚖️ Legal Requirements & Licensing</h2>
            
            <div className="space-y-6">
              <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-3">Essential Legal Steps</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3">Business Registration</h4>
                        <ul className="space-y-2 text-zinc-300 text-sm">
                          <li>• Choose business structure (LLC, Corporation, etc.)</li>
                          <li>• Register business name</li>
                          <li>• Obtain federal and state tax IDs</li>
                          <li>• Open business bank accounts</li>
                          <li>• Set up business accounting system</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-3">Permits & Licenses</h4>
                        <ul className="space-y-2 text-zinc-300 text-sm">
                          <li>• Business license from local authorities</li>
                          <li>• Animal boarding facility permit</li>
                          <li>• Zoning compliance verification</li>
                          <li>• Health department approvals</li>
                          <li>• Fire department safety inspection</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Insurance Requirements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Essential Coverage</h4>
                    <ul className="space-y-1 text-zinc-300 text-sm">
                      <li>• General liability insurance</li>
                      <li>• Professional liability (care, custody, control)</li>
                      <li>• Property insurance for facility</li>
                      <li>• Workers' compensation (if employees)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Optional but Recommended</h4>
                    <ul className="space-y-1 text-zinc-300 text-sm">
                      <li>• Business interruption insurance</li>
                      <li>• Equipment breakdown coverage</li>
                      <li>• Cyber liability protection</li>
                      <li>• Key person life insurance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Financial Planning */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">💰 Financial Planning & Startup Costs</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">Startup Cost Breakdown</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                      <h4 className="font-bold text-green-300 mb-2">Home-Based Cattery</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-zinc-300">
                          <span>Facility modifications:</span>
                          <span className="text-white">$15,000-30,000</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Equipment & supplies:</span>
                          <span className="text-white">$8,000-15,000</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Licensing & permits:</span>
                          <span className="text-white">$2,000-5,000</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Marketing & setup:</span>
                          <span className="text-white">$3,000-8,000</span>
                        </div>
                        <div className="border-t border-green-600/30 pt-2 flex justify-between font-bold">
                          <span className="text-green-300">Total Range:</span>
                          <span className="text-green-300">$28,000-58,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                      <h4 className="font-bold text-blue-300 mb-2">Commercial Facility</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-zinc-300">
                          <span>Building/renovation:</span>
                          <span className="text-white">$50,000-150,000</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Equipment & furnishing:</span>
                          <span className="text-white">$25,000-50,000</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Professional fees:</span>
                          <span className="text-white">$5,000-15,000</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Initial inventory:</span>
                          <span className="text-white">$5,000-10,000</span>
                        </div>
                        <div className="border-t border-blue-600/30 pt-2 flex justify-between font-bold">
                          <span className="text-blue-300">Total Range:</span>
                          <span className="text-blue-300">$85,000-225,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Revenue Projections</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <h4 className="font-bold text-white mb-2">Year 1</h4>
                    <p className="text-2xl font-bold text-yellow-400">$35,000-80,000</p>
                    <p className="text-sm text-zinc-400">Building customer base</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-white mb-2">Year 2</h4>
                    <p className="text-2xl font-bold text-yellow-400">$60,000-150,000</p>
                    <p className="text-sm text-zinc-400">Established operations</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-white mb-2">Year 3+</h4>
                    <p className="text-2xl font-bold text-yellow-400">$100,000-300,000</p>
                    <p className="text-sm text-zinc-400">Mature business</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Facility Design */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🏗️ Facility Design & Setup</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">Essential Areas</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Guest Areas</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• <strong>Individual suites:</strong> 4x4 ft minimum per cat</li>
                      <li>• <strong>Play areas:</strong> Supervised exercise spaces</li>
                      <li>• <strong>Quiet zones:</strong> For stressed or elderly cats</li>
                      <li>• <strong>Isolation area:</strong> For sick or quarantined cats</li>
                      <li>• <strong>Outdoor enclosures:</strong> Weather-protected catios</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Operational Areas</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• <strong>Reception area:</strong> Client check-in/out space</li>
                      <li>• <strong>Food prep kitchen:</strong> Meal preparation area</li>
                      <li>• <strong>Laundry room:</strong> Washing bedding and toys</li>
                      <li>• <strong>Storage areas:</strong> Food, supplies, cleaning</li>
                      <li>• <strong>Office space:</strong> Administration and records</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">Design Principles</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Safety First</h4>
                    <ul className="space-y-1 text-zinc-300 text-xs">
                      <li>• Secure latching systems</li>
                      <li>• Non-slip flooring</li>
                      <li>• Rounded corners</li>
                      <li>• Emergency exits</li>
                      <li>• Fire suppression systems</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Easy Maintenance</h4>
                    <ul className="space-y-1 text-zinc-300 text-xs">
                      <li>• Smooth, cleanable surfaces</li>
                      <li>• Floor drains for washing</li>
                      <li>• Built-in food/water systems</li>
                      <li>• Good ventilation</li>
                      <li>• Accessible storage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Cat Comfort</h4>
                    <ul className="space-y-1 text-zinc-300 text-xs">
                      <li>• Natural lighting</li>
                      <li>• Temperature control</li>
                      <li>• Noise reduction</li>
                      <li>• Hiding spaces</li>
                      <li>• Vertical climbing options</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Operations */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">⚙️ Operations & Staffing</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-4">Daily Operations Schedule</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Morning Routine (7:00-10:00 AM)</h4>
                    <ul className="space-y-1 text-zinc-300 text-sm">
                      <li>• Health checks and medication</li>
                      <li>• Breakfast service</li>
                      <li>• Litter box cleaning</li>
                      <li>• Play session 1</li>
                      <li>• Facility cleaning</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Evening Routine (4:00-7:00 PM)</h4>
                    <ul className="space-y-1 text-zinc-300 text-sm">
                      <li>• Dinner service</li>
                      <li>• Play session 2</li>
                      <li>• Final health checks</li>
                      <li>• Facility security check</li>
                      <li>• Daily reports/photos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Staffing Requirements</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Key Positions</h4>
                      <ul className="space-y-1 text-zinc-300 text-sm">
                        <li>• <strong>Owner/Manager:</strong> Overall operations</li>
                        <li>• <strong>Cat care specialists:</strong> Daily animal care</li>
                        <li>• <strong>Reception staff:</strong> Customer service</li>
                        <li>• <strong>Cleaning crew:</strong> Facility maintenance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Staffing Ratios</h4>
                      <ul className="space-y-1 text-zinc-300 text-sm">
                        <li>• <strong>Small (5-15 cats):</strong> 1-2 staff</li>
                        <li>• <strong>Medium (16-40 cats):</strong> 3-5 staff</li>
                        <li>• <strong>Large (40+ cats):</strong> 6+ staff</li>
                        <li>• <strong>Coverage needed:</strong> 12-16 hours/day</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">📅 Launch Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1-3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">Months 1-3: Planning & Preparation</h3>
                  <p className="text-zinc-300 text-sm">Business plan, location selection, licensing applications</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4-8
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-400 mb-2">Months 4-8: Construction & Setup</h3>
                  <p className="text-zinc-300 text-sm">Facility construction, equipment installation, staff hiring</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  9-12
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-2">Months 9-12: Marketing & Launch</h3>
                  <p className="text-zinc-300 text-sm">Marketing campaigns, soft opening, grand opening celebration</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Build Your Cattery Empire?
            </h2>
            <p className="text-purple-100 mb-6">
              Join Purrfect Stays to connect with other cattery owners and access our business support resources.
            </p>
            <Link
              to="/"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transition-colors inline-flex items-center gap-2"
            >
              <Building className="w-5 h-5" />
              Join Our Network
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StartingCatteryBusinessGuide;