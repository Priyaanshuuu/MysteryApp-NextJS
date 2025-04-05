'use client';

import { useEffect, useState } from "react";
import { Send, Bot, Bell, XCircle, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  content: string;
  createdAt: Date;
}

export default function Dashboard() {
  const [message, setMessage] = useState<string>("");
  const [suggestions] = useState<string[]>([
    "Hello! How can I help you?",
    "What's on your mind?",
    "Need assistance with something?",
  ]);
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [acceptMessages, setAcceptMessages] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (msg: string) => {
    if (!msg.trim()) return toast.error("Message cannot be empty!");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: "your-username", content: msg })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSentMessages((prev) => [...prev, msg]);
        receiveMessage({ content: msg, createdAt: new Date() });
        toast.success("Message sent!");
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Sending failed:", err);
      toast.error("An error occurred while sending.");
    } finally {
      setLoading(false);
    }
  };

  const receiveMessage = (msg: Message) => {
    if (acceptMessages) {
      setInbox((prev) => [...prev, msg]);
    }
  };

  const toggleAcceptMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accept-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ acceptMessages: !acceptMessages })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAcceptMessages((prev) => !prev);
        toast.success(`You ${!acceptMessages ? "started" : "stopped"} accepting messages.`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Error updating acceptance status.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptStatus = async () => {
    try {
      const res = await fetch("/api/accept-message", { method: "GET" });
      const data = await res.json();
      if (res.ok && data.success) {
        setAcceptMessages(data.isAcceptingMessages);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchAcceptStatus();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-6 w-full">
      <h1 className="text-4xl font-bold text-white mb-6">Dashboard</h1>

      {/* Sent Messages Panel */}
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

      {/* Chat Box */}
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
          className="mt-3 w-full bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition disabled:opacity-50"
          onClick={() => sendMessage(message)}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Send <Send className="ml-2 h-5 w-5" /></>}
        </button>
      </div>

      {/* AI Suggestions */}
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

      {/* Inbox */}
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
                <span>{msg.content}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setInbox((prev) => prev.filter((_, i) => i !== index))}
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

      {/* Accept Toggle */}
      <button
        className="absolute bottom-6 left-6 px-4 py-2 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600 disabled:opacity-50"
        onClick={toggleAcceptMessages}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating...
          </span>
        ) : acceptMessages ? "Stop Accepting Messages" : "Accept Messages"}
      </button>
    </div>
  );
}
