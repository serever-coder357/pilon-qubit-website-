'use client';

import { useState } from 'react';

type Complexity = 'simple' | 'standard' | 'advanced';

export default function ProjectScopeGenerator() {
  const [projectType, setProjectType] = useState('AI marketing automation');
  const [industry, setIndustry] = useState('');
  const [goals, setGoals] = useState('');
  const [timeline, setTimeline] = useState('6–8 weeks');
  const [budget, setBudget] = useState('');
  const [integrations, setIntegrations] = useState('');
  const [complexity, setComplexity] = useState<Complexity>('standard');

  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState<string | null>(null);

  function generateScope() {
    setLoading(true);

    // Very small timeout to show "thinking" but never fail
    setTimeout(() => {
      const lines: string[] = [];

      lines.push(`# Project Scope – ${projectType}`);
      if (industry.trim()) {
        lines.push(`**Industry / Context:** ${industry.trim()}`);
      }
      if (goals.trim()) {
        lines.push(`**Primary Goals:** ${goals.trim()}`);
      }

      lines.push('');
      lines.push('## 1. Overview');
      lines.push(
        `We will design, build, and launch a ${projectType.toLowerCase()} solution tailored to your business. The focus is on delivering measurable outcomes (revenue, efficiency, or customer experience) rather than just deploying technology.`,
      );

      lines.push('');
      lines.push('## 2. Core Features');
      const featureBullets: string[] = [];

      if (projectType.toLowerCase().includes('marketing')) {
        featureBullets.push('AI-powered assistant for leads (chat and/or SMS).');
        featureBullets.push('Automated follow-up sequences and campaigns.');
        featureBullets.push('Dashboards for pipeline, conversion and ROI.');
      } else if (projectType.toLowerCase().includes('web')) {
        featureBullets.push('Modern, responsive UI built with React / Next.js.');
        featureBullets.push('SEO-ready structure and fast page loads.');
        featureBullets.push('Analytics and event tracking integrated from day one.');
      } else {
        featureBullets.push('LLM-backed workflows to automate key processes.');
        featureBullets.push('APIs and connectors for your internal systems.');
        featureBullets.push('Basic monitoring and logging for reliability.');
      }

      if (integrations.trim()) {
        featureBullets.push(`Integrations with: ${integrations.trim()}.`);
      }

      lines.push(
        featureBullets.map((f) => `- ${f}`).join('\n'),
      );

      lines.push('');
      lines.push('## 3. Phases & Timeline');

      if (complexity === 'simple') {
        lines.push(
          `**Phase 1 – Discovery & Setup (1–2 weeks):** Confirm requirements, define success metrics, finalize scope, and configure core environment.`,
        );
        lines.push(
          `**Phase 2 – Build & Integrate (2–3 weeks):** Implement core functionality, simple flows, and essential reporting.`,
        );
        lines.push(
          `**Phase 3 – Launch (1 week):** UAT, fixes, documentation, and handoff.`,
        );
      } else if (complexity === 'standard') {
        lines.push(
          `**Phase 1 – Discovery & Design (1–2 weeks):** Deep dive on use cases, architecture, data flows, and security considerations.`,
        );
        lines.push(
          `**Phase 2 – Build & Iteration (3–5 weeks):** Implement features in weekly sprints with check-ins and demos.`,
        );
        lines.push(
          `**Phase 3 – Hardening & Launch (1–2 weeks):** Performance tuning, edge-case handling, and production rollout.`,
        );
      } else {
        lines.push(
          `**Phase 1 – Strategy & Architecture (2–3 weeks):** Multi-stakeholder workshops, solution architecture, and risk assessment.`,
        );
        lines.push(
          `**Phase 2 – Implementation (6–10 weeks):** Incremental delivery of features with staging environments and integration testing.`,
        );
        lines.push(
          `**Phase 3 – Production & Enablement (2–4 weeks):** Monitoring, training, documentation, and long-term roadmap.`,
        );
      }

      lines.push('');
      lines.push('## 4. Constraints & Assumptions');

      if (budget.trim()) {
        lines.push(`- Target budget: ${budget.trim()}.`);
      } else {
        lines.push('- Budget to be finalized after discovery, based on confirmed scope.');
      }

      lines.push('- Project assumes access to required APIs, data sources, and accounts.');
      lines.push('- Any additional major integrations or new systems may require change orders.');

      lines.push('');
      lines.push('## 5. Success Metrics');
      lines.push('- Clear before/after metrics for the chosen goals (e.g. lead volume, response time, conversion rate).');
      lines.push('- System stability and performance under expected load.');
      lines.push('- Usability for internal teams and/or end users.');

      lines.push('');
      lines.push('---');
      lines.push(
        'This draft scope is meant as a starting point. In a full engagement, we would refine this into a detailed statement of work, technical architecture, and delivery plan.',
      );

      setScope(lines.join('\n'));
      setLoading(false);
    }, 300);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    generateScope();
  }

  return (
    <div className="max-w-4xl mx-auto bg-[#0E1030]/70 border border-cyan-900/50 rounded-2xl p-6 md:p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Project type</label>
            <input
              className="w-full rounded-md bg-[#05071c] border border-cyan-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              placeholder="AI marketing automation, web app, internal tool..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Industry / context</label>
            <input
              className="w-full rounded-md bg-[#05071c] border border-cyan-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Real estate, healthcare, SaaS, local services..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Main goals</label>
          <textarea
            className="w-full rounded-md bg-[#05071c] border border-cyan-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Increase inbound leads, reduce manual work, shorten response time, improve UX..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Timeline</label>
            <input
              className="w-full rounded-md bg-[#05071c] border border-cyan-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 4–6 weeks"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Budget (optional)</label>
            <input
              className="w-full rounded-md bg-[#05071c] border border-cyan-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. $10k–$25k"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Complexity</label>
            <select
              className="w-full rounded-md bg-[#05071c] border border-cyan-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={complexity}
              onChange={(e) => setComplexity(e.target.value as Complexity)}
            >
              <option value="simple">Simple MVP</option>
              <option value="standard">Standard project</option>
              <option value="advanced">Advanced / multi-system</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Key tools or integrations (optional)</label>
          <input
            className="w-full rounded-md bg-[#05071c] border border-cyan-900/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={integrations}
            onChange={(e) => setIntegrations(e.target.value)}
            placeholder="CRMs, data sources, internal systems, third-party APIs..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-cyan-500 text-sm font-semibold text-black hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating scope…' : 'Generate project scope'}
          </button>
        </div>
      </form>

      {scope && (
        <div className="mt-8 border-t border-cyan-900/60 pt-6">
          <h4 className="text-lg font-semibold mb-3 text-cyan-300">Generated Project Scope</h4>
          <div className="text-sm whitespace-pre-line text-cyan-100/90 bg-[#05071c] border border-cyan-900/60 rounded-xl p-4 max-h-[480px] overflow-y-auto">
            {scope}
          </div>
        </div>
      )}
    </div>
  );
}
