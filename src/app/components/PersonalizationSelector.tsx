'use client';

import { useState, useEffect } from 'react';
import { detectVisitorType, setVisitorType, getVisitorTypeLabel, type VisitorType } from '@/lib/personalization';

export default function PersonalizationSelector() {
  const [currentType, setCurrentType] = useState<VisitorType>('unknown');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentType(detectVisitorType());
  }, []);

  const handleTypeChange = (type: VisitorType) => {
    setVisitorType(type);
    setCurrentType(type);
    setIsOpen(false);
    // Reload page to apply personalization
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-sm border border-cyan-500/30 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all text-sm flex items-center gap-2"
        title="Personalization Settings"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden sm:inline">{getVisitorTypeLabel(currentType)}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-[#0E1030] border border-cyan-500/30 rounded-lg shadow-xl p-4 min-w-[250px]">
          <div className="text-sm text-cyan-100 mb-3 font-semibold">View site as:</div>
          <div className="space-y-2">
            {(['founder', 'enterprise', 'developer', 'unknown'] as VisitorType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  currentType === type
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/5 text-cyan-100 hover:bg-white/10'
                }`}
              >
                {getVisitorTypeLabel(type)}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-cyan-500/20 text-xs text-cyan-100/60">
            Content adapts to your profile
          </div>
        </div>
      )}
    </div>
  );
}
