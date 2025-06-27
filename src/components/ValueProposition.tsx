import React from 'react';
import { Search, Calendar, DollarSign, Users, BarChart3, Zap, Shield, Star, Clock, TrendingUp, MapPin, Crown, Heart, Sparkles } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const catParentBenefits = [
    { 
      icon: MapPin, 
      title: "Geolocation & Map Search", 
      desc: "Find catteries near you with our smart location-based search. See distance, travel time, and local availability at a glance",
      highlight: "Find Nearby Care"
    },
    { 
      icon: Search, 
      title: "Smart Cattery Discovery", 
      desc: "Advanced search and filtering system to find catteries that match your cat's specific needs and your preferences",
      highlight: "Always FREE"
    },
    { 
      icon: Calendar, 
      title: "Streamlined Booking Process", 
      desc: "Real-time availability checking, simplified booking flow, and automated confirmation system",
      highlight: "Save Time & Effort"
    },
    { 
      icon: Shield, 
      title: "Verified Cattery Network", 
      desc: "Comprehensive verification process for all cattery partners to ensure quality and safety standards",
      highlight: "Safety First"
    }
  ];

  const catteryOwnerBenefits = [
    { 
      icon: MapPin, 
      title: "Increased Local Visibility", 
      desc: "Appear in location-based searches when cat parents look for nearby catteries. Capture local demand automatically",
      highlight: "Local Discovery"
    },
    { 
      icon: Users, 
      title: "Qualified Lead Generation", 
      desc: "Connect with pre-qualified cat parents actively seeking cattery services in your area",
      highlight: "Quality Connections"
    },
    { 
      icon: BarChart3, 
      title: "Business Management Tools", 
      desc: "Comprehensive dashboard with booking management, analytics, and customer communication features",
      highlight: "Streamline Operations"
    },
    { 
      icon: Zap, 
      title: "Automated Booking System", 
      desc: "Reduce manual work with automated booking confirmations, reminders, and payment processing",
      highlight: "Increase Efficiency"
    }
  ];

  return (
    <section className="py-20 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-manrope font-bold text-3xl sm:text-4xl text-white mb-4">
            Designed for Both Communities
          </h2>
          <p className="font-manrope text-xl text-zinc-300 max-w-3xl mx-auto">
            We're building a platform that serves both cat parents looking for quality care 
            and cattery owners seeking to grow their business efficiently.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Cat Parents */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-manrope font-bold text-2xl text-green-400">
                  For Cat Parents
                </h3>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  FREE PLATFORM
                </div>
              </div>
              <p className="font-manrope text-lg text-zinc-300">
                Find quality cattery care with confidence and ease
              </p>
            </div>
            
            {/* Cat Parent Image - Beautiful Orange Cat */}
            <div className="relative">
              <img 
                src="/98a77826-5e2d-46e7-9ee0-ae09a32490f3.jpg" 
                alt="Beautiful orange tabby cat with striking green eyes in a comfortable cattery setting"
                className="w-full h-72 object-cover rounded-xl shadow-lg border border-green-800/30"
              />
              <div className="absolute bottom-4 left-4 bg-zinc-800/95 backdrop-blur-sm rounded-lg p-3 border border-green-500/30 shadow-lg">
                <p className="font-manrope text-sm font-semibold text-white">
                  🧡 Happy, comfortable cats
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {catParentBenefits.map((benefit, index) => (
                <div key={index} className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-800/30 hover:border-green-600/50 transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition-colors">
                      <benefit.icon className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-manrope font-semibold text-lg text-white">
                          {benefit.title}
                        </h4>
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                          {benefit.highlight}
                        </span>
                      </div>
                      <p className="font-manrope text-zinc-300">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cat Parent Value Statement */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-manrope text-sm text-green-400 font-semibold">Our Commitment</span>
              </div>
              <p className="font-manrope text-zinc-300 italic">
                "We're committed to making cattery booking as simple and stress-free as possible, 
                while ensuring you always find the right care for your feline family members."
              </p>
            </div>
          </div>

          {/* Cattery Owners */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-manrope font-bold text-2xl text-purple-400">
                  For Cattery Owners
                </h3>
                <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  EARLY ACCESS
                </div>
              </div>
              <p className="font-manrope text-lg text-zinc-300">
                Grow your cattery business with modern tools and technology
              </p>
            </div>
            
            {/* Cattery Owner Image - Black and White Cat with Striking Eyes */}
            <div className="relative">
              <img 
                src="/de189fd4-f7ec-4885-8050-316031f209f5.jpg" 
                alt="Close-up of a beautiful black and white cat with striking golden eyes showing personalized attention"
                className="w-full h-72 object-cover rounded-xl shadow-lg border border-purple-800/30"
              />
              <div className="absolute bottom-4 left-4 bg-zinc-800/95 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30 shadow-lg">
                <p className="font-manrope text-sm font-semibold text-white">
                  👁️ Personalized attention & care
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {catteryOwnerBenefits.map((benefit, index) => (
                <div key={index} className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30 hover:border-purple-600/50 transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-500/20 p-3 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      <benefit.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-manrope font-semibold text-lg text-white">
                          {benefit.title}
                        </h4>
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-semibold">
                          {benefit.highlight}
                        </span>
                      </div>
                      <p className="font-manrope text-zinc-300">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Early Access Special for Cattery Owners */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-6 border border-amber-500/30">
              <h4 className="font-manrope font-bold text-lg text-amber-400 mb-4 text-center">
                👑 Early Access Exclusive
              </h4>
              <div className="space-y-4">
                <div className="bg-zinc-700/50 rounded-lg p-4 border-l-4 border-amber-500">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-manrope font-bold text-white">🎯 Shape the Platform</h5>
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">LIMITED</span>
                  </div>
                  <p className="text-amber-200 text-sm">Limited spots available by country • Help determine pricing and features • Full platform access included</p>
                </div>
                
                <div className="text-center">
                  <p className="font-manrope text-amber-300 text-sm">
                    💡 <strong>Your input shapes our platform</strong> - Help us build the perfect solution for cattery owners
                  </p>
                </div>
              </div>
            </div>

            {/* Cattery Owner Value Statement */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-manrope text-sm text-purple-400 font-semibold">Our Promise</span>
              </div>
              <p className="font-manrope text-zinc-300 italic">
                "We're building tools that help cattery owners focus on what they do best - 
                providing excellent care for cats - while we handle the technology and marketing."
              </p>
            </div>
          </div>
        </div>

        {/* NEW: Geolocation Feature Showcase */}
        <div className="mt-20 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 border border-indigo-500/20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-indigo-500/20 p-3 rounded-lg">
                <MapPin className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="font-manrope font-bold text-3xl text-white">
                Smart Location-Based Matching
              </h3>
            </div>
            <p className="font-manrope text-xl text-zinc-300 max-w-3xl mx-auto mb-4">
              Our geolocation technology connects cat parents with nearby catteries, 
              creating local communities and driving business growth for cattery owners.
            </p>
            
            {/* IMPORTANT DISCLAIMER */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="font-manrope text-sm font-semibold text-amber-400 uppercase tracking-wide">
                  Feature Preview
                </span>
              </div>
              <p className="font-manrope text-sm text-amber-200">
                <strong>Note:</strong> The Location-Based Discovery feature shown below is for illustration purposes only. 
                This will be the main feature of our platform when we launch in 2026.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Description */}
            <div className="space-y-6">
              <div className="bg-zinc-800/50 rounded-xl p-6 border border-indigo-500/30">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="h-6 w-6 text-green-400" />
                  <h4 className="font-manrope font-bold text-lg text-green-400">For Cat Parents</h4>
                </div>
                <ul className="space-y-2 text-zinc-300 font-manrope">
                  <li>• <strong>Find nearby catteries</strong> within your preferred distance</li>
                  <li>• <strong>See travel time</strong> and route planning integration</li>
                  <li>• <strong>Local availability</strong> at a glance with real-time updates</li>
                  <li>• <strong>Community reviews</strong> from other local cat parents</li>
                </ul>
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="h-6 w-6 text-purple-400" />
                  <h4 className="font-manrope font-bold text-lg text-purple-400">For Cattery Owners</h4>
                </div>
                <ul className="space-y-2 text-zinc-300 font-manrope">
                  <li>• <strong>Automatic local visibility</strong> when cat parents search nearby</li>
                  <li>• <strong>Capture local demand</strong> without additional marketing spend</li>
                  <li>• <strong>Service area optimization</strong> to reach the right customers</li>
                  <li>• <strong>Local market insights</strong> and competition analysis</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/30">
                <h4 className="font-manrope font-bold text-lg text-indigo-400 mb-3">
                  🎯 Win-Win for Everyone
                </h4>
                <p className="font-manrope text-zinc-300">
                  Cat parents find convenient, nearby care while cattery owners gain visibility 
                  in their local market. Our smart matching algorithm ensures the best fit for 
                  both distance and care requirements.
                </p>
              </div>
            </div>

            {/* Visual Representation */}
            <div className="relative">
              <div className="bg-zinc-800/50 rounded-xl p-8 border border-indigo-500/30">
                <div className="text-center mb-6">
                  <h4 className="font-manrope font-bold text-xl text-white mb-2">
                    Location-Based Discovery
                  </h4>
                  <p className="font-manrope text-sm text-zinc-400 mb-2">
                    How our geolocation feature will work
                  </p>
                  <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="font-manrope text-xs text-amber-400 font-semibold">
                      Concept Preview
                    </span>
                  </div>
                </div>

                {/* Mock Map Interface */}
                <div className="bg-zinc-700/50 rounded-lg p-6 border border-zinc-600">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-500/20 rounded-lg p-3 text-center border border-green-500/30">
                      <MapPin className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="text-xs text-green-400 font-semibold">Cat Parent</div>
                      <div className="text-xs text-zinc-400">You are here</div>
                    </div>
                    <div className="bg-purple-500/20 rounded-lg p-3 text-center border border-purple-500/30">
                      <div className="w-6 h-6 bg-purple-400 rounded-full mx-auto mb-2"></div>
                      <div className="text-xs text-purple-400 font-semibold">Cattery A</div>
                      <div className="text-xs text-zinc-400">2.3 miles</div>
                    </div>
                    <div className="bg-purple-500/20 rounded-lg p-3 text-center border border-purple-500/30">
                      <div className="w-6 h-6 bg-purple-400 rounded-full mx-auto mb-2"></div>
                      <div className="text-xs text-purple-400 font-semibold">Cattery B</div>
                      <div className="text-xs text-zinc-400">4.7 miles</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-zinc-600/50 rounded p-2">
                      <span className="text-xs text-zinc-300">🏠 Purrfect Paws Cattery</span>
                      <span className="text-xs text-green-400">2.3 mi • Available</span>
                    </div>
                    <div className="flex items-center justify-between bg-zinc-600/50 rounded p-2">
                      <span className="text-xs text-zinc-300">🏠 Whiskers Haven</span>
                      <span className="text-xs text-yellow-400">4.7 mi • 2 spots left</span>
                    </div>
                    <div className="flex items-center justify-between bg-zinc-600/50 rounded p-2">
                      <span className="text-xs text-zinc-300">🏠 Feline Paradise</span>
                      <span className="text-xs text-red-400">6.1 mi • Fully booked</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-zinc-400 font-manrope">
                    Real-time availability • Distance-based sorting • Route optimization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Value Proposition */}
        <div className="mt-16 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 border border-indigo-500/20">
          <div className="text-center">
            <h3 className="font-manrope font-bold text-2xl text-white mb-4">
              🚀 Building Together
            </h3>
            <p className="font-manrope text-lg text-zinc-300 mb-6 max-w-3xl mx-auto">
              As an early access member, you're helping us create a platform that truly serves the cat community. 
              Your feedback and insights directly influence our development priorities.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-2 text-zinc-300">
                <Clock className="h-5 w-5 text-indigo-400" />
                <span className="font-manrope">Early access to features</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-zinc-300">
                <Users className="h-5 w-5 text-purple-400" />
                <span className="font-manrope">Direct input on development</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-zinc-300">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-manrope">Early access member recognition</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;