'use client';

import { useState } from "react";
import { Send, Bot, Bell, XCircle, MessageSquare } from "lucide-react";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([
    "Hello! How can I help you?",
    "What's on your mind?",
    "Need assistance with something?",
  ]);
  const [inbox, setInbox] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [acceptMessages, setAcceptMessages] = useState(true);

  const sendMessage = (msg) => {
    if (msg.trim()) {
      setSentMessages((prev) => [...prev, msg]);
      receiveMessage(msg);
      setMessage("");
    }
  };

  const receiveMessage = (msg) => {
    if (acceptMessages) {
      setInbox((prev) => [...prev, msg]);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-6 w-full">
      <h1 className="text-4xl font-bold text-white mb-6">Dashboard</h1>
      
      <div className="absolute top-6 right-6 w-80 bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-indigo-500" /> Sent Messages
        </h2>
        <div className="mt-3 space-y-2 max-h-40 overflow-auto">
          {sentMessages.length > 0 ? (
            sentMessages.map((msg, index) => (
              <div key={index} className="p-2 border border-gray-300 rounded-lg bg-gray-100">
                {msg}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages sent</p>
          )}
        </div>
      </div>

      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Chat Box</h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-400"
          rows={4}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
          className="mt-3 w-full bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition"
          onClick={() => sendMessage(message)}
        >
          Send <Send className="ml-2 h-5 w-5" />
        </button>
      </div>

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

      <div className="absolute bottom-6 right-6 w-80 bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
          <Bell className="mr-2 h-5 w-5 text-indigo-500" /> Inbox
        </h2>
        <div className="mt-3 space-y-2 max-h-40 overflow-auto">
          {inbox.length > 0 ? (
            inbox.map((msg, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-2 border border-gray-300 rounded-lg bg-gray-100"
              >
                <span>{msg}</span>
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setInbox(inbox.filter((_, i) => i !== index))}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No new messages</p>
          )}
        </div>
      </div>

      <button
        className="absolute bottom-6 left-6 px-4 py-2 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600 md:text-sm md:px-3 md:py-1"
        onClick={() => setAcceptMessages(!acceptMessages)}
      >
        {acceptMessages ? "Stop Accepting Messages" : "Accept Messages"}
      </button>
    </div>
  );
}
