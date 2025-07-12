'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Check, X, MessageSquare, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface SwapRequest {
  id: number
  requesterId: number
  receiverId: number
  skillOfferedId: number
  skillWantedId: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
  message: string | null
  createdAt: string
  updatedAt: string
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
  skillOffered: {
    skill: {
      id: number
      name: string
      category: string
    }
  }
  skillWanted: {
    skill: {
      id: number
      name: string
      category: string
    }
  }
}

export default function SwapsPage() {
  const [swaps, setSwaps] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    } else if (!isLoading && isAuthenticated) {
      fetchSwaps()
    }
  }, [filter, statusFilter, isAuthenticated, isLoading, router])

  const fetchSwaps = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const params = new URLSearchParams()
      if (filter !== 'all') params.append('type', filter)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/swaps?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setSwaps(data.data)
      }
    } catch (error) {
      console.error('Error fetching swaps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: number, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/swaps/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()
      if (data.success) {
        alert(data.message || `Request ${status.toLowerCase()} successfully`)
        fetchSwaps() // Refresh the list
      } else {
        alert(data.error || 'Failed to update request')
      }
    } catch (error) {
      console.error('Error updating swap status:', error)
      alert('Error updating swap status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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

  if (loading || isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Skill Swaps</h1>
          <p className="mt-2 text-gray-600">
            Manage your skill swap requests and offers.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'sent' | 'received')}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="all">All Swaps</option>
                  <option value="sent">Sent Requests</option>
                  <option value="received">Received Requests</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Swaps List */}
        <div className="bg-white shadow rounded-lg">
          {swaps.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No skill swap requests yet. Start by requesting a skill swap!'
                  : filter === 'sent' 
                    ? 'You haven\'t sent any swap requests yet.'
                    : 'You haven\'t received any swap requests yet.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {swaps.map((swap) => (
                <div key={swap.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {(user && swap.requesterId === user.id ? swap.receiver.name : swap.requester.name)?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {user && swap.requesterId === user.id ? swap.receiver.name : swap.requester.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {user && swap.requesterId === user.id ? 'You sent a request to' : 'Sent you a request'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Skill Exchange Info */}
                      <div className="mb-3 p-3 bg-blue-50 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              {user && swap.requesterId === user.id ? 'You offer:' : 'They want:'}
                            </p>
                            <p className="text-sm text-blue-700">
                              {swap.skillOffered.skill.name} ({swap.skillOffered.skill.category})
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              {user && swap.requesterId === user.id ? 'You want:' : 'They offer:'}
                            </p>
                            <p className="text-sm text-blue-700">
                              {swap.skillWanted.skill.name} ({swap.skillWanted.skill.category})
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {swap.message && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium text-gray-900 mb-1">Message:</p>
                          <p className="text-sm text-gray-700">{swap.message}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(swap.createdAt)}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                          {swap.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2 ml-4">
                      {swap.status === 'PENDING' && user && swap.receiverId === user.id && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(swap.id, 'ACCEPTED')}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center text-sm"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(swap.id, 'REJECTED')}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center text-sm"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      
                      {swap.status === 'PENDING' && user && swap.requesterId === user.id && (
                        <button
                          onClick={() => handleStatusUpdate(swap.id, 'CANCELLED')}
                          className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 flex items-center text-sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      )}
                      
                      {swap.status === 'ACCEPTED' && user && (swap.requesterId === user.id || swap.receiverId === user.id) && (
                        <button
                          onClick={() => handleStatusUpdate(swap.id, 'COMPLETED')}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center text-sm"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}