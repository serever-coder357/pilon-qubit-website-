'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Download, ArrowLeft, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  category: 'data' | 'infrastructure' | 'talent' | 'governance' | 'strategy';
  question: string;
  options: { value: number; label: string }[];
}

const questions: Question[] = [
  // Data Readiness (5 questions)
  { id: 1, category: 'data', question: 'How would you describe your organization\'s data quality and accessibility?', options: [
    { value: 1, label: 'Data is siloed, inconsistent, and difficult to access' },
    { value: 2, label: 'Some data is accessible but quality varies significantly' },
    { value: 3, label: 'Most data is accessible with acceptable quality' },
    { value: 4, label: 'High-quality, well-governed data readily available across the organization' }
  ]},
  { id: 2, category: 'data', question: 'What percentage of your data is labeled or structured for AI/ML use?', options: [
    { value: 1, label: 'Less than 10%' },
    { value: 2, label: '10-30%' },
    { value: 3, label: '30-60%' },
    { value: 4, label: 'More than 60%' }
  ]},
  { id: 3, category: 'data', question: 'How mature is your data pipeline and ETL infrastructure?', options: [
    { value: 1, label: 'Manual data extraction and processing' },
    { value: 2, label: 'Some automated pipelines but mostly manual' },
    { value: 3, label: 'Mostly automated with some manual intervention' },
    { value: 4, label: 'Fully automated, real-time data pipelines' }
  ]},
  { id: 4, category: 'data', question: 'Do you have a centralized data warehouse or data lake?', options: [
    { value: 1, label: 'No centralized data storage' },
    { value: 2, label: 'Planning or early implementation stage' },
    { value: 3, label: 'Implemented but not fully utilized' },
    { value: 4, label: 'Mature data warehouse/lake with wide adoption' }
  ]},
  { id: 5, category: 'data', question: 'How do you handle data privacy and security?', options: [
    { value: 1, label: 'Basic security measures, no formal privacy policies' },
    { value: 2, label: 'Some policies in place but inconsistently applied' },
    { value: 3, label: 'Comprehensive policies with regular audits' },
    { value: 4, label: 'Industry-leading privacy and security with certifications' }
  ]},

  // Infrastructure (5 questions)
  { id: 6, category: 'infrastructure', question: 'What is your current cloud infrastructure maturity?', options: [
    { value: 1, label: 'Primarily on-premise with no cloud strategy' },
    { value: 2, label: 'Some cloud adoption for specific use cases' },
    { value: 3, label: 'Hybrid cloud with growing adoption' },
    { value: 4, label: 'Cloud-first strategy with multi-cloud capabilities' }
  ]},
  { id: 7, category: 'infrastructure', question: 'Do you have GPU/TPU infrastructure for AI model training?', options: [
    { value: 1, label: 'No specialized AI hardware' },
    { value: 2, label: 'Planning to acquire or using cloud on-demand' },
    { value: 3, label: 'Some dedicated AI infrastructure available' },
    { value: 4, label: 'Extensive AI-optimized infrastructure with auto-scaling' }
  ]},
  { id: 8, category: 'infrastructure', question: 'How mature is your MLOps/DevOps practice?', options: [
    { value: 1, label: 'No formal MLOps practices' },
    { value: 2, label: 'Basic CI/CD but no ML-specific workflows' },
    { value: 3, label: 'Developing MLOps practices with some automation' },
    { value: 4, label: 'Mature MLOps with automated training, testing, and deployment' }
  ]},
  { id: 9, category: 'infrastructure', question: 'What is your model deployment and monitoring capability?', options: [
    { value: 1, label: 'Manual deployment with no monitoring' },
    { value: 2, label: 'Some automation but limited monitoring' },
    { value: 3, label: 'Automated deployment with basic monitoring' },
    { value: 4, label: 'Fully automated with comprehensive monitoring and alerting' }
  ]},
  { id: 10, category: 'infrastructure', question: 'How scalable is your current infrastructure for AI workloads?', options: [
    { value: 1, label: 'Cannot handle significant AI workloads' },
    { value: 2, label: 'Can handle small-scale experiments' },
    { value: 3, label: 'Can scale to moderate production workloads' },
    { value: 4, label: 'Highly scalable with auto-scaling and load balancing' }
  ]},

  // Talent & Skills (5 questions)
  { id: 11, category: 'talent', question: 'How many AI/ML specialists do you currently have?', options: [
    { value: 1, label: 'None or relying entirely on external resources' },
    { value: 2, label: '1-5 specialists' },
    { value: 3, label: '6-20 specialists' },
    { value: 4, label: 'More than 20 specialists or dedicated AI team' }
  ]},
  { id: 12, category: 'talent', question: 'What is the AI literacy level across your organization?', options: [
    { value: 1, label: 'Very low - most employees unfamiliar with AI' },
    { value: 2, label: 'Low - only technical teams understand AI' },
    { value: 3, label: 'Moderate - growing awareness and basic understanding' },
    { value: 4, label: 'High - widespread AI literacy and enthusiasm' }
  ]},
  { id: 13, category: 'talent', question: 'Do you have a formal AI training and upskilling program?', options: [
    { value: 1, label: 'No formal training program' },
    { value: 2, label: 'Ad-hoc training opportunities' },
    { value: 3, label: 'Structured program for technical teams' },
    { value: 4, label: 'Comprehensive organization-wide AI upskilling initiative' }
  ]},
  { id: 14, category: 'talent', question: 'How easy is it to recruit AI talent for your organization?', options: [
    { value: 1, label: 'Very difficult - no AI talent pipeline' },
    { value: 2, label: 'Challenging - limited success recruiting' },
    { value: 3, label: 'Moderate - can recruit with effort' },
    { value: 4, label: 'Easy - strong employer brand for AI talent' }
  ]},
  { id: 15, category: 'talent', question: 'Do you have cross-functional AI teams (business + technical)?', options: [
    { value: 1, label: 'No cross-functional collaboration' },
    { value: 2, label: 'Occasional collaboration on specific projects' },
    { value: 3, label: 'Regular cross-functional project teams' },
    { value: 4, label: 'Embedded cross-functional AI teams across the organization' }
  ]},

  // Governance & Ethics (5 questions)
  { id: 16, category: 'governance', question: 'Do you have formal AI governance policies?', options: [
    { value: 1, label: 'No formal policies' },
    { value: 2, label: 'Policies in development' },
    { value: 3, label: 'Policies established but not fully enforced' },
    { value: 4, label: 'Comprehensive policies with active enforcement' }
  ]},
  { id: 17, category: 'governance', question: 'How do you address AI ethics and bias?', options: [
    { value: 1, label: 'Not systematically addressed' },
    { value: 2, label: 'Awareness but no formal processes' },
    { value: 3, label: 'Regular bias testing and mitigation' },
    { value: 4, label: 'Comprehensive ethics framework with third-party audits' }
  ]},
  { id: 18, category: 'governance', question: 'What is your AI model explainability and transparency level?', options: [
    { value: 1, label: 'Black-box models with no explainability' },
    { value: 2, label: 'Some documentation but limited transparency' },
    { value: 3, label: 'Explainability for critical models' },
    { value: 4, label: 'Full transparency and explainability across all models' }
  ]},
  { id: 19, category: 'governance', question: 'How do you manage AI-related regulatory compliance?', options: [
    { value: 1, label: 'No formal compliance processes' },
    { value: 2, label: 'Reactive compliance as issues arise' },
    { value: 3, label: 'Proactive compliance monitoring' },
    { value: 4, label: 'Leading compliance practices with regular audits' }
  ]},
  { id: 20, category: 'governance', question: 'Do you have an AI risk management framework?', options: [
    { value: 1, label: 'No risk management for AI' },
    { value: 2, label: 'Basic risk identification' },
    { value: 3, label: 'Structured risk assessment and mitigation' },
    { value: 4, label: 'Comprehensive risk management with continuous monitoring' }
  ]},

  // Strategy & Execution (5 questions)
  { id: 21, category: 'strategy', question: 'Does your organization have a clear AI strategy?', options: [
    { value: 1, label: 'No defined AI strategy' },
    { value: 2, label: 'High-level vision but no detailed roadmap' },
    { value: 3, label: 'Documented strategy with implementation roadmap' },
    { value: 4, label: 'Comprehensive strategy with executive buy-in and resources' }
  ]},
  { id: 22, category: 'strategy', question: 'How aligned is AI with your business objectives?', options: [
    { value: 1, label: 'AI initiatives disconnected from business goals' },
    { value: 2, label: 'Some alignment but mostly experimental' },
    { value: 3, label: 'AI initiatives tied to specific business outcomes' },
    { value: 4, label: 'AI fully integrated into core business strategy' }
  ]},
  { id: 23, category: 'strategy', question: 'What is the maturity of your AI use cases?', options: [
    { value: 1, label: 'No AI use cases in production' },
    { value: 2, label: '1-2 pilot projects' },
    { value: 3, label: 'Multiple use cases with some in production' },
    { value: 4, label: 'Extensive portfolio of production AI applications' }
  ]},
  { id: 24, category: 'strategy', question: 'How do you measure AI ROI and business impact?', options: [
    { value: 1, label: 'No formal measurement' },
    { value: 2, label: 'Tracking technical metrics only' },
    { value: 3, label: 'Measuring business metrics for key initiatives' },
    { value: 4, label: 'Comprehensive ROI tracking across all AI investments' }
  ]},
  { id: 25, category: 'strategy', question: 'What is your AI innovation and experimentation culture?', options: [
    { value: 1, label: 'Risk-averse with little experimentation' },
    { value: 2, label: 'Some experimentation in isolated teams' },
    { value: 3, label: 'Encouraged experimentation with dedicated resources' },
    { value: 4, label: 'Strong innovation culture with fail-fast mentality' }
  ]},
];

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = questions.length * 4;
    return Math.round((totalScore / maxScore) * 100);
  };

  const getCategoryScore = (category: string) => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const categoryAnswers = categoryQuestions.map(q => answers[q.id] || 0);
    const totalScore = categoryAnswers.reduce((sum, val) => sum + val, 0);
    const maxScore = categoryQuestions.length * 4;
    return Math.round((totalScore / maxScore) * 100);
  };

  const getMaturityLevel = (score: number) => {
    if (score < 25) return { level: 'Beginner', color: 'text-red-400', description: 'Your organization is in the early stages of AI adoption. Focus on building foundational capabilities.' };
    if (score < 50) return { level: 'Developing', color: 'text-orange-400', description: 'You have some AI capabilities but significant gaps remain. Prioritize infrastructure and talent development.' };
    if (score < 75) return { level: 'Intermediate', color: 'text-yellow-400', description: 'Your organization has solid AI foundations. Focus on scaling and governance to reach the next level.' };
    return { level: 'Advanced', color: 'text-green-400', description: 'Your organization demonstrates AI maturity. Continue innovating and optimizing for competitive advantage.' };
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[currentQ.id] !== undefined;

  if (showResults) {
    const overallScore = calculateScore();
    const maturity = getMaturityLevel(overallScore);
    const categoryScores = {
      data: getCategoryScore('data'),
      infrastructure: getCategoryScore('infrastructure'),
      talent: getCategoryScore('talent'),
      governance: getCategoryScore('governance'),
      strategy: getCategoryScore('strategy'),
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Your AI Readiness Score</h1>
              <div className={`text-7xl font-bold ${maturity.color} mb-2`}>{overallScore}%</div>
              <div className="text-2xl font-semibold mb-2">{maturity.level}</div>
              <p className="text-cyan-100/70">{maturity.description}</p>
            </div>

            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold">Category Breakdown</h2>
              
              {[
                { key: 'data', label: 'Data Readiness', icon: '📊' },
                { key: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
                { key: 'talent', label: 'Talent & Skills', icon: '👥' },
                { key: 'governance', label: 'Governance & Ethics', icon: '⚖️' },
                { key: 'strategy', label: 'Strategy & Execution', icon: '🎯' },
              ].map(({ key, label, icon }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{icon}</span>
                      <span className="font-semibold">{label}</span>
                    </span>
                    <span className="text-cyan-400 font-bold">{categoryScores[key as keyof typeof categoryScores]}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${categoryScores[key as keyof typeof categoryScores]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Get Your Detailed PDF Report</h3>
              <p className="text-cyan-100/70 mb-4">
                Receive a comprehensive analysis with personalized recommendations, benchmarks, and a roadmap for AI implementation.
              </p>
              <div className="space-y-4">
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
                      onClick={() => alert(`PDF report generation coming soon! We'll email you at: ${email}`)}
                  disabled={!email || !companyName}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download PDF Report
                </button>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-cyan-100/70">Ready to accelerate your AI journey?</p>
              <Link
                href="/#contact"
                className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                Schedule a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Readiness Assessment</h1>
          <p className="text-cyan-100/70 text-lg">
            Answer 25 questions to evaluate your organization&apos;s AI maturity across data, infrastructure, talent, governance, and strategy.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-cyan-100/70">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-cyan-400 font-semibold">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-8 mb-8"
        >
          <div className="mb-2 text-sm text-cyan-400 font-semibold uppercase">
            {currentQ.category.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <h2 className="text-2xl font-bold mb-6">{currentQ.question}</h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQ.id, option.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[currentQ.id] === option.value
                    ? 'border-cyan-400 bg-cyan-500/20'
                    : 'border-cyan-900/40 bg-white/5 hover:border-cyan-500/50 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {answers[currentQ.id] === option.value ? (
                    <CheckCircle className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-6 w-6 text-cyan-100/30 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="flex-1">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-white/10 border border-cyan-500/30 rounded-lg font-semibold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? 'View Results' : 'Next'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
