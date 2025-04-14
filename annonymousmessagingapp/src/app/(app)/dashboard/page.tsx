"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { MessageSquare } from "lucide-react";

export default function Dashboard() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [inboxMessages, setInboxMessages] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [acceptingMessages, setAcceptingMessages] = useState(true);
  const [userSuggestions, setUserSuggestions] = useState<string[]>([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [toastMsg, setToastMsg] = useState<{
    title: string;
    type?: "error" | "success";
  } | null>(null);

  useEffect(() => {
    fetchAcceptingStatus();
    fetchInboxMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!recipient || !message) {
      setToastMsg({ title: "Recipient and message are required", type: "error" });
      return;
    }

    const res = await fetch("/api/send-messages", {
      method: "POST",
      body: JSON.stringify({ username: recipient, content: message }),
    });

    if (res.ok) {
      setToastMsg({ title: "Message sent successfully", type: "success" });
      setSentMessages((prev) => [...prev, message]);
      setMessage("");
    } else {
      setToastMsg({ title: "Failed to send message", type: "error" });
    }
  };

  const fetchAcceptingStatus = async () => {
    const res = await fetch("/api/accept-messages");
    if (res.ok) {
      const data = await res.json();
      setAcceptingMessages(data.acceptingMessages);
    }
  };

  const fetchInboxMessages = async () => {
    const res = await fetch("/api/get-messages");
    if (res.ok) {
      const data = await res.json();
      const messages = data.messages.map((m: any) => m.content);
      setInboxMessages(messages);
    }
  };

  const toggleAcceptingMessages = async () => {
    const res = await fetch("/api/accept-messages", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setAcceptingMessages(data.acceptingMessages);
    }
  };

  const handleRecipientChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);

    if (value.trim() === "") {
      setUserSuggestions([]);
      setShowUserSuggestions(false);
      return;
    }

    try {
      const res = await fetch(`/api/usernames?q=${value}`);
      const data = await res.json();
      setUserSuggestions(data.usernames);
      setShowUserSuggestions(true);
    } catch (err) {
      console.error("Error fetching usernames:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#e3f6f5] text-[#272343] p-6 flex flex-col items-center gap-6 relative">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            title={toastMsg.title}
            variant={toastMsg.type === "error" ? "destructive" : "default"}
          />
        </div>
      )}

      <Toaster />

      {/* Inbox */}
      <div className="absolute top-6 right-6 bg-white shadow-lg rounded-2xl p-4 w-72">
        <h2 className="text-lg font-semibold mb-2">Inbox</h2>
        <ul className="text-sm text-gray-700 max-h-40 overflow-auto space-y-1 list-disc list-inside">
          {inboxMessages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* Chat Box */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg relative">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="space-y-4 relative">
          <Input
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Recipient username"
            className="border border-gray-300"
          />
          {showUserSuggestions && userSuggestions.length > 0 && (
            <div className="absolute top-16 w-full bg-white border border-gray-300 rounded-lg shadow-md z-50">
              <ul className="max-h-40 overflow-auto">
                {userSuggestions.map((name, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setRecipient(name);
                      setShowUserSuggestions(false);
                      setToastMsg({ title: `Selected ${name}`, type: "success" });
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="border border-gray-300"
          />

          <Button
            onClick={handleSendMessage}
            className="w-full text-white bg-gradient-to-r from-purple-500 to-indigo-600"
          >
            Send
          </Button>
        </div>
      </div>

      {/* Sent Messages */}
      <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-2">Sent Messages</h2>
        <ul className="text-sm text-gray-700 max-h-40 overflow-auto space-y-1 list-disc list-inside">
          {sentMessages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-indigo-500" /> AI Suggestions
        </h2>
        <ul className="mt-2 text-sm text-gray-700 max-h-40 overflow-auto space-y-1 list-disc list-inside">
          {aiSuggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Toggle Accepting Messages */}
      <div className="absolute bottom-6 left-6">
        <Button
          onClick={toggleAcceptingMessages}
          variant="outline"
          className="bg-white border border-gray-300 text-[#272343]"
        >
          {acceptingMessages ? "Stop Accepting Messages" : "Accept Messages"}
        </Button>
      </div>
    </div>
  );
}
