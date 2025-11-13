'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Download, FileText, CheckCircle2 } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  pages: number;
  downloadUrl: string;
  preview: string[];
}

const templates: Template[] = [
  {
    id: 'ai-ethics-policy',
    title: 'AI Ethics & Responsible AI Policy',
    description: 'Comprehensive framework for ethical AI development including fairness, transparency, accountability, and bias mitigation guidelines.',
    category: 'Ethics & Compliance',
    pages: 12,
    downloadUrl: '/templates/ai-ethics-policy.pdf',
    preview: [
      'Ethical principles and values',
      'Bias detection and mitigation procedures',
      'Transparency and explainability requirements',
      'Accountability framework',
      'Human oversight protocols',
      'Privacy and data protection guidelines',
    ]
  },
  {
    id: 'model-governance',
    title: 'ML Model Governance Framework',
    description: 'End-to-end governance for ML models from development through deployment, monitoring, and retirement.',
    category: 'Model Management',
    pages: 18,
    downloadUrl: '/templates/model-governance.pdf',
    preview: [
      'Model development lifecycle',
      'Version control and documentation standards',
      'Testing and validation requirements',
      'Deployment approval process',
      'Performance monitoring and alerting',
      'Model retirement procedures',
    ]
  },
  {
    id: 'data-governance',
    title: 'AI Data Governance Policy',
    description: 'Framework for managing data quality, lineage, access control, and compliance for AI/ML systems.',
    category: 'Data Management',
    pages: 15,
    downloadUrl: '/templates/data-governance.pdf',
    preview: [
      'Data quality standards',
      'Data lineage tracking',
      'Access control and permissions',
      'Data retention and deletion policies',
      'Compliance requirements (GDPR, CCPA)',
      'Data catalog and metadata management',
    ]
  },
  {
    id: 'risk-assessment',
    title: 'AI Risk Assessment Template',
    description: 'Structured approach to identifying, evaluating, and mitigating risks in AI systems.',
    category: 'Risk Management',
    pages: 10,
    downloadUrl: '/templates/risk-assessment.pdf',
    preview: [
      'Risk identification checklist',
      'Impact and likelihood assessment',
      'Mitigation strategies',
      'Monitoring and review procedures',
      'Incident response plan',
      'Stakeholder communication protocols',
    ]
  },
  {
    id: 'vendor-assessment',
    title: 'AI Vendor Assessment Checklist',
    description: 'Comprehensive evaluation framework for selecting and monitoring AI/ML vendors and tools.',
    category: 'Vendor Management',
    pages: 8,
    downloadUrl: '/templates/vendor-assessment.pdf',
    preview: [
      'Technical capabilities evaluation',
      'Security and compliance review',
      'Data handling practices',
      'SLA and performance metrics',
      'Cost and pricing analysis',
      'Exit strategy and data portability',
    ]
  },
  {
    id: 'incident-response',
    title: 'AI Incident Response Playbook',
    description: 'Step-by-step procedures for responding to AI system failures, bias incidents, and security breaches.',
    category: 'Operations',
    pages: 14,
    downloadUrl: '/templates/incident-response.pdf',
    preview: [
      'Incident classification and severity levels',
      'Response team roles and responsibilities',
      'Communication protocols',
      'Investigation procedures',
      'Remediation and recovery steps',
      'Post-incident review and documentation',
    ]
  },
];

const categories = Array.from(new Set(templates.map(t => t.category)));

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl font-bold">AI Governance Templates</h1>
          </div>
          <p className="text-xl text-cyan-100/70 max-w-3xl">
            Production-ready governance frameworks, policies, and templates to ensure responsible, compliant, and effective AI deployment. Download and customize for your organization.
          </p>
        </div>

        {/* Template Categories */}
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{category}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {templates.filter(t => t.category === category).map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-cyan-400" />
                        <h3 className="text-xl font-bold">{template.title}</h3>
                      </div>
                      <p className="text-cyan-100/70 text-sm mb-4">{template.description}</p>
                      <div className="text-xs text-cyan-100/50">
                        {template.pages} pages • PDF format
                      </div>
                    </div>
                  </div>

                  {/* Preview Items */}
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 mb-4">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">Includes:</div>
                    <ul className="space-y-1">
                      {template.preview.map((item, i) => (
                        <li key={i} className="text-sm text-cyan-100/70 flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => alert(`Template "${template.title}" download coming soon! This will be a production-ready PDF template.`)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Template
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Governance Services */}
        <div className="mt-16 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-900/40 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Need Custom Governance Frameworks?</h2>
          <p className="text-xl text-cyan-100/70 mb-6 max-w-3xl">
            While our templates provide a solid foundation, every organization has unique requirements. PILON Qubit offers custom governance framework development tailored to your industry, regulatory environment, and risk profile.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 border border-cyan-900/40 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Industry-Specific</h3>
              <p className="text-sm text-cyan-100/70">
                Frameworks customized for healthcare, finance, government, and other regulated industries with specific compliance requirements.
              </p>
            </div>
            <div className="bg-white/5 border border-cyan-900/40 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Implementation Support</h3>
              <p className="text-sm text-cyan-100/70">
                We don&apos;t just hand you documents - we help you implement governance processes and train your teams.
              </p>
            </div>
            <div className="bg-white/5 border border-cyan-900/40 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Ongoing Updates</h3>
              <p className="text-sm text-cyan-100/70">
                Governance frameworks evolve with regulations and best practices. We provide continuous updates and improvements.
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/#contact"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Discuss Custom Governance
            </Link>
            <Link
              href="/case-studies"
              className="px-8 py-4 bg-white/10 border border-cyan-500 rounded-lg font-bold text-lg hover:bg-white/20 transition-all"
            >
              View Case Studies
            </Link>
          </div>
        </div>

        {/* Why Governance Matters */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Why AI Governance Matters</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Risk Mitigation</h3>
              <p className="text-cyan-100/70">
                Proper governance reduces the risk of bias, discrimination, privacy violations, and regulatory non-compliance that can result in legal liability and reputational damage.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Trust & Transparency</h3>
              <p className="text-cyan-100/70">
                Clear governance frameworks build trust with customers, regulators, and stakeholders by demonstrating responsible AI practices and accountability.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Operational Efficiency</h3>
              <p className="text-cyan-100/70">
                Standardized processes and documentation streamline AI development, reduce rework, and enable faster, more confident deployment decisions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Competitive Advantage</h3>
              <p className="text-cyan-100/70">
                Organizations with mature governance can move faster, enter regulated markets, and win enterprise customers who require demonstrated compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
