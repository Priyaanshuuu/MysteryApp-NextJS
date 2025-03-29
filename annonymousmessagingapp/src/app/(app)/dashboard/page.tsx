'use client';

import { useState } from "react";
import { Send, Bot } from "lucide-react";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([
    "Hello! How can I help you?",
    "What's on your mind?",
    "Need assistance with something?",
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Dashboard</h1>

      {/* Chat Box */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Chat Box</h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-400"
          rows={4}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="mt-3 w-full bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition">
          Send <Send className="ml-2 h-5 w-5" />
        </button>
      </div>

      {/* AI Suggestions Box */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
          <Bot className="mr-2 h-5 w-5 text-indigo-500" /> AI Suggestions
        </h2>
        <div className="mt-3 space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMessage(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
