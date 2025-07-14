import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Camera, MessageCircle, Star, Clock, Target, Smartphone } from 'lucide-react';
import Footer from '../Footer';

const MarketingStrategiesGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-amber-700 py-16">
        <div className="container mx-auto px-6">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📈 Effective Marketing Strategies
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            Proven marketing techniques to attract and retain loyal cattery customers.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-orange-100">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              10 min read
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Intermediate
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
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
              Successful cattery marketing isn't about flashy campaigns—it's about building trust, showcasing your care, and creating emotional connections with cat parents. This guide covers proven strategies that drive bookings and build lasting customer relationships.
            </p>
          </div>

          {/* Digital Presence */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🌐 Building Your Digital Presence</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Professional Website Essentials</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Must-Have Pages</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• <strong>Home:</strong> Clear value proposition and booking CTA</li>
                      <li>• <strong>Services:</strong> Detailed descriptions and pricing</li>
                      <li>• <strong>Facility Tour:</strong> High-quality photos and virtual tour</li>
                      <li>• <strong>About Us:</strong> Your story, credentials, and passion</li>
                      <li>• <strong>Testimonials:</strong> Reviews and success stories</li>
                      <li>• <strong>Contact:</strong> Easy booking and inquiry forms</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Technical Requirements</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• <strong>Mobile-responsive:</strong> 60%+ traffic is mobile</li>
                      <li>• <strong>Fast loading:</strong> Under 3 seconds load time</li>
                      <li>• <strong>SEO optimized:</strong> Local search visibility</li>
                      <li>• <strong>Online booking:</strong> 24/7 reservation system</li>
                      <li>• <strong>Live chat:</strong> Instant customer support</li>
                      <li>• <strong>SSL certificate:</strong> Secure and trustworthy</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Social Media Strategy</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-blue-300 mb-2">Facebook</h4>
                    <p className="text-xs text-zinc-300 mb-2">Primary platform for local businesses</p>
                    <ul className="text-xs text-zinc-400 space-y-1">
                      <li>• Business page with reviews</li>
                      <li>• Local community groups</li>
                      <li>• Event promotion</li>
                      <li>• Customer testimonials</li>
                    </ul>
                  </div>
                  
                  <div className="bg-pink-900/20 border border-pink-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-pink-300 mb-2">Instagram</h4>
                    <p className="text-xs text-zinc-300 mb-2">Visual storytelling platform</p>
                    <ul className="text-xs text-zinc-400 space-y-1">
                      <li>• Daily cat photos/videos</li>
                      <li>• Behind-the-scenes content</li>
                      <li>• Stories and Reels</li>
                      <li>• User-generated content</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-green-300 mb-2">TikTok</h4>
                    <p className="text-xs text-zinc-300 mb-2">Growing platform for younger demographics</p>
                    <ul className="text-xs text-zinc-400 space-y-1">
                      <li>• Funny cat moments</li>
                      <li>• Educational content</li>
                      <li>• Trending audio use</li>
                      <li>• Facility tours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Marketing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">📝 Content Marketing That Converts</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">Photo & Video Content Ideas</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Daily Content</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• <strong>Morning routine:</strong> Feeding time and health checks</li>
                      <li>• <strong>Play sessions:</strong> Cats enjoying toys and activities</li>
                      <li>• <strong>Nap time:</strong> Peaceful sleeping cats</li>
                      <li>• <strong>Individual spotlights:</strong> Feature each guest cat</li>
                      <li>• <strong>Staff interactions:</strong> Caring moments with team</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Educational Content</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• <strong>Cat care tips:</strong> Health and wellness advice</li>
                      <li>• <strong>Behavior insights:</strong> Understanding cat psychology</li>
                      <li>• <strong>Facility tours:</strong> Behind-the-scenes access</li>
                      <li>• <strong>Staff expertise:</strong> Team knowledge sharing</li>
                      <li>• <strong>Industry updates:</strong> Latest cattery standards</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Content Calendar Template</h3>
                <div className="grid grid-cols-7 gap-2 text-xs">
                  <div className="bg-yellow-900/20 p-2 rounded text-center font-bold text-yellow-300">Mon</div>
                  <div className="bg-yellow-900/20 p-2 rounded text-center font-bold text-yellow-300">Tue</div>
                  <div className="bg-yellow-900/20 p-2 rounded text-center font-bold text-yellow-300">Wed</div>
                  <div className="bg-yellow-900/20 p-2 rounded text-center font-bold text-yellow-300">Thu</div>
                  <div className="bg-yellow-900/20 p-2 rounded text-center font-bold text-yellow-300">Fri</div>
                  <div className="bg-yellow-900/20 p-2 rounded text-center font-bold text-yellow-300">Sat</div>
                  <div className="bg-yellow-900/20 p-2 rounded text-center font-bold text-yellow-300">Sun</div>
                  
                  <div className="bg-zinc-700/50 p-2 rounded text-zinc-300">
                    <div className="font-medium">Cat Spotlight</div>
                    <div className="text-yellow-400">Feature a guest</div>
                  </div>
                  <div className="bg-zinc-700/50 p-2 rounded text-zinc-300">
                    <div className="font-medium">Educational</div>
                    <div className="text-green-400">Care tips</div>
                  </div>
                  <div className="bg-zinc-700/50 p-2 rounded text-zinc-300">
                    <div className="font-medium">Play Time</div>
                    <div className="text-blue-400">Activity videos</div>
                  </div>
                  <div className="bg-zinc-700/50 p-2 rounded text-zinc-300">
                    <div className="font-medium">Team Thursday</div>
                    <div className="text-purple-400">Staff features</div>
                  </div>
                  <div className="bg-zinc-700/50 p-2 rounded text-zinc-300">
                    <div className="font-medium">Facility Friday</div>
                    <div className="text-pink-400">Behind scenes</div>
                  </div>
                  <div className="bg-zinc-700/50 p-2 rounded text-zinc-300">
                    <div className="font-medium">Weekend Fun</div>
                    <div className="text-orange-400">Relaxed content</div>
                  </div>
                  <div className="bg-zinc-700/50 p-2 rounded text-zinc-300">
                    <div className="font-medium">Sunday Stories</div>
                    <div className="text-indigo-400">Customer tales</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Local Marketing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🏘️ Local Community Marketing</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">Community Partnerships</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Veterinary Partnerships</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• <strong>Referral programs:</strong> Mutual customer referrals</li>
                      <li>• <strong>Educational seminars:</strong> Joint cat care workshops</li>
                      <li>• <strong>Emergency support:</strong> Backup boarding for vet clients</li>
                      <li>• <strong>Cross-promotion:</strong> Brochures in waiting rooms</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Pet Industry Connections</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• <strong>Pet stores:</strong> Display materials and referrals</li>
                      <li>• <strong>Groomers:</strong> Package deals and cross-promotion</li>
                      <li>• <strong>Pet sitters:</strong> Backup services partnership</li>
                      <li>• <strong>Animal rescues:</strong> Foster care support</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">Local SEO Strategy</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Google My Business</h4>
                    <ul className="space-y-1 text-zinc-300 text-xs">
                      <li>• Complete profile with photos</li>
                      <li>• Regular posts and updates</li>
                      <li>• Respond to all reviews</li>
                      <li>• Use relevant keywords</li>
                      <li>• Post special offers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Local Directories</h4>
                    <ul className="space-y-1 text-zinc-300 text-xs">
                      <li>• Yelp business listing</li>
                      <li>• Local chamber of commerce</li>
                      <li>• Pet industry directories</li>
                      <li>• Nextdoor neighborhood app</li>
                      <li>• Local Facebook groups</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Review Management</h4>
                    <ul className="space-y-1 text-zinc-300 text-xs">
                      <li>• Encourage happy customers</li>
                      <li>• Respond professionally</li>
                      <li>• Address concerns promptly</li>
                      <li>• Share positive reviews</li>
                      <li>• Monitor all platforms</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Retention */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🔄 Customer Retention Strategies</h2>
            
            <div className="space-y-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-pink-400 mb-4">Loyalty Programs</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-pink-900/20 border border-pink-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-pink-300 mb-3">Points-Based System</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• 1 point per dollar spent</li>
                      <li>• 100 points = $10 credit</li>
                      <li>• Bonus points for referrals</li>
                      <li>• Birthday month bonuses</li>
                      <li>• VIP tier benefits</li>
                    </ul>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-blue-300 mb-3">Frequency Rewards</h4>
                    <ul className="space-y-2 text-zinc-300 text-sm">
                      <li>• 5th visit gets 10% off</li>
                      <li>• 10th visit gets 20% off</li>
                      <li>• Annual membership discounts</li>
                      <li>• Extended stay bonuses</li>
                      <li>• Multi-cat family deals</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-4">Communication Excellence</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Pre-Arrival</h4>
                      <ul className="space-y-1 text-zinc-300 text-sm">
                        <li>• Booking confirmation</li>
                        <li>• Preparation checklist</li>
                        <li>• Day-before reminder</li>
                        <li>• Special instructions review</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">During Stay</h4>
                      <ul className="space-y-1 text-zinc-300 text-sm">
                        <li>• Daily photo updates</li>
                        <li>• Feeding confirmations</li>
                        <li>• Play session videos</li>
                        <li>• Health status reports</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Post-Visit</h4>
                      <ul className="space-y-1 text-zinc-300 text-sm">
                        <li>• Thank you message</li>
                        <li>• Photo gallery delivery</li>
                        <li>• Feedback survey</li>
                        <li>• Next booking incentive</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Marketing Budget */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">💰 Marketing Budget Allocation</h2>
            
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Recommended Budget Distribution</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-blue-300 mb-2">New Business (Year 1)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-zinc-300">
                        <span>Digital Marketing (40%):</span>
                        <span className="text-white">Website, SEO, Social</span>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Local Advertising (30%):</span>
                        <span className="text-white">Print, Radio, Events</span>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Partnerships (20%):</span>
                        <span className="text-white">Referral Programs</span>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Materials & Signage (10%):</span>
                        <span className="text-white">Brochures, Banners</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                    <h4 className="font-bold text-green-300 mb-2">Established Business (Year 2+)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-zinc-300">
                        <span>Customer Retention (35%):</span>
                        <span className="text-white">Loyalty, Communication</span>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Digital Presence (30%):</span>
                        <span className="text-white">Content, Social Media</span>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Referral Programs (20%):</span>
                        <span className="text-white">Customer Incentives</span>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Growth Initiatives (15%):</span>
                        <span className="text-white">New Services, Markets</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Budget Rule:</strong> Allocate 3-8% of gross revenue to marketing. New businesses may need up to 10% initially.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Supercharge Your Marketing?
            </h2>
            <p className="text-orange-100 mb-6">
              Join Purrfect Stays to access our marketing toolkit and connect with other successful cattery owners.
            </p>
            <Link
              to="/"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 transition-colors inline-flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Join Our Network
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarketingStrategiesGuide;