"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatPanel from "./ChatPanel";

export default function Widget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center hover:bg-neutral-800 transition"
        aria-label="Open PQV Assistant"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        AI
      </motion.button>

      {/* Slide-up panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="fixed bottom-0 right-0 left-0 md:right-6 md:left-auto md:w-[380px] h-[70vh] md:h-[600px] bg-white shadow-2xl rounded-t-2xl md:rounded-2xl z-50 overflow-hidden flex flex-col"
          >
            <ChatPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
