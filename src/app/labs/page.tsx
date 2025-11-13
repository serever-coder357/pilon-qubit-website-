'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, MessageSquare, FileText, Image as ImageIcon, BarChart, Code, Play, Loader2 } from 'lucide-react';

type DemoType = 'chat' | 'text-analysis' | 'image-analysis' | 'data-insights' | 'code-generation';

interface Demo {
  id: DemoType;
  title: string;
  description: string;
  icon: any;
  placeholder: string;
  examplePrompts: string[];
}

const demos: Demo[] = [
  {
    id: 'chat',
    title: 'Conversational AI',
    description: 'Experience GPT-4 powered conversations with context awareness and multi-turn dialogue.',
    icon: MessageSquare,
    placeholder: 'Ask me anything about AI implementation...',
    examplePrompts: [
      'What are the key considerations for implementing LLMs in production?',
      'How do I reduce AI API costs while maintaining quality?',
      'Explain the difference between RAG and fine-tuning',
    ]
  },
  {
    id: 'text-analysis',
    title: 'Text Analysis & Summarization',
    description: 'Analyze documents, extract insights, and generate summaries using advanced NLP.',
    icon: FileText,
    placeholder: 'Paste your text here for analysis...',
    examplePrompts: [
      'Summarize this technical document in 3 bullet points',
      'Extract key action items from this meeting transcript',
      'Identify the main themes and sentiment in this customer feedback',
    ]
  },
  {
    id: 'image-analysis',
    title: 'Image Understanding',
    description: 'Analyze images with computer vision models for object detection, OCR, and scene understanding.',
    icon: ImageIcon,
    placeholder: 'Upload an image or provide a URL...',
    examplePrompts: [
      'Describe what you see in this image',
      'Extract all text from this screenshot',
      'Identify objects and their locations in this photo',
    ]
  },
  {
    id: 'data-insights',
    title: 'Data Analysis',
    description: 'Upload CSV data and get instant insights, visualizations, and statistical analysis.',
    icon: BarChart,
    placeholder: 'Paste CSV data or describe your dataset...',
    examplePrompts: [
      'Analyze sales trends and predict next quarter',
      'Find correlations in this customer data',
      'Generate a summary report with key metrics',
    ]
  },
  {
    id: 'code-generation',
    title: 'Code Generation',
    description: 'Generate production-ready code, debug issues, and get architecture recommendations.',
    icon: Code,
    placeholder: 'Describe what you want to build...',
    examplePrompts: [
      'Create a Python function to process CSV files with error handling',
      'Generate a React component for a data table with sorting',
      'Write SQL queries to analyze user behavior patterns',
    ]
  },
];

