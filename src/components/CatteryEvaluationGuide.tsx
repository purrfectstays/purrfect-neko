import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Star, Shield, Eye, MapPin, Phone, Clock, Download, FileText, Printer } from 'lucide-react';

const CatteryEvaluationGuide: React.FC = () => {
  const [evaluationScores, setEvaluationScores] = useState<{[key: string]: number}>({});
  const [currentCatteryName, setCurrentCatteryName] = useState('');

  const updateScore = (categoryId: string, score: number) => {
    setEvaluationScores(prev => ({
      ...prev,
      [categoryId]: score
    }));
  };

  const evaluationCategories = {
    "Facility & Cleanliness": {
      id: "facility",
      weight: 25,
      criteria: [
        {
          id: "cleanliness",
          question: "Overall cleanliness and odor control",
          redFlags: ["Strong odors", "Dirty surfaces", "Overflowing litter boxes"],
          greenFlags: ["Fresh, clean scent", "Spotless surfaces", "Well-maintained litter areas"]
        },
        {
          id: "space",
          question: "Adequate space and housing quality",
          redFlags: ["Cramped cages", "Poor ventilation", "No windows/natural light"],
          greenFlags: ["Spacious enclosures", "Good airflow", "Natural light access"]
        },
        {
          id: "safety",
          question: "Safety measures and secure enclosures",
          redFlags: ["Gaps in fencing", "Broken latches", "Sharp edges"],
          greenFlags: ["Secure locks", "Escape-proof design", "Safety protocols visible"]
        }
      ]
    },
    "Staff & Care Quality": {
      id: "staff",
      weight: 30,
      criteria: [
        {
          id: "knowledge",
          question: "Staff knowledge and cat handling skills",
          redFlags: ["Rough handling", "Limited cat knowledge", "No training certificates"],
          greenFlags: ["Gentle, confident handling", "Cat behavior expertise", "Certified staff"]
        },
        {
          id: "attention",
          question: "Individual attention and interaction",
          redFlags: ["Rushed interactions", "One-size-fits-all approach", "No playtime"],
          greenFlags: ["Personalized care", "Regular interaction", "Enrichment activities"]
        },
        {
          id: "ratios",
          question: "Staff-to-cat ratios during peak times",
          redFlags: ["Understaffed", "One person managing 20+ cats", "No backup staff"],
          greenFlags: ["Adequate staffing", "1:10 ratio or better", "Multiple staff on duty"]
        }
      ]
    },
    "Health & Medical": {
      id: "health",
      weight: 25,
      criteria: [
        {
          id: "protocols",
          question: "Health monitoring and medical protocols",
          redFlags: ["No vet relationships", "Unclear medical procedures", "No health checks"],
          greenFlags: ["On-call vet access", "Clear medical protocols", "Daily health monitoring"]
        },
        {
          id: "vaccination",
          question: "Vaccination and health requirements",
          redFlags: ["Lax vaccination policies", "No health certificates required", "Sick cats present"],
          greenFlags: ["Strict vaccination requirements", "Health certificate verification", "Isolation protocols"]
        },
        {
          id: "emergency",
          question: "Emergency procedures and preparedness",
          redFlags: ["No emergency plan", "Far from vet clinic", "Unclear procedures"],
          greenFlags: ["Written emergency procedures", "Nearby vet access", "24/7 emergency contacts"]
        }
      ]
    },
    "Communication & Transparency": {
      id: "communication",
      weight: 20,
      criteria: [
        {
          id: "updates",
          question: "Communication frequency and quality",
          redFlags: ["No updates provided", "Generic messages", "Hard to reach staff"],
          greenFlags: ["Daily updates", "Photo/video sharing", "Responsive communication"]
        },
        {
          id: "policies",
          question: "Clear policies and pricing transparency",
          redFlags: ["Hidden fees", "Vague policies", "No written agreements"],
          greenFlags: ["Transparent pricing", "Clear written policies", "Detailed contracts"]
        },
        {
          id: "availability",
          question: "Booking and availability transparency",
          redFlags: ["Last-minute cancellations", "Overbooking", "Unclear availability"],
          greenFlags: ["Reliable booking system", "Honest availability", "Advance notice policies"]
        }
      ]
    }
  };

  const calculateTotalScore = () => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    Object.entries(evaluationCategories).forEach(([categoryName, category]) => {
      const categoryAverage = category.criteria.reduce((sum, criterion) => {
        return sum + (evaluationScores[criterion.id] || 0);
      }, 0) / category.criteria.length;

      totalWeightedScore += categoryAverage * (category.weight / 100);
      totalWeight += category.weight / 100;
    });

    return Math.round(totalWeightedScore);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "D";
  };

  const totalScore = calculateTotalScore();
  const completedCriteria = Object.keys(evaluationScores).length;
  const totalCriteria = Object.values(evaluationCategories).reduce((sum, cat) => sum + cat.criteria.length, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-zinc-900 text-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
          <Shield className="h-5 w-5 text-purple-400" />
          <span className="text-purple-400 font-semibold text-sm">EXCLUSIVE FOR EARLY ACCESS MEMBERS</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Cattery Evaluation Guide
        </h1>
        
        <p className="text-xl text-zinc-300 mb-6 max-w-3xl mx-auto">
          Professional assessment framework to ensure you choose the perfect cattery for your feline family member
        </p>

        {/* Current Evaluation */}
        <div className="bg-zinc-800/50 rounded-xl p-6 max-w-md mx-auto mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Cattery Name (Optional)
            </label>
            <input
              type="text"
              value={currentCatteryName}
              onChange={(e) => setCurrentCatteryName(e.target.value)}
              placeholder="Enter cattery name..."
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Current Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore}/100
              </p>
              <p className={`text-lg font-semibold ${getScoreColor(totalScore)}`}>
                Grade: {getScoreGrade(totalScore)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">Progress</p>
              <p className="text-lg font-semibold text-white">
                {completedCriteria}/{totalCriteria}
              </p>
              <div className="w-20 bg-zinc-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCriteria / totalCriteria) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Evaluation</span>
          </button>
          <button
            onClick={() => window.open('/cattery-evaluation-guide.pdf', '_blank')}
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Evaluation Categories */}
      <div className="space-y-8">
        {Object.entries(evaluationCategories).map(([categoryName, category]) => {
          const categoryScores = category.criteria.map(c => evaluationScores[c.id] || 0);
          const categoryAverage = categoryScores.reduce((a, b) => a + b, 0) / category.criteria.length;
          
          return (
            <div key={category.id} className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {categoryName}
                </h2>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Weight: {category.weight}%</p>
                  <p className={`text-xl font-bold ${getScoreColor(categoryAverage)}`}>
                    {Math.round(categoryAverage)}/100
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {category.criteria.map((criterion) => (
                  <div key={criterion.id} className="bg-zinc-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {criterion.question}
                    </h3>
                    
                    {/* Rating Scale */}
                    <div className="mb-4">
                      <p className="text-sm text-zinc-400 mb-2">Rate this aspect (0-100):</p>
                      <div className="flex space-x-2">
                        {[20, 40, 60, 80, 100].map((value) => (
                          <button
                            key={value}
                            onClick={() => updateScore(criterion.id, value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              evaluationScores[criterion.id] === value
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-600 text-zinc-300 hover:bg-zinc-500'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Red Flags */}
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-red-400 mb-3 flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Red Flags</span>
                        </h4>
                        <ul className="space-y-1">
                          {criterion.redFlags.map((flag, index) => (
                            <li key={index} className="text-sm text-red-300 flex items-start space-x-2">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Green Flags */}
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-green-400 mb-3 flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Green Flags</span>
                        </h4>
                        <ul className="space-y-1">
                          {criterion.greenFlags.map((flag, index) => (
                            <li key={index} className="text-sm text-green-300 flex items-start space-x-2">
                              <span className="text-green-400 mt-0.5">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Results Summary */}
      {completedCriteria > 0 && (
        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-500/20">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">
            Evaluation Summary {currentCatteryName && `for ${currentCatteryName}`}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(totalScore)} mb-2`}>
                {totalScore}
              </div>
              <p className="text-zinc-300">Overall Score</p>
              <p className={`text-xl font-semibold ${getScoreColor(totalScore)}`}>
                Grade {getScoreGrade(totalScore)}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {Math.round((completedCriteria / totalCriteria) * 100)}%
              </div>
              <p className="text-zinc-300">Evaluation Complete</p>
              <p className="text-sm text-zinc-400">
                {completedCriteria} of {totalCriteria} criteria assessed
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">
                {totalScore >= 80 ? '😸' : totalScore >= 60 ? '😺' : '🙀'}
              </div>
              <p className="text-zinc-300">
                {totalScore >= 80 ? 'Excellent Choice!' : 
                 totalScore >= 60 ? 'Good Option' : 'Needs Improvement'}
              </p>
              <p className="text-sm text-zinc-400">
                {totalScore >= 80 ? 'Highly recommended cattery' :
                 totalScore >= 60 ? 'Acceptable with reservations' :
                 'Consider other options'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Resources CTA */}
      <div className="mt-12 text-center bg-zinc-800/30 rounded-xl p-8 border border-zinc-700">
        <h3 className="text-2xl font-bold mb-4 text-white">Need More Cat Care Resources?</h3>
        <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
          Get access to our complete library of cat care guides, exclusive cattery previews, 
          and be the first to use our cattery booking platform when it launches.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.href = '/cat-travel-checklist'}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-800 transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>Get Travel Checklist</span>
          </button>
          <button
            onClick={() => window.location.href = '/register'}
            className="inline-flex items-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white px-8 py-3 rounded-lg transition-colors"
          >
            <span>Join Early Access</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-zinc-500 text-sm">
        <p>© 2025 Purrfect Stays • Professional cattery evaluation framework for early access members</p>
      </div>
    </div>
  );
};

export default CatteryEvaluationGuide;