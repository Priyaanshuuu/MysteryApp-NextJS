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
  const [userPrompt, setUserPrompt] = useState("");

  useEffect(() => {
    fetchAcceptingStatus();
    fetchInboxMessages();
  }, []);

  const showToast = (title: string, type: "error" | "success" = "success") => {
    setToastMsg({ title, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendMessage = async () => {
    if (!recipient || !message) {
      return showToast("Recipient and message are required", "error");
    }

    try {
      const res = await fetch("/api/send-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: recipient, content: message }),
      });

      if (res.ok) {
        setSentMessages((prev) => [...prev, message]);
        setMessage("");
        showToast("Message sent successfully", "success");
      } else {
        const error = await res.json();
        showToast(error.message || "Failed to send message", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };

  const fetchAcceptingStatus = async () => {
    try {
      const res = await fetch("/api/accept-messages");
      if (res.ok) {
        const data = await res.json();
        setAcceptingMessages(data.isAcceptingMessage);
      }
    } catch (error) {
      console.error("Error fetching accepting status", error);
    }
  };

  const toggleAcceptingMessages = async () => {
    const newStatus = !acceptingMessages;
  
    const res = await fetch("/api/accept-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ acceptMessages: newStatus }),
    });
  
    if (res.ok) {
      const data = await res.json();
      console.log("Toggle API response:", data);
  
      const updatedStatus = data?.updatedUser?.isAcceptingMessages;
  
      if (typeof updatedStatus === "boolean") {
        setAcceptingMessages(updatedStatus);
        setToastMsg({
          title: `Now ${updatedStatus ? "accepting" : "not accepting"} messages`,
          type: "success",
        });
      } else {
        setToastMsg({ title: "Unexpected response format", type: "error" });
      }
    } else {
      setToastMsg({ title: "Failed to update message preference", type: "error" });
    }
  };
  
  

  const fetchInboxMessages = async () => {
    try {
      const res = await fetch("/api/get-messages");
      if (res.ok) {
        const data = await res.json();
        setInboxMessages(data.messages.map((m: any) => m.content));
      }
    } catch (error) {
      console.error("Error fetching inbox messages", error);
    }
  };

  const handleRecipientChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);

    if (!value.trim()) {
      setUserSuggestions([]);
      setShowUserSuggestions(false);
      return;
    }

    try {
      const res = await fetch(`/api/usernames?q=${value}`);
      if (res.ok) {
        const data = await res.json();
        setUserSuggestions(data.usernames);
        setShowUserSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

  const fetchAISuggestions = async () => {
    if (!userPrompt) {
      return showToast("Please enter a prompt for suggestions", "error");
    }

    try {
      const res = await fetch("/api/suggest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(data.suggestions || []);
        if (!data.suggestions?.length) {
          showToast("No suggestions found", "error");
        }
      } else {
        showToast("Failed to fetch AI suggestions", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
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
          {inboxMessages.length > 0 ? (
            inboxMessages.map((msg, i) => <li key={i}>{msg}</li>)
          ) : (
            <li>No messages yet</li>
          )}
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
                      showToast(`Selected ${name}`, "success");
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
          {sentMessages.length > 0 ? (
            sentMessages.map((msg, i) => <li key={i}>{msg}</li>)
          ) : (
            <li>No sent messages</li>
          )}
        </ul>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-indigo-500" /> AI Suggestions
        </h2>

        <Input
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Enter your prompt for suggestions..."
          className="border border-gray-300 mb-4"
        />

        <Button
          onClick={fetchAISuggestions}
          className="w-full text-white bg-gradient-to-r from-purple-500 to-indigo-600"
        >
          Get Suggestions
        </Button>

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
