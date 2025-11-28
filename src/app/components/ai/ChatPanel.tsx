"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setHistory(prev => [...prev, message]);
    setMessage("");
  };

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="fixed bottom-20 right-6 w-[360px] bg-white text-black p-4 rounded-2xl shadow-xl border border-gray-200"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">AI Assistant</h3>
        <button
          className="text-sm text-gray-500 hover:text-black"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="border rounded-lg h-40 p-2 overflow-y-auto bg-gray-50 text-sm">
        {history.length === 0 && (
          <p className="text-gray-400">Ask me anything…</p>
        )}
        {history.map((msg, i) => (
          <div key={i} className="mb-1">
            <span className="font-semibold">You:</span> {msg}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 border rounded-lg px-2 py-1 text-sm"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="px-3 py-1 text-sm bg-black text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}
