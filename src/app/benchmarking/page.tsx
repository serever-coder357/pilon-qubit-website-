'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Award, AlertCircle, CheckCircle2, Download } from 'lucide-react';

interface BenchmarkData {
  category: string;
  yourScore: number;
  industryAverage: number;
  topPerformers: number;
  insights: string[];
}

export default function BenchmarkingPage() {
  const [industry, setIndustry] = useState('technology');
  const [companySize, setCompanySize] = useState('50-200');
  const [aiMaturity, setAiMaturity] = useState('exploring');
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');

  const generateBenchmarks = (): BenchmarkData[] => {
    // Simulate industry benchmarks based on inputs
    const maturityScores = {
      'exploring': { base: 25, variance: 10 },
      'implementing': { base: 50, variance: 15 },
      'scaling': { base: 75, variance: 10 },
    };

    const score = maturityScores[aiMaturity as keyof typeof maturityScores];
    
    return [
      {
        category: 'Data Infrastructure',
        yourScore: score.base + Math.random() * score.variance,
        industryAverage: 58,
        topPerformers: 85,
        insights: [
          'Your data infrastructure is below industry average',
          'Consider implementing a data lakehouse architecture',
          'Top performers use automated data quality monitoring',
        ]
      },
      {
        category: 'AI/ML Capabilities',
        yourScore: score.base + Math.random() * score.variance - 5,
        industryAverage: 52,
        topPerformers: 88,
        insights: [
          'Strong foundation but room for improvement',
          'Invest in MLOps and model monitoring',
          'Consider building internal AI platforms',
        ]
      },
      {
        category: 'Talent & Skills',
        yourScore: score.base + Math.random() * score.variance + 5,
        industryAverage: 48,
        topPerformers: 82,
        insights: [
          'Above average talent acquisition',
          'Focus on upskilling existing teams',
          'Build AI centers of excellence',
        ]
      },
      {
        category: 'Governance & Ethics',
        yourScore: score.base + Math.random() * score.variance - 10,
        industryAverage: 45,
        topPerformers: 79,
        insights: [
          'Governance frameworks need strengthening',
          'Implement AI ethics review boards',
          'Document bias detection processes',
        ]
      },
      {
        category: 'Business Impact',
        yourScore: score.base + Math.random() * score.variance,
        industryAverage: 55,
        topPerformers: 90,
        insights: [
          'Moderate business value realization',
          'Improve ROI tracking and attribution',
          'Scale successful pilots faster',
        ]
      },
    ];
  };

  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);

  const handleGenerate = () => {
    const results = generateBenchmarks();
    setBenchmarks(results);
    setShowResults(true);
  };

  const overallScore = benchmarks.length > 0 
    ? Math.round(benchmarks.reduce((sum, b) => sum + b.yourScore, 0) / benchmarks.length)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 75) return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    if (score >= 50) return <AlertCircle className="h-5 w-5 text-yellow-400" />;
    return <AlertCircle className="h-5 w-5 text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl font-bold">AI Benchmarking</h1>
          </div>
          <p className="text-xl text-cyan-100/70 max-w-3xl">
            Compare your AI maturity against industry peers. Get actionable insights on where you stand and how to improve.
          </p>
        </div>

        {!showResults ? (
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Tell Us About Your Organization</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                >
                  <option value="technology">Technology</option>
                  <option value="finance">Financial Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Company Size</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                >
                  <option value="1-50">1-50 employees</option>
                  <option value="50-200">50-200 employees</option>
                  <option value="200-1000">200-1,000 employees</option>
                  <option value="1000-5000">1,000-5,000 employees</option>
                  <option value="5000+">5,000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">AI Maturity Stage</label>
                <select
                  value={aiMaturity}
                  onChange={(e) => setAiMaturity(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                >
                  <option value="exploring">Exploring (Research & Planning)</option>
                  <option value="implementing">Implementing (Pilots & POCs)</option>
                  <option value="scaling">Scaling (Production Deployments)</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="h-5 w-5" />
                Generate Benchmark Report
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400 rounded-xl p-8 text-center">
              <div className="text-sm font-semibold text-cyan-400 mb-2">OVERALL AI MATURITY SCORE</div>
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
                {overallScore}/100
              </div>
              <div className="text-cyan-100/70">
                {overallScore >= 75 ? 'Leader' : overallScore >= 50 ? 'Challenger' : 'Emerging'}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Category Breakdown</h2>
              {benchmarks.map((benchmark, index) => (
                <motion.div
                  key={benchmark.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getScoreIcon(benchmark.yourScore)}
                      <h3 className="text-xl font-bold">{benchmark.category}</h3>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(benchmark.yourScore)}`}>
                      {Math.round(benchmark.yourScore)}/100
                    </div>
                  </div>

                  {/* Comparison Bars */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-cyan-100/70">Your Score</span>
                        <span className="font-semibold">{Math.round(benchmark.yourScore)}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                          style={{ width: `${benchmark.yourScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-cyan-100/70">Industry Average</span>
                        <span className="font-semibold">{benchmark.industryAverage}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500/50"
                          style={{ width: `${benchmark.industryAverage}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-cyan-100/70">Top Performers</span>
                        <span className="font-semibold">{benchmark.topPerformers}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500/50"
                          style={{ width: `${benchmark.topPerformers}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">Key Insights</div>
                    <ul className="space-y-1">
                      {benchmark.insights.map((insight, i) => (
                        <li key={i} className="text-sm text-cyan-100/70 flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download Report */}
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Get Your Full Benchmark Report</h3>
              <p className="text-cyan-100/70 mb-4">
                Download a comprehensive PDF report with detailed recommendations, implementation roadmap, and peer comparisons.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => alert(`Benchmark report will be sent to: ${email}`)}
                  disabled={!email}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Report
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-900/40 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-4">Want to Improve Your Scores?</h2>
              <p className="text-xl text-cyan-100/70 mb-6 max-w-2xl mx-auto">
                PILON Qubit helps organizations accelerate their AI maturity. Let&apos;s discuss a customized roadmap to reach top performer status.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/#contact"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  Schedule Consultation
                </Link>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setEmail('');
                  }}
                  className="px-8 py-4 bg-white/10 border border-cyan-500 rounded-lg font-bold text-lg hover:bg-white/20 transition-all"
                >
                  Run Another Benchmark
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
