'use client';

import { useState } from 'react';

export default function ContactDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg"
      >
        Contact Us
      </button>

      {open && (
        <div className="absolute right-0 mt-4 w-96 bg-gradient-to-br from-[#0A0A2A] to-[#1A1A4A] border border-cyan-500/50 rounded-2xl shadow-2xl p-8 z-50">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6">Get in Touch</h3>
          <div className="space-y-6 text-lg">
            <a href="tel:+12104600912" className="flex items-center gap-4 text-cyan-300 hover:text-white transition">
              Phone 210-460-0912
            </a>
            <a href="mailto:hello@pilonqubitventures.com" className="flex items-center gap-4 text-cyan-300 hover:text-white transition">
              Email hello@pilonqubitventures.com
            </a>
            <div className="pt-4 border-t border-cyan-500/30 text-cyan-200">
              <p className="font-semibold">Visit Us</p>
              <p className="mt-2 leading-relaxed">
                401 E Sonterra Blvd<br />Suite 375<br />San Antonio, TX 78258
              </p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-cyan-400 hover:text-white text-2xl">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