export default function AILabsPage() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('chat');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentDemo = demos.find(d => d.id === activeDemo)!;

  const handleRun = async () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setOutput('');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate demo responses based on type
    const responses: Record<DemoType, string> = {
      'chat': `Great question about ${input.slice(0, 50)}...\n\nHere's a comprehensive answer:\n\n1. **Architecture Considerations**: When implementing LLMs in production, you need to consider latency, cost, and reliability. A hybrid approach often works best - using cached responses for common queries and real-time generation for unique requests.\n\n2. **Cost Optimization**: Implement semantic caching, use smaller models for simple tasks, and reserve GPT-4 for complex reasoning. This can reduce costs by 60-80%.\n\n3. **Monitoring & Observability**: Track token usage, latency, error rates, and user satisfaction. Set up alerts for anomalies.\n\nWould you like me to dive deeper into any of these areas?`,
      
      'text-analysis': `**Text Analysis Results**\n\n**Summary**: ${input.slice(0, 100)}...\n\n**Key Insights**:\n- Main topic: Technical implementation and best practices\n- Sentiment: Neutral to positive\n- Complexity level: Advanced\n- Estimated reading time: 3-5 minutes\n\n**Extracted Entities**:\n- Technologies: AI, LLM, GPT-4, RAG\n- Concepts: Production deployment, cost optimization, monitoring\n\n**Action Items**:\n1. Review architecture patterns\n2. Implement caching strategy\n3. Set up monitoring dashboard`,
      
      'image-analysis': `**Image Analysis Complete**\n\n**Scene Description**: This appears to be a technical diagram or screenshot showing system architecture.\n\n**Detected Objects**:\n- Text blocks: 5\n- Diagrams/Charts: 2\n- Icons/Symbols: 8\n\n**Extracted Text** (OCR):\n"${input.slice(0, 200)}..."\n\n**Recommendations**:\n- High quality image suitable for documentation\n- Text is clearly readable\n- Consider adding more contrast for better accessibility`,
      
      'data-insights': `**Data Analysis Report**\n\n**Dataset Overview**:\n- Rows: 1,247\n- Columns: 8\n- Date Range: Jan 2024 - Nov 2024\n\n**Key Metrics**:\n- Average: $4,567\n- Median: $3,890\n- Growth Rate: +23% MoM\n\n**Trends Identified**:\n1. Strong upward trend in Q3 2024 (+45%)\n2. Seasonal pattern detected (peaks in March, September)\n3. Weekend performance 30% lower than weekdays\n\n**Predictions**:\n- Q4 2024 Forecast: $567K (±15%)\n- Confidence: 87%\n\n**Recommendations**:\n1. Increase marketing during peak seasons\n2. Optimize weekend campaigns\n3. Focus on high-performing segments`,
      
      'code-generation': `\`\`\`python\nimport pandas as pd\nimport logging\nfrom typing import Optional\n\nclass CSVProcessor:\n    """Production-ready CSV processor with error handling and logging."""\n    \n    def __init__(self, log_level=logging.INFO):\n        self.logger = logging.getLogger(__name__)\n        self.logger.setLevel(log_level)\n    \n    def process_file(self, filepath: str, encoding: str = 'utf-8') -> Optional[pd.DataFrame]:\n        """Process CSV file with comprehensive error handling.\n        \n        Args:\n            filepath: Path to CSV file\n            encoding: File encoding (default: utf-8)\n            \n        Returns:\n            DataFrame if successful, None if error\n        \"\"\"\n        try:\n            # Read CSV with error handling\n            df = pd.read_csv(\n                filepath,\n                encoding=encoding,\n                on_bad_lines='warn'\n            )\n            \n            # Validate data\n            if df.empty:\n                self.logger.warning(f"Empty file: {filepath}")\n                return None\n            \n            # Log success\n            self.logger.info(\n                f"Processed {filepath}: {len(df)} rows, {len(df.columns)} columns"\n            )\n            \n            return df\n            \n        except FileNotFoundError:\n            self.logger.error(f"File not found: {filepath}")\n        except pd.errors.EmptyDataError:\n            self.logger.error(f"Empty data: {filepath}")\n        except Exception as e:\n            self.logger.error(f"Unexpected error: {str(e)}")\n        \n        return None\n\n# Usage example\nprocessor = CSVProcessor()\ndf = processor.process_file('data.csv')\nif df is not None:\n    print(f"Successfully processed {len(df)} rows")\n\`\`\`\n\n**Code Features**:\n✓ Type hints for better IDE support\n✓ Comprehensive error handling\n✓ Logging for debugging\n✓ Docstrings for documentation\n✓ Production-ready patterns`
    };
    
    setOutput(responses[activeDemo]);
    setIsProcessing(false);
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl font-bold">AI Labs</h1>
          </div>
          <p className="text-xl text-cyan-100/70 max-w-3xl">
            Experiment with cutting-edge AI capabilities in our interactive sandbox. Try different models, test use cases, and see what&apos;s possible with PILON Qubit&apos;s technology stack.
          </p>
        </div>

        {/* Demo Selector */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <button
                key={demo.id}
                onClick={() => {
                  setActiveDemo(demo.id);
                  setInput('');
                  setOutput('');
                }}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  activeDemo === demo.id
                    ? 'border-cyan-400 bg-cyan-500/20'
                    : 'border-cyan-900/40 bg-white/5 hover:border-cyan-500/50'
                }`}
              >
                <Icon className={`h-6 w-6 mb-2 ${activeDemo === demo.id ? 'text-cyan-400' : 'text-cyan-100/50'}`} />
                <div className="text-sm font-semibold mb-1">{demo.title}</div>
                <div className="text-xs text-cyan-100/50 line-clamp-2">{demo.description}</div>
              </button>
            );
          })}
        </div>

        {/* Main Demo Area */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">{currentDemo.title}</h2>
              <p className="text-cyan-100/70 mb-6">{currentDemo.description}</p>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Input</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentDemo.placeholder}
                  className="w-full h-48 px-4 py-3 bg-white/10 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <button
                onClick={handleRun}
                disabled={!input.trim() || isProcessing}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Run Demo
                  </>
                )}
              </button>
            </div>

            {/* Example Prompts */}
            <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Example Prompts</h3>
              <div className="space-y-2">
                {currentDemo.examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left px-4 py-3 bg-white/5 border border-cyan-900/40 rounded-lg hover:border-cyan-500/50 hover:bg-white/10 transition-all text-sm"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Output</h3>
            {output ? (
              <div className="bg-black/30 border border-cyan-900/40 rounded-lg p-4 h-[calc(100%-3rem)] overflow-auto">
                <pre className="text-sm text-cyan-100/90 whitespace-pre-wrap font-mono">{output}</pre>
              </div>
            ) : (
              <div className="h-[calc(100%-3rem)] flex items-center justify-center text-cyan-100/30">
                <div className="text-center">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Run a demo to see AI-powered results</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-900/40 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Own AI Solution?</h2>
          <p className="text-xl text-cyan-100/70 mb-6 max-w-2xl mx-auto">
            These demos showcase just a fraction of what&apos;s possible. Let&apos;s discuss how we can build custom AI solutions tailored to your specific needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/#contact"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/case-studies"
              className="px-8 py-4 bg-white/10 border border-cyan-500 rounded-lg font-bold text-lg hover:bg-white/20 transition-all"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
