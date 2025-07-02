import React, { useState } from 'react';
import { MapPin, Star, Clock, Wifi, Car, Heart, ArrowRight, Filter, Search, Crown, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DemoCattery {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  image: string;
  specialties: string[];
  amenities: string[];
  availability: 'available' | 'limited' | 'booked';
  description: string;
}

const ExploreCatteries: React.FC = () => {
  const { setCurrentStep } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedCattery, setSelectedCattery] = useState<DemoCattery | null>(null);

  const demoCatteries: DemoCattery[] = [
    {
      id: 'purrfect-paws',
      name: 'Purrfect Paws Cattery',
      location: 'Downtown District',
      distance: '2.3 miles',
      rating: 4.9,
      reviewCount: 127,
      priceRange: '$45-65/night',
      image: '/98a77826-5e2d-46e7-9ee0-ae09a32490f3.jpg',
      specialties: ['Senior Cats', 'Medical Care', 'Socialization'],
      amenities: ['24/7 Monitoring', 'Individual Suites', 'Outdoor Viewing'],
      availability: 'available',
      description: 'Premium cattery specializing in personalized care for cats of all ages. Our experienced staff provides individual attention and medical support when needed.'
    },
    {
      id: 'whiskers-haven',
      name: 'Whiskers Haven',
      location: 'Residential Area',
      distance: '4.7 miles',
      rating: 4.8,
      reviewCount: 89,
      priceRange: '$35-50/night',
      image: '/de189fd4-f7ec-4885-8050-316031f209f5.jpg',
      specialties: ['Multiple Cats', 'Play Time', 'Grooming'],
      amenities: ['Large Play Areas', 'Grooming Services', 'Daily Updates'],
      availability: 'limited',
      description: 'Family-run cattery perfect for families with multiple cats. Spacious accommodations and dedicated play areas ensure your cats stay active and happy.'
    },
    {
      id: 'feline-paradise',
      name: 'Feline Paradise Resort',
      location: 'Suburban Hills',
      distance: '6.1 miles',
      rating: 4.7,
      reviewCount: 203,
      priceRange: '$55-80/night',
      image: '/7054d274-40cc-49d1-ba82-70530de86643.jpg',
      specialties: ['Luxury Suites', 'Special Diets', 'Spa Services'],
      amenities: ['Luxury Suites', 'Spa Treatments', 'Custom Diets', 'Live Webcams'],
      availability: 'booked',
      description: 'Luxury cattery resort offering premium accommodations and spa services. Perfect for cats who deserve the very best during their stay.'
    },
    {
      id: 'cozy-cat-cottage',
      name: 'Cozy Cat Cottage',
      location: 'Garden District',
      distance: '3.2 miles',
      rating: 4.6,
      reviewCount: 156,
      priceRange: '$40-55/night',
      image: '/98a77826-5e2d-46e7-9ee0-ae09a32490f3.jpg',
      specialties: ['Anxious Cats', 'Quiet Environment', 'Homestyle Care'],
      amenities: ['Quiet Spaces', 'Anxiety Support', 'Home-like Setting'],
      availability: 'available',
      description: 'Peaceful cottage-style cattery designed for nervous or anxious cats. Our calm environment and patient staff help shy cats feel secure and comfortable.'
    }
  ];

  const filters = [
    { key: 'all', label: 'All Catteries', count: demoCatteries.length },
    { key: 'available', label: 'Available Now', count: demoCatteries.filter(c => c.availability === 'available').length },
    { key: 'premium', label: 'Premium Care', count: demoCatteries.filter(c => c.rating >= 4.8).length },
    { key: 'nearby', label: 'Under 5 Miles', count: demoCatteries.filter(c => parseFloat(c.distance) < 5).length }
  ];

  const filteredCatteries = demoCatteries.filter(cattery => {
    switch (selectedFilter) {
      case 'available': return cattery.availability === 'available';
      case 'premium': return cattery.rating >= 4.8;
      case 'nearby': return parseFloat(cattery.distance) < 5;
      default: return true;
    }
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'limited': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'booked': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'limited': return '2 spots left';
      case 'booked': return 'Fully booked';
      default: return 'Unknown';
    }
  };

  const handleJoinEarlyAccess = () => {
    setCurrentStep('registration');
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Demo Notice */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Premium Catteries</h1>
          <p className="text-zinc-400 text-lg mb-6">
            Discover quality cattery care in your area
          </p>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-400" />
              <h2 className="text-xl font-bold text-amber-400">Feature Preview</h2>
            </div>
            <p className="text-amber-200 mb-4">
              This is a preview of how our cattery exploration feature will work when we launch in 2026. 
              The catteries shown are examples to demonstrate our platform's capabilities.
            </p>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">🎯 Help Us Perfect This Feature</h3>
              <p className="text-zinc-300 text-sm">
                Your feedback on this demo helps us build the best cattery discovery experience. 
                What features would be most valuable to you as a cat parent?
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by location or cattery name..."
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled
              />
              <div className="absolute right-3 top-3 bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs">
                Demo
              </div>
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Current location: Your Area"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                  selectedFilter === filter.key
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                    : 'bg-zinc-700/50 border-zinc-600 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>{filter.label}</span>
                <span className="bg-zinc-600 text-zinc-300 px-2 py-0.5 rounded-full text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Catteries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCatteries.map((cattery) => (
            <div
              key={cattery.id}
              className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedCattery(cattery)}
            >
              <div className="relative">
                <img
                  src={cattery.image}
                  alt={cattery.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${getAvailabilityColor(cattery.availability)}`}>
                  {getAvailabilityText(cattery.availability)}
                </div>
                <div className="absolute bottom-3 left-3 bg-zinc-900/80 backdrop-blur-sm rounded-lg px-3 py-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-indigo-400" />
                    <span className="text-white text-xs">{cattery.distance}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {cattery.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-semibold">{cattery.rating}</span>
                    <span className="text-zinc-400 text-sm">({cattery.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <span className="text-zinc-300 text-sm">{cattery.location}</span>
                </div>

                <p className="text-zinc-300 text-sm mb-4 line-clamp-2">
                  {cattery.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {cattery.specialties.slice(0, 2).map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                  {cattery.specialties.length > 2 && (
                    <span className="text-zinc-400 text-xs py-1">
                      +{cattery.specialties.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-semibold">{cattery.priceRange}</span>
                  <button className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition-colors">
                    <span className="text-sm">View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Early Access CTA */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 border border-indigo-500/30 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Crown className="h-8 w-8 text-indigo-400" />
              <h2 className="text-3xl font-bold text-white">Love What You See?</h2>
            </div>
            
            <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
              This is just a preview of how our platform will revolutionize cattery bookings. 
              Join our early access program to help shape these features and secure founding member benefits.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <Search className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <h3 className="text-green-400 font-semibold mb-1">Smart Discovery</h3>
                <p className="text-zinc-300 text-sm">Advanced search and filtering based on your cat's needs</p>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <MapPin className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <h3 className="text-purple-400 font-semibold mb-1">Location Matching</h3>
                <p className="text-zinc-300 text-sm">Find nearby catteries with real-time availability</p>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <Heart className="h-6 w-6 text-red-400 mx-auto mb-2" />
                <h3 className="text-red-400 font-semibold mb-1">Verified Quality</h3>
                <p className="text-zinc-300 text-sm">All catteries verified for safety and quality standards</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleJoinEarlyAccess}
                className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 inline-flex items-center space-x-3"
              >
                <span>Join Early Access Program</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-sm text-zinc-400">
                🎯 Help shape this feature • 💎 Founding member benefits • 🔒 Free to join
              </p>
            </div>
          </div>
        </div>

        {/* Cattery Detail Modal */}
        {selectedCattery && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-800 rounded-2xl border border-zinc-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedCattery.image}
                  alt={selectedCattery.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedCattery(null)}
                  className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm rounded-full p-2 text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${getAvailabilityColor(selectedCattery.availability)}`}>
                  {getAvailabilityText(selectedCattery.availability)}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedCattery.name}</h2>
                    <div className="flex items-center space-x-2 text-zinc-300">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedCattery.location} • {selectedCattery.distance}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{selectedCattery.rating}</span>
                      <span className="text-zinc-400">({selectedCattery.reviewCount} reviews)</span>
                    </div>
                    <div className="text-green-400 font-semibold">{selectedCattery.priceRange}</div>
                  </div>
                </div>

                <p className="text-zinc-300 mb-6">{selectedCattery.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Specialties</h3>
                    <div className="space-y-2">
                      {selectedCattery.specialties.map((specialty, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                          <span className="text-zinc-300">{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
                    <div className="space-y-2">
                      {selectedCattery.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-zinc-300">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
                  <h3 className="text-amber-400 font-semibold mb-2">🔬 Demo Notice</h3>
                  <p className="text-amber-200 text-sm">
                    This is a preview of our cattery detail view. In the live platform, you'll be able to:
                    book directly, message owners, view availability calendars, and read detailed reviews.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    disabled
                    className="flex-1 bg-zinc-700 text-zinc-400 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Booking Available at Launch
                  </button>
                  <button
                    onClick={handleJoinEarlyAccess}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                  >
                    Join Early Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreCatteries;