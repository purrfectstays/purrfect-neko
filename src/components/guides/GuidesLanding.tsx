import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Heart, Star, Target, TrendingUp } from 'lucide-react';
import Footer from '../Footer';

const GuidesLanding: React.FC = () => {
  const catParentGuides = [
    {
      id: 'choosing-cattery',
      title: 'Complete Guide to Choosing the Right Cattery',
      description: 'Everything you need to know to find the perfect home away from home for your feline friend.',
      icon: <BookOpen className="w-6 h-6" />,
      readTime: '8 min read',
      difficulty: 'Beginner',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'budget-planning',
      title: 'Budget Planning for Cat Boarding',
      description: 'Smart financial planning to ensure quality care without breaking the bank.',
      icon: <Target className="w-6 h-6" />,
      readTime: '5 min read',
      difficulty: 'Beginner',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'preparation-checklist',
      title: 'Pre-Boarding Preparation Checklist',
      description: 'A comprehensive checklist to prepare your cat for their boarding experience.',
      icon: <Heart className="w-6 h-6" />,
      readTime: '6 min read',
      difficulty: 'Beginner',
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const catteryOwnerGuides = [
    {
      id: 'starting-cattery-business',
      title: 'Starting Your Cattery Business',
      description: 'Complete roadmap from concept to opening your professional cattery business.',
      icon: <Users className="w-6 h-6" />,
      readTime: '12 min read',
      difficulty: 'Advanced',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'marketing-strategies',
      title: 'Effective Marketing Strategies',
      description: 'Proven marketing techniques to attract and retain loyal cattery customers.',
      icon: <TrendingUp className="w-6 h-6" />,
      readTime: '10 min read',
      difficulty: 'Intermediate',
      color: 'from-orange-500 to-amber-600'
    },
    {
      id: 'premium-service-excellence',
      title: 'Premium Service Excellence',
      description: 'Elevate your cattery with premium services that command higher prices.',
      icon: <Star className="w-6 h-6" />,
      readTime: '9 min read',
      difficulty: 'Advanced',
      color: 'from-violet-500 to-purple-600'
    }
  ];

  const GuideCard: React.FC<{
    guide: typeof catParentGuides[0];
    basePath: string;
  }> = ({ guide, basePath }) => (
    <Link
      to={`/guides/${guide.id}`}
      className="group block bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      <div className={`h-32 bg-gradient-to-br ${guide.color} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="text-white z-10">
          {guide.icon}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            guide.difficulty === 'Beginner' ? 'bg-green-500/90 text-white' :
            guide.difficulty === 'Intermediate' ? 'bg-yellow-500/90 text-black' :
            'bg-red-500/90 text-white'
          }`}>
            {guide.difficulty}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
            {guide.title}
          </h3>
          <ArrowRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
        </div>
        <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
          {guide.description}
        </p>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{guide.readTime}</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Free Guide
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              📚 Free Guides & Resources
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
              Expert knowledge for cat parents and cattery owners. Everything you need to provide the best care and build successful cattery businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#cat-parent-guides"
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors inline-flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                For Cat Parents
              </a>
              <a
                href="#cattery-owner-guides"
                className="bg-indigo-500/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-indigo-500/30 transition-colors inline-flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                For Cattery Owners
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cat Parent Guides Section */}
      <section id="cat-parent-guides" className="py-20 bg-zinc-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              🐱 For Cat Parents
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Essential guides to help you find the perfect cattery and ensure your feline friend receives the best possible care.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catParentGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} basePath="/guides" />
            ))}
          </div>
        </div>
      </section>

      {/* Cattery Owner Guides Section */}
      <section id="cattery-owner-guides" className="py-20 bg-zinc-800/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              🏠 For Cattery Owners
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Professional resources to help you build, grow, and optimize your cattery business for maximum success and customer satisfaction.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catteryOwnerGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} basePath="/guides" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join Purrfect Stays?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Get early access to our platform and unlock exclusive lifetime benefits as a founding member.
          </p>
          <Link
            to="/"
            className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors inline-flex items-center gap-2 text-lg"
          >
            Join the Waitlist
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GuidesLanding;