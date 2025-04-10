'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { MessageSquare } from 'lucide-react'

export default function Dashboard() {
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [sentMessages, setSentMessages] = useState<string[]>([])
  const [inboxMessages, setInboxMessages] = useState<string[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [acceptingMessages, setAcceptingMessages] = useState(true)
  const [userSuggestions, setUserSuggestions] = useState<string[]>([])
  const [showUserSuggestions, setShowUserSuggestions] = useState(false)

  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!recipient || !message) {
      toast({ title: 'Error', description: 'Recipient and message are required', variant: 'destructive' })
      return
    }

    const res = await fetch('/api/send-message', {
      method: 'POST',
      body: JSON.stringify({ username: recipient, content: message }),
    })

    if (res.ok) {
      toast({ title: 'Message sent successfully' })
      setSentMessages([...sentMessages, message])
      setMessage('')
    } else {
      toast({ title: 'Failed to send message', variant: 'destructive' })
    }
  }

  const toggleAcceptingMessages = async () => {
    const res = await fetch('/api/accept-message', { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setAcceptingMessages(data.acceptingMessages)
    }
  }

  const fetchAcceptingStatus = async () => {
    const res = await fetch('/api/accept-message')
    if (res.ok) {
      const data = await res.json()
      setAcceptingMessages(data.acceptingMessages)
    }
  }

  const handleRecipientChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRecipient(value)

    if (value.trim() === '') {
      setUserSuggestions([])
      setShowUserSuggestions(false)
      return
    }

    try {
      const res = await fetch(`/api/usernames?q=${value}`)
      const data = await res.json()
      setUserSuggestions(data.usernames)
      setShowUserSuggestions(true)
    } catch (err) {
      console.error('Error fetching usernames:', err)
    }
  }

  useEffect(() => {
    fetchAcceptingStatus()
  }, [])

  return (
    <div className="min-h-screen bg-[#e3f6f5] p-6 flex flex-col items-center gap-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg relative">
        <h1 className="text-2xl font-bold mb-4 text-[#272343]">Dashboard</h1>

        {/* Chat Box */}
        <div className="space-y-4">
          <Input
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Recipient username"
            className="border border-gray-300"
          />
          {showUserSuggestions && recipient.trim() && userSuggestions.length > 0 && (
            <div className="absolute top-28 left-0 bg-white shadow-md border w-full max-w-lg rounded-lg z-50 max-h-40 overflow-auto">
              {userSuggestions.map((name, i) => (
                <div
                  key={i}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setRecipient(name)
                    setShowUserSuggestions(false)
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="border border-gray-300"
          />
          <Button onClick={handleSendMessage} className="bg-[#bae8e8] text-[#272343]">
            Send
          </Button>
        </div>
      </div>

      {/* Sent Messages */}
      <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-2 text-[#272343]">Sent Messages</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {sentMessages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* Inbox */}
      <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-2 text-[#272343]">Inbox</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {inboxMessages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-[#272343] flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-indigo-500" /> AI Suggestions
        </h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-700">
          {aiSuggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* User Suggestions */}
      {userSuggestions.length > 0 && (
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-indigo-500" /> User Suggestions
          </h2>
          <div className="mt-3 space-y-2 max-h-40 overflow-auto">
            {userSuggestions.map((name, index) => (
              <div
                key={index}
                className="p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
                onClick={() => {
                  setRecipient(name)
                  setShowUserSuggestions(false)
                  toast({ title: `Selected ${name}` })
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Accept/Stop */}
      <Button
        onClick={toggleAcceptingMessages}
        variant="outline"
        className="mt-4 bg-white border border-gray-300 text-[#272343]"
      >
        {acceptingMessages ? 'Stop Accepting Messages' : 'Accept Messages'}
      </Button>
    </div>
  )
}
