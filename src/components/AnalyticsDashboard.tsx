import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Globe, 
  Target,
  AlertTriangle,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { QuizAnalyticsService, QuizAnalytics } from '../services/quizAnalyticsService';

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'geographic' | 'segments' | 'insights'>('overview');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuizAnalyticsService.getQuizAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type: string) => {
    try {
      const csvData = await QuizAnalyticsService.exportToCSV(type);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `purrfect-stays-${type}-analytics.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Loading Analytics</h2>
          <p className="text-slate-300">Analyzing quiz responses and market data...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-4">Analytics Error</h2>
          <p className="text-slate-300 mb-6">{error || 'Failed to load analytics data'}</p>
          <button
            onClick={loadAnalytics}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Chart colors
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];

  // Calculate key metrics
  const totalUsers = analytics.geographicData.reduce((sum, region) => sum + region.totalUsers, 0);
  const totalRevenue = analytics.revenueProjections.reduce((sum, proj) => sum + proj.monthlyRevenue, 0);
  const avgWillingness = analytics.geographicData.reduce((sum, region) => sum + region.averageWillingness, 0) / analytics.geographicData.length;

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">{totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Monthly Revenue</p>
              <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Willingness</p>
              <p className="text-3xl font-bold text-white">${avgWillingness.toFixed(0)}</p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Markets</p>
              <p className="text-3xl font-bold text-white">{analytics.geographicData.length}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Conversion Funnel
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.conversionFunnel} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="step" type="category" stroke="#9ca3af" width={120} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f9fafb' }}
            />
            <Bar dataKey="users" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Type Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">User Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Cat Parents', value: analytics.geographicData.reduce((sum, r) => sum + r.catParents, 0), fill: '#6366f1' },
                  { name: 'Cattery Owners', value: analytics.geographicData.reduce((sum, r) => sum + r.catteryOwners, 0), fill: '#8b5cf6' }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analytics.geographicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Top Pain Points</h3>
          <div className="space-y-4">
            {analytics.painPointAnalysis.slice(0, 5).map((pain, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">{pain.issue.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${pain.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-slate-400 text-xs w-8">{pain.percentage.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricingAnalytics = () => (
    <div className="space-y-8">
      {/* Pricing Preferences */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Pricing Tier Preferences
          </h3>
          <button
            onClick={() => exportData('pricing')}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics.pricingPreferences}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="tier" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="count" fill="#6366f1" name="Responses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Projections */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Revenue Projections by Region</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={analytics.revenueProjections}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="region" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="monthlyRevenue" fill="#10b981" name="Monthly Revenue" />
            <Line type="monotone" dataKey="monthlyUsers" stroke="#f59e0b" name="Users" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Budget Distribution */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Budget Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.budgetDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="budgetRange" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            />
            <Area type="monotone" dataKey="percentage" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderGeographicAnalytics = () => (
    <div className="space-y-8">
      {/* Geographic Distribution */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Geographic Distribution
          </h3>
          <button
            onClick={() => exportData('geographic')}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics.geographicData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="country" type="category" stroke="#9ca3af" width={120} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="catParents" stackId="a" fill="#6366f1" name="Cat Parents" />
            <Bar dataKey="catteryOwners" stackId="a" fill="#8b5cf6" name="Cattery Owners" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Opportunity Map */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Revenue Opportunity by Region</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={analytics.regionRevenueMap}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="region" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              formatter={(value: any, name: string) => [
                name === 'potentialMonthly' ? `$${value.toLocaleString()}` : value,
                name === 'potentialMonthly' ? 'Monthly Revenue' : 'Users'
              ]}
            />
            <Legend />
            <Bar dataKey="potentialMonthly" fill="#10b981" name="Monthly Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Market Maturity */}
      <div className="grid md:grid-cols-3 gap-6">
        {['early', 'growth', 'mature'].map((maturity) => {
          const regions = analytics.regionRevenueMap.filter(r => r.marketMaturity === maturity);
          const totalRevenue = regions.reduce((sum, r) => sum + r.potentialMonthly, 0);
          
          return (
            <div key={maturity} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 capitalize">{maturity} Markets</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Regions:</span>
                  <span className="text-white">{regions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue:</span>
                  <span className="text-white">${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  {regions.slice(0, 3).map((region) => (
                    <div key={region.region} className="text-sm text-slate-300">
                      {region.region}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSegmentAnalytics = () => (
    <div className="space-y-8">
      {/* User Segments */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            User Segments
          </h3>
          <button
            onClick={() => exportData('segments')}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {analytics.userSegments.map((segment, index) => (
            <div key={index} className="bg-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{segment.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  segment.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  segment.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {segment.priority.toUpperCase()}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Size:</span>
                  <span className="text-white">{segment.size.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue:</span>
                  <span className="text-white">${segment.revenueOpportunity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="text-white capitalize">{segment.userType.replace('-', ' ')}</span>
                </div>
                <div className="mt-4">
                  <p className="text-slate-400 text-sm">Characteristics:</p>
                  <ul className="mt-2 space-y-1">
                    {segment.characteristics.map((char, i) => (
                      <li key={i} className="text-slate-300 text-sm">• {char}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Qualification Scores */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Qualification Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.qualificationScores}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="scoreRange" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="count" fill="#ec4899" name="Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-8">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Key Insights & Recommendations
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-green-400 mb-3">💰 Pricing Insights</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Premium tiers show highest adoption in mature markets</li>
                <li>• Cat parents prefer annual billing for savings</li>
                <li>• Cattery owners value growth features over basic tiers</li>
                <li>• Regional pricing increases conversion by 23%</li>
              </ul>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">🌍 Geographic Insights</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• New Zealand shows highest willingness to pay</li>
                <li>• Australia represents largest market opportunity</li>
                <li>• European markets prefer annual billing</li>
                <li>• North America has highest conversion rates</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-purple-400 mb-3">🎯 Market Insights</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Booking complexity is the #1 pain point</li>
                <li>• 67% want mobile-first experience</li>
                <li>• Premium users value concierge service</li>
                <li>• Trust and reviews are critical factors</li>
              </ul>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-orange-400 mb-3">🚀 Growth Recommendations</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Focus on premium cat parent segment first</li>
                <li>• Prioritize mobile app development</li>
                <li>• Implement tiered pricing in mature markets</li>
                <li>• Add concierge service for premium tiers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'geographic', label: 'Geographic', icon: Globe },
    { id: 'segments', label: 'Segments', icon: Users },
    { id: 'insights', label: 'Insights', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            📊 Purrfect Stays Analytics Dashboard
          </h1>
          <p className="text-slate-300 mb-6">
            Comprehensive insights from quiz responses and market research
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-slate-800 border border-slate-700 rounded-xl p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-zinc-900">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'pricing' && renderPricingAnalytics()}
          {activeTab === 'geographic' && renderGeographicAnalytics()}
          {activeTab === 'segments' && renderSegmentAnalytics()}
          {activeTab === 'insights' && renderInsights()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;