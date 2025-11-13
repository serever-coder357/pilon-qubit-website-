export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  tags: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'fintech-llm-integration',
    title: 'Enterprise LLM Integration for Financial Services',
    client: 'Leading Fintech Platform',
    industry: 'Financial Services',
    challenge: 'A major fintech company needed to integrate LLM capabilities into their customer service platform to handle 100K+ daily inquiries, but faced challenges with latency, cost, and compliance requirements.',
    solution: 'PILON Qubit designed and implemented a hybrid LLM architecture combining fine-tuned models for common queries with GPT-4 for complex cases. We built a custom caching layer, implemented semantic routing, and ensured SOC 2 compliance throughout.',
    results: [
      {
        metric: '10x Faster',
        value: '10x',
        description: 'Development completed in 6 weeks vs. 6 months estimated internally'
      },
      {
        metric: '60% Cost Reduction',
        value: '60%',
        description: 'Reduced LLM API costs through intelligent caching and routing'
      },
      {
        metric: '99.9% Uptime',
        value: '99.9%',
        description: 'Production uptime with automated failover and monitoring'
      },
      {
        metric: '85% Automation',
        value: '85%',
        description: 'Customer inquiries now handled without human intervention'
      }
    ],
    testimonial: {
      quote: 'PILON Qubit delivered in 6 weeks what our internal team estimated would take 6 months. Their expertise in LLM optimization saved us hundreds of thousands in API costs.',
      author: 'Sarah Chen',
      role: 'VP of Engineering'
    },
    tags: ['LLM Integration', 'Cost Optimization', 'Financial Services', 'Compliance']
  },
  {
    id: 'healthcare-ai-agents',
    title: 'Multi-Agent System for Healthcare Diagnostics',
    client: 'Healthcare AI Startup',
    industry: 'Healthcare',
    challenge: 'A healthcare startup needed to build an AI-powered diagnostic assistant that could analyze patient data, medical images, and research papers to provide evidence-based recommendations while maintaining HIPAA compliance.',
    solution: 'We architected a multi-agent system with specialized agents for image analysis, literature review, and clinical reasoning. Implemented secure data pipelines, built custom evaluation frameworks, and achieved HIPAA compliance with end-to-end encryption.',
    results: [
      {
        metric: '8x Faster',
        value: '8x',
        description: 'Time to market vs. traditional development approach'
      },
      {
        metric: '92% Accuracy',
        value: '92%',
        description: 'Diagnostic accuracy validated against board-certified physicians'
      },
      {
        metric: '50% Cost Savings',
        value: '50%',
        description: 'Development cost reduction through reusable agent frameworks'
      },
      {
        metric: '100% Compliant',
        value: '100%',
        description: 'HIPAA compliance achieved with zero violations'
      }
    ],
    testimonial: {
      quote: 'The multi-agent architecture PILON Qubit built is now the foundation of our product. Their deep understanding of both AI and healthcare compliance was invaluable.',
      author: 'Dr. Michael Rodriguez',
      role: 'CEO & Co-founder'
    },
    tags: ['Agentic AI', 'Healthcare', 'HIPAA Compliance', 'Multi-Agent Systems']
  },
  {
    id: 'ecommerce-personalization',
    title: 'AI-Powered Personalization Engine',
    client: 'E-commerce Platform',
    industry: 'Retail',
    challenge: 'An e-commerce platform with 2M+ monthly users needed to implement personalized product recommendations and dynamic pricing to compete with larger competitors, but lacked the AI expertise and infrastructure.',
    solution: 'PILON Qubit built a real-time personalization engine using collaborative filtering, deep learning embeddings, and reinforcement learning for dynamic pricing. Implemented A/B testing framework and analytics dashboard for continuous optimization.',
    results: [
      {
        metric: '40% More Users',
        value: '40%',
        description: 'Increase in monthly active users after personalization launch'
      },
      {
        metric: '35% Better Retention',
        value: '35%',
        description: 'Improvement in 30-day user retention rate'
      },
      {
        metric: '28% Revenue Lift',
        value: '28%',
        description: 'Increase in revenue per user from personalized recommendations'
      },
      {
        metric: '12 Weeks',
        value: '12 weeks',
        description: 'From concept to production deployment'
      }
    ],
    testimonial: {
      quote: 'PILON Qubit\'s personalization engine transformed our business. We saw immediate impact on user engagement and revenue, and the A/B testing framework lets us continuously improve.',
      author: 'Jennifer Park',
      role: 'Chief Product Officer'
    },
    tags: ['Personalization', 'E-commerce', 'Recommendation Systems', 'Growth']
  },
  {
    id: 'manufacturing-predictive-maintenance',
    title: 'Predictive Maintenance with Computer Vision',
    client: 'Manufacturing Corporation',
    industry: 'Manufacturing',
    challenge: 'A large manufacturer faced frequent equipment failures causing costly downtime. They needed an AI system to predict failures before they occurred, but had limited ML expertise and legacy infrastructure.',
    solution: 'We deployed computer vision models to analyze equipment sensor data and visual inspections in real-time. Built edge computing infrastructure for low-latency predictions and integrated with existing SCADA systems. Implemented MLOps pipeline for continuous model improvement.',
    results: [
      {
        metric: '70% Reduction',
        value: '70%',
        description: 'Decrease in unplanned downtime through predictive maintenance'
      },
      {
        metric: '$2.5M Savings',
        value: '$2.5M',
        description: 'Annual cost savings from prevented failures and optimized maintenance'
      },
      {
        metric: '95% Accuracy',
        value: '95%',
        description: 'Failure prediction accuracy with 48-hour advance warning'
      },
      {
        metric: '3 Month ROI',
        value: '3 months',
        description: 'Payback period for AI implementation investment'
      }
    ],
    testimonial: {
      quote: 'The ROI was immediate and dramatic. PILON Qubit\'s solution paid for itself in 3 months and continues to save us millions annually in prevented downtime.',
      author: 'Robert Thompson',
      role: 'VP of Operations'
    },
    tags: ['Computer Vision', 'Predictive Maintenance', 'Manufacturing', 'Edge AI']
  },
  {
    id: 'saas-growth-analytics',
    title: 'Growth Analytics & Conversion Optimization',
    client: 'B2B SaaS Startup',
    industry: 'Technology',
    challenge: 'A B2B SaaS startup was struggling with low conversion rates and poor user retention. They had basic analytics but lacked the expertise to identify bottlenecks and optimize their funnel.',
    solution: 'PILON Qubit implemented comprehensive analytics instrumentation, built custom attribution models, and created an experimentation framework for A/B testing. Developed ML models to predict churn and identify high-value user segments.',
    results: [
      {
        metric: '45% More Signups',
        value: '45%',
        description: 'Increase in trial signups through funnel optimization'
      },
      {
        metric: '30% Better Retention',
        value: '30%',
        description: 'Improvement in 90-day retention through predictive interventions'
      },
      {
        metric: '3.2x ROI',
        value: '3.2x',
        description: 'Return on analytics investment in first 6 months'
      },
      {
        metric: '50+ Experiments',
        value: '50+',
        description: 'A/B tests run in first quarter with experimentation framework'
      }
    ],
    testimonial: {
      quote: 'PILON Qubit didn\'t just build analytics—they taught us how to be data-driven. The experimentation culture they instilled has become our competitive advantage.',
      author: 'Alex Kumar',
      role: 'Head of Growth'
    },
    tags: ['Growth Analytics', 'SaaS', 'Conversion Optimization', 'A/B Testing']
  }
];
