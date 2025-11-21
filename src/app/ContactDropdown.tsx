'use client';

import { useState } from 'react';

export default function ContactDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl hover:shadow-2xl"
      >
        Contact Us
      </button>

      {open && (
        <div className="absolute right-0 mt-4 w-96 bg-gradient-to-br from-[#0A0A2A] to-[#1A1A4A] border-2 border-cyan-500/60 rounded-2xl shadow-2xl p-8 z-50">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-6 text-cyan-400 hover:text-white text-3xl font-light"
          >
            ×
          </button>
          <h3 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Get in Touch</h3>
          <div className="space-y-8 text-lg">
            <a
              href="tel:+12104600912"
              className="flex items-center justify-center gap-4 text-cyan-300 hover:text-white transition"
            >
              Phone 210-460-0912
            </a>
            <a
              href="mailto:hello@pilonqubitventures.com"
              className="flex items-center justify-center gap-4 text-cyan-300 hover:text-white transition"
            >
              Email hello@pilonqubitventures.com
            </a>
            <div className="pt-6 border-t-2 border-cyan-500/40 text-center">
              <p className="font-bold text-cyan-200 mb-2">Visit Us</p>
              <p className="text-cyan-300 leading-relaxed">
                401 E Sonterra Blvd<br />
                Suite 375<br />
                San Antonio, TX 78258
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
