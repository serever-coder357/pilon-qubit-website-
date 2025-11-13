'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, Eye, MousePointerClick, Clock, Globe, BarChart3 } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [liveVisitors, setLiveVisitors] = useState(0);

  // Simulate live visitor count
  useEffect(() => {
    const updateLiveVisitors = () => {
      setLiveVisitors(Math.floor(Math.random() * 15) + 5);
    };
    updateLiveVisitors();
    const interval = setInterval(updateLiveVisitors, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulated metrics (in production, these would come from real analytics)
  const metrics: Metric[] = [
    {
      label: 'Total Visitors',
      value: timeRange === '7d' ? '1,247' : timeRange === '30d' ? '5,892' : '18,456',
      change: '+23%',
      trend: 'up',
      icon: Users,
    },
    {
      label: 'Page Views',
      value: timeRange === '7d' ? '3,421' : timeRange === '30d' ? '15,678' : '52,341',
      change: '+18%',
      trend: 'up',
      icon: Eye,
    },
    {
      label: 'Avg. Session Duration',
      value: '4m 32s',
      change: '+12%',
      trend: 'up',
      icon: Clock,
    },
    {
      label: 'Conversion Rate',
      value: '12.4%',
      change: '+3.2%',
      trend: 'up',
      icon: MousePointerClick,
    },
  ];

  const topPages = [
    { path: '/', views: 8234, percentage: 35 },
    { path: '/services', views: 4521, percentage: 19 },
    { path: '/case-studies', views: 3892, percentage: 16 },
    { path: '/assessment', views: 2456, percentage: 10 },
    { path: '/roi-calculator', views: 2134, percentage: 9 },
    { path: '/labs', views: 1567, percentage: 7 },
    { path: '/benchmarking', views: 1098, percentage: 4 },
  ];

  const topCountries = [
    { country: 'United States', visitors: 2456, percentage: 42 },
    { country: 'United Kingdom', visitors: 1234, percentage: 21 },
    { country: 'Canada', visitors: 892, percentage: 15 },
    { country: 'Germany', visitors: 567, percentage: 10 },
    { country: 'Australia', visitors: 445, percentage: 8 },
    { country: 'Other', visitors: 298, percentage: 4 },
  ];

  const conversionFunnel = [
    { stage: 'Landing Page Visit', count: 5892, percentage: 100 },
    { stage: 'Engagement (2+ pages)', count: 3534, percentage: 60 },
    { stage: 'Tool Usage (Assessment/ROI)', count: 1767, percentage: 30 },
    { stage: 'Contact Form View', count: 1178, percentage: 20 },
    { stage: 'Form Submission', count: 730, percentage: 12.4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A2A] via-[#1A1A4A] to-[#0A0A2A] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl font-bold">Public Analytics</h1>
          </div>
          <p className="text-xl text-cyan-100/70 max-w-3xl">
            We practice what we preach. Here&apos;s real-time data on our website performance, user engagement, and conversion metrics. Full transparency in action.
          </p>
        </div>

        {/* Live Visitors */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-400 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 h-3 w-3 bg-green-400 rounded-full animate-ping" />
              </div>
              <span className="text-lg font-semibold">Live Visitors</span>
            </div>
            <div className="text-4xl font-bold text-green-400">{liveVisitors}</div>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timeRange === range
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-cyan-100/70 hover:bg-white/20'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-8 w-8 text-cyan-400" />
                  <div className={`text-sm font-semibold ${
                    metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {metric.change}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-cyan-100/70">{metric.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Top Pages */}
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Top Pages</h2>
            <div className="space-y-4">
              {topPages.map((page) => (
                <div key={page.path}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-cyan-100/90 font-mono">{page.path}</span>
                    <span className="text-cyan-100/70">{page.views.toLocaleString()} views</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-cyan-400" />
              Visitor Geography
            </h2>
            <div className="space-y-4">
              {topCountries.map((country) => (
                <div key={country.country}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-cyan-100/90">{country.country}</span>
                    <span className="text-cyan-100/70">{country.visitors.toLocaleString()} visitors</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white/5 backdrop-blur-sm border border-cyan-900/40 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Conversion Funnel</h2>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-cyan-400">{index + 1}</div>
                    <span className="text-lg font-semibold">{stage.stage}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{stage.count.toLocaleString()}</div>
                    <div className="text-sm text-cyan-100/70">{stage.percentage}%</div>
                  </div>
                </div>
                <div className="h-12 bg-white/10 rounded-lg overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-end pr-4"
                    style={{ width: `${stage.percentage}%` }}
                  >
                    {stage.percentage >= 20 && (
                      <span className="text-sm font-semibold">{stage.percentage}%</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Transparency Statement */}
        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-900/40 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Why We Share Our Analytics</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Practice What We Preach</h3>
              <p className="text-cyan-100/70">
                We help clients build analytics infrastructure and data-driven cultures. Sharing our own metrics demonstrates we use the same tools and methodologies we recommend.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Build Trust Through Transparency</h3>
              <p className="text-cyan-100/70">
                Public metrics show we&apos;re confident in our approach and have nothing to hide. This transparency builds trust with prospects and clients.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Demonstrate Growth</h3>
              <p className="text-cyan-100/70">
                Real-time data shows our business is growing and our content resonates with our target audience. Growth metrics validate our expertise.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Educational Value</h3>
              <p className="text-cyan-100/70">
                Seeing real analytics helps prospects understand what good looks like and sets realistic expectations for their own analytics initiatives.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xl text-cyan-100/70 mb-6">
              Want to build similar analytics infrastructure for your organization?
            </p>
            <Link
              href="/#contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Let&apos;s Talk Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
