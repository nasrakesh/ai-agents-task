"use client";

import { useState } from "react";

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi 👋 I am your AI Assistant. Ask me anything!"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {

    if (!input.trim()) return;

    const userText = input;

    // ✅ Add user message
    setMessages(prev => [
      ...prev,
      {
        role: "user",
        text: userText
      }
    ]);

    setInput("");
    setLoading(true);

    try {

      // ✅ Use your ORIGINAL working endpoint
      const res = await fetch(
        "https://ai-agent-service-502854994569.us-central1.run.app/apps/agent_comparison__app/users/test_user_456/sessions/session_tool_agent_xyz",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: {
              role: "user",

              parts: [
                {
                  text: userText
                }
              ]
            }
          })
        }
      );

      console.log("STATUS:", res.status);

      // ✅ Handle server errors
      if (!res.ok) {

        const errorText = await res.text();

        console.log("SERVER ERROR:", errorText);

        setMessages(prev => [
          ...prev,
          {
            role: "ai",
            text: `❌ Server Error ${res.status}`
          }
        ]);

        setLoading(false);
        return;
      }

      // ✅ Parse response
      const data = await res.json();

      console.log("API RESPONSE:", data);

      // ✅ Extract AI response safely
      let reply = "No AI response";

      if (Array.isArray(data) && data.length > 0) {

        const lastMessage = data[data.length - 1];

        reply =
          lastMessage?.content?.parts?.[0]?.text ||
          "No text returned";

      }

      // ✅ Show AI message
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: reply
        }
      ]);

    } catch (err) {

      console.error(err);

      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: "❌ Backend connection failed"
        }
      ]);

    }

    setLoading(false);
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#eaf2ff] to-[#bcd2f5] relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-400 opacity-20 blur-3xl rounded-full top-[-100px] left-[50%] -translate-x-1/2 animate-pulse pointer-events-none"></div>

      {/* Header */}
      <div className="text-center pt-12">

        <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
          Ceptova
        </h1>

        <p className="text-blue-500 text-xl mt-2 font-medium">
          Smart AI Assistant
        </p>

      </div>

      <div className="flex justify-between items-center px-24 pt-20">

        {/* Left */}
        <div className="max-w-2xl space-y-6">

          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Empowering your business with intelligent,
          </h1>

          <h1 className="text-6xl font-bold text-gray-700">
            autonomous agents
          </h1>

        </div>

        {/* Chat */}
        <div className="w-[380px] backdrop-blur-xl bg-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-3xl p-5 border border-white/40">

          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b pb-3">

            <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white">
              🤖
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              Ceptova Assistant
            </h3>

          </div>

          {/* Messages */}
          <div className="h-[320px] overflow-y-auto mt-4 space-y-3">

            {messages.map((m, i) => (

              <div
                key={i}
                className={`flex ${
                  m.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[75%]
                  ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >

                  {m.text}

                </div>

              </div>

            ))}

            {loading && (

              <div className="flex justify-start">

                <div className="bg-gray-100 px-3 py-2 rounded-xl text-sm animate-pulse">
                  typing...
                </div>

              </div>

            )}

          </div>

          {/* Input */}
          <div className="flex gap-2 mt-4">

            <input
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              type="button"
              onClick={sendMessage}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition shadow-md"
            >
              Send
            </button>

          </div>

        </div>

      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#9bb8e7] to-transparent"></div>

    </div>
  );
}

