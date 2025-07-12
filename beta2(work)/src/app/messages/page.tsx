'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, MessageSquare, User } from 'lucide-react'

interface Message {
  id: number
  requesterId: number
  receiverId: number
  message: string | null
  createdAt: string
  requester: {
    id: number
    name: string
    email: string
    profilePhoto?: string
  }
  receiver: {
    id: number
    name: string
    email: string
    profilePhoto?: string
  }
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setCurrentUser(parsedUser)
      fetchMessages()
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
    }
  }, [router])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setMessages(data.data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOtherUser = (message: Message) => {
    return message.requesterId === currentUser?.id ? message.receiver : message.requester
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Skill Swap Platform
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">
            View your skill swap conversations and requests.
          </p>
        </div>

        {/* Messages List */}
        <div className="bg-white shadow rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500">
                Start connecting with other users to exchange skills!
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Browse Skills
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => {
                const otherUser = getOtherUser(message)
                return (
                  <div key={message.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {otherUser.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {otherUser.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {message.requesterId === currentUser?.id ? 'You' : otherUser.name} sent a skill swap request
                        </p>
                        {message.message && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">{message.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
