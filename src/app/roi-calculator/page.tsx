'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, TrendingUp, DollarSign, Clock, Users } from 'lucide-react';

interface ROIInputs {
  projectType: string;
  teamSize: number;
  projectDuration: number;
  currentCostPerHour: number;
  expectedEfficiencyGain: number;
  industry: string;
}

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState<ROIInputs>({
    projectType: 'ai-integration',
    teamSize: 5,
    projectDuration: 6,
    currentCostPerHour: 150,
    expectedEfficiencyGain: 50,
    industry: 'technology',
  });

  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');

  const calculateROI = () => {
    // Current cost calculation
    const hoursPerMonth = 160; // Standard work month
    const totalHours = inputs.teamSize * hoursPerMonth * inputs.projectDuration;
    const currentTotalCost = totalHours * inputs.currentCostPerHour;

    // With PILON Qubit acceleration
    const accelerationFactor = inputs.expectedEfficiencyGain / 100;
    const reducedDuration = inputs.projectDuration * (1 - accelerationFactor);
    const reducedHours = inputs.teamSize * hoursPerMonth * reducedDuration;
    const reducedCost = reducedHours * inputs.currentCostPerHour;

    // PILON Qubit consulting cost (industry standard: 15-25% of project cost)
    const consultingRate = 0.20; // 20% of original project cost
    const consultingCost = currentTotalCost * consultingRate;

    // Total cost with PILON Qubit
    const totalCostWithPQ = reducedCost + consultingCost;

    // Savings and ROI
    const totalSavings = currentTotalCost - totalCostWithPQ;
    const roi = (totalSavings / consultingCost) * 100;
    const paybackPeriod = consultingCost / (totalSavings / inputs.projectDuration);

    // Time to market improvement
    const timeToMarketImprovement = inputs.projectDuration - reducedDuration;

    return {
      currentTotalCost,
      reducedCost,
      consultingCost,
      totalCostWithPQ,
      totalSavings,
      roi,
      paybackPeriod,
      timeToMarketImprovement,
      reducedDuration,
    };
  };

  const results = calculateROI();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">AI ROI Calculator</h1>
          <p className="text-cyan-100/70 text-lg">
            Calculate the financial impact of accelerating your AI project with PILON Qubit. Get a CFO-ready business case in minutes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Project Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Project Type</label>
                <select
                  value={inputs.projectType}
                  onChange={(e) => setInputs({ ...inputs, projectType: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                >
                  <option value="ai-integration">LLM Integration</option>
                  <option value="ml-model">ML Model Development</option>
                  <option value="ai-agent">Agentic AI System</option>
                  <option value="data-pipeline">Data Pipeline & Infrastructure</option>
                  <option value="ai-product">Full AI Product Development</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Industry</label>
                <select
                  value={inputs.industry}
                  onChange={(e) => setInputs({ ...inputs, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                >
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Team Size: {inputs.teamSize} developers
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={inputs.teamSize}
                  onChange={(e) => setInputs({ ...inputs, teamSize: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-cyan-100/50 mt-1">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Project Duration: {inputs.projectDuration} months
                </label>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={inputs.projectDuration}
                  onChange={(e) => setInputs({ ...inputs, projectDuration: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-cyan-100/50 mt-1">
                  <span>1 mo</span>
                  <span>24 mo</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Average Cost per Hour: ${inputs.currentCostPerHour}
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={inputs.currentCostPerHour}
                  onChange={(e) => setInputs({ ...inputs, currentCostPerHour: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-cyan-100/50 mt-1">
                  <span>$50</span>
                  <span>$300</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Expected Efficiency Gain: {inputs.expectedEfficiencyGain}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={inputs.expectedEfficiencyGain}
                  onChange={(e) => setInputs({ ...inputs, expectedEfficiencyGain: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-cyan-100/50 mt-1">
                  <span>20%</span>
                  <span>80%</span>
                </div>
                <p className="text-xs text-cyan-100/50 mt-2">
                  PILON Qubit typically delivers 40-60% efficiency gains
                </p>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="h-5 w-5" />
                Calculate ROI
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* ROI Highlight */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400 rounded-xl p-8 text-center">
                  <div className="text-sm font-semibold text-cyan-400 mb-2">PROJECTED ROI</div>
                  <div className="text-6xl font-bold text-cyan-400 mb-2">
                    {results.roi > 0 ? '+' : ''}{Math.round(results.roi)}%
                  </div>
                  <div className="text-cyan-100/70">Return on Investment</div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <div className="text-sm text-cyan-100/70">Total Savings</div>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(results.totalSavings)}
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-400" />
                      <div className="text-sm text-cyan-100/70">Time Saved</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      {results.timeToMarketImprovement.toFixed(1)} months
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-cyan-400" />
                      <div className="text-sm text-cyan-100/70">Payback Period</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {results.paybackPeriod.toFixed(1)} months
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      <div className="text-sm text-cyan-100/70">Cost Reduction</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-400">
                      {inputs.expectedEfficiencyGain}%
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Cost Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-100/70">Current Project Cost</span>
                      <span className="font-semibold">{formatCurrency(results.currentTotalCost)}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-400">
                      <span>With PILON Qubit Acceleration</span>
                      <span className="font-semibold">{formatCurrency(results.reducedCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-100/70">Consulting Investment</span>
                      <span className="font-semibold">{formatCurrency(results.consultingCost)}</span>
                    </div>
                    <div className="border-t border-cyan-500/30 pt-3 flex justify-between items-center font-bold text-lg">
                      <span>Total Cost with PQ</span>
                      <span className="text-cyan-400">{formatCurrency(results.totalCostWithPQ)}</span>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-green-400 font-semibold">Net Savings</span>
                      <span className="text-green-400 font-bold text-xl">{formatCurrency(results.totalSavings)}</span>
                    </div>
                  </div>
                </div>

                {/* Download Business Case */}
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Get Your CFO-Ready Business Case</h3>
                  <p className="text-cyan-100/70 mb-4">
                    Download a comprehensive PDF report with detailed ROI analysis, sensitivity scenarios, and implementation roadmap.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => alert(`Business case PDF generation coming soon! We'll email you at: ${email}`)}
                      disabled={!email || !companyName}
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Download className="h-5 w-5" />
                      Download Business Case
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <p className="text-cyan-100/70 mb-4">Ready to realize these savings?</p>
                  <Link
                    href="/#contact"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all"
                  >
                    Schedule a Consultation
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-8 h-full flex items-center justify-center">
                <div className="text-center text-cyan-100/50">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Enter your project details and click &ldquo;Calculate ROI&rdquo; to see your potential savings</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Industry Benchmarks */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Industry Benchmarks</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">10x</div>
              <div className="text-sm text-cyan-100/70">Faster Development</div>
              <p className="text-xs text-cyan-100/50 mt-2">Average acceleration for AI projects with PILON Qubit</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">50%</div>
              <div className="text-sm text-cyan-100/70">Cost Reduction</div>
              <p className="text-xs text-cyan-100/50 mt-2">Typical savings on development costs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">3-6</div>
              <div className="text-sm text-cyan-100/70">Month Payback</div>
              <p className="text-xs text-cyan-100/50 mt-2">Average time to recover consulting investment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
