'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/ui/toast'
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
  const [toastMsg, setToastMsg] = useState<{ title: string; type?: 'error' | 'success' }>()

  const handleSendMessage = async () => {
    if (!recipient || !message) {
      setToastMsg({ title: 'Recipient and message are required', type: 'error' })
      return
    }

    const res = await fetch('/api/send-message', {
      method: 'POST',
      body: JSON.stringify({ username: recipient, content: message }),
    })

    if (res.ok) {
      setToastMsg({ title: 'Message sent successfully', type: 'success' })
      setSentMessages([...sentMessages, message])
      setMessage('')
    } else {
      setToastMsg({ title: 'Failed to send message', type: 'error' })
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
    <div className="min-h-screen bg-[#e3f6f5] p-6 flex flex-col items-center gap-6 relative">
      {toastMsg && (
        <Toast
          title={toastMsg.title}
          variant={toastMsg.type === 'error' ? 'destructive' : 'default'}
        />
      )}

      {/* Inbox - Top Right */}
      <div className="absolute top-6 right-6 bg-white shadow-lg rounded-2xl p-4 w-72">
        <h2 className="text-lg font-semibold mb-2 text-[#272343]">Inbox</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 max-h-40 overflow-auto">
          {inboxMessages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* Chat Box */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg relative">
        <h1 className="text-2xl font-bold mb-4 text-[#272343]">Dashboard</h1>

        <div className="space-y-4">
          <Input
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Recipient username"
            className="border border-gray-300"
          />
          {showUserSuggestions && recipient.trim() && userSuggestions.length > 0 && (
            <div className="absolute top-[120px] left-0 w-full max-w-lg z-50">
              <div className="border border-gray-300 rounded-lg bg-white shadow-lg overflow-hidden">
                <ul className="max-h-40 overflow-auto">
                  {userSuggestions.map((name, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setRecipient(name)
                        setShowUserSuggestions(false)
                        setToastMsg({ title: `Selected ${name}`, type: 'success' })
                      }}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
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
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white w-full"
          >
            Send
          </Button>
        </div>
      </div>

      {/* Sent Messages */}
      <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-2 text-[#272343]">Sent Messages</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 max-h-40 overflow-auto">
          {sentMessages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-[#272343] flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-indigo-500" /> AI Suggestions
        </h2>
        <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-700 max-h-40 overflow-auto">
          {aiSuggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Accept/Stop Button - Bottom Left */}
      <div className="absolute bottom-6 left-6">
        <Button
          onClick={toggleAcceptingMessages}
          variant="outline"
          className="bg-white border border-gray-300 text-[#272343]"
        >
          {acceptingMessages ? 'Stop Accepting Messages' : 'Accept Messages'}
        </Button>
      </div>
    </div>
  )
}
