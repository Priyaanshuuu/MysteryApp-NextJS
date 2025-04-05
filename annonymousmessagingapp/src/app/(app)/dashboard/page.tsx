'use client';

import { useEffect, useState } from "react";
import { Send, Bot, Bell, XCircle, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

let debounceTimeout: NodeJS.Timeout;

export default function Dashboard() {
  const [recipient, setRecipient] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Hello! How can I help you?",
    "What's on your mind?",
    "Need assistance with something?",
  ]);
  const [inbox, setInbox] = useState<string[]>([]);
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [acceptMessages, setAcceptMessages] = useState<boolean>(true);
  const [userSuggestions, setUserSuggestions] = useState<string[]>([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState<boolean>(false);

  const handleSend = async () => {
    if (!recipient.trim()) {
      toast.error("Please enter recipient username");
      return;
    }

    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: recipient,
          content: message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent successfully");
        setSentMessages((prev) => [...prev, message]);
        setMessage("");
        setRecipient("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);
    setShowUserSuggestions(true);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      if (value.trim()) {
        try {
          const res = await fetch(`/api/usernames?search=${value}`);
          const data = await res.json();
          setUserSuggestions(data.usernames || []);
        } catch (err) {
          setUserSuggestions([]);
        }
      } else {
        setUserSuggestions([]);
      }
    }, 300); // Debounce
  };

  const receiveMessage = (msg: string) => {
    if (acceptMessages) {
      setInbox((prev) => [...prev, msg]);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-6 w-full">
      <h1 className="text-4xl font-bold text-white mb-6">Dashboard</h1>

      {/* Sent Messages */}
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
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4 flex flex-col relative">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Chat Box</h2>

        <input
          type="text"
          placeholder="Enter recipient's username"
          value={recipient}
          onChange={handleRecipientChange}
          onFocus={() => setShowUserSuggestions(true)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-1"
        />

        {showUserSuggestions && userSuggestions.length > 0 && (
          <div className="absolute top-24 bg-white shadow-md border w-full max-w-lg rounded-lg z-50 max-h-40 overflow-auto">
            {userSuggestions.map((name, i) => (
              <div
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setRecipient(name);
                  setShowUserSuggestions(false);
                }}
              >
                {name}
              </div>
            ))}
          </div>
        )}

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-400 mt-2"
          rows={4}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="mt-3 w-full bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? (
            <>
              Sending <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            </>
          ) : (
            <>
              Send <Send className="ml-2 h-5 w-5" />
            </>
          )}
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

      {/* Accept Toggle */}
      <button
        className="absolute bottom-6 left-6 px-4 py-2 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600"
        onClick={() => {
          setAcceptMessages(!acceptMessages);
          toast.success(
            acceptMessages ? "Stopped accepting messages" : "Now accepting messages"
          );
        }}
      >
        {acceptMessages ? "Stop Accepting Messages" : "Accept Messages"}
      </button>
    </div>
  );
}
