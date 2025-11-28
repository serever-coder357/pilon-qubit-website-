"use client";

import { useState } from "react";

export default function InputBar({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  };

  return (
    <div className="p-3 border-t bg-white flex gap-2">
      <input
        className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
        placeholder="Ask anything about Pilon Qubit Ventures..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <button
        type="button"
        onClick={submit}
        className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800"
      >
        Send
      </button>
    </div>
  );
}
