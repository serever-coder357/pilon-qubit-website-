'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-white/80 hover:text-white transition-colors font-medium"
      >
        Contact
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-80 bg-[#1A1A4A] border border-cyan-500/50 rounded-xl shadow-2xl p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Get in Touch</h3>
            <div className="space-y-4 text-sm">
              <a href="tel:+12104600912" className="flex items-center gap-3 text-cyan-300 hover:text-cyan-100">
                Phone 210-460-0912
              </a>
              <a href="mailto:hello@pilonqubitventures.com" className="flex items-center gap-3 text-cyan-300 hover:text-cyan-100">
                Email hello@pilonqubitventures.com
              </a>
              <div className="text-cyan-200 pt-3 border-t border-cyan-500/30">
                <p className="font-semibold">Visit Us</p>
                <p className="text-cyan-300">
                  401 E Sonterra Blvd<br />
                  Ste 375<br />
                  San Antonio, TX 78258
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-cyan-400 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
}
