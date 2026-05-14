"use client";

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
  try {
    const res = await fetch("/api/test", {
      method: "POST"
    });

    const text = await res.text();

    alert(text);   // ✅ directly show raw response

  } catch {
    alert("ERROR");
  }
}
``

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h2>✅ AI Chatbot</h2>

      {/* CHAT BOX */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "auto",
          marginBottom: 10
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <strong>{msg.role === "user" ? "You: " : "AI: "}</strong>
            {msg.text}
          </div>
        ))}

        {loading && <div>AI is typing...</div>}
      </div>

      {/* INPUT */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
        style={{ padding: 8, width: "70%" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginLeft: 10,
          padding: "8px 16px",
          cursor: "pointer"
        }}
      >
        Send
      </button>
    </div>
  );
}
``