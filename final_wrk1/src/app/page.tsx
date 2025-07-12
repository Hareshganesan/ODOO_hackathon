'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Star, Clock, Users, ArrowRight, MessageSquare, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface User {
  id: number
  name: string
  location: string
  profilePhoto?: string
  userSkills: Array<{
    id: number
    skill: {
      id: number
      name: string
      category: string
    }
    type: 'OFFERED' | 'WANTED'
    level: string
  }>
  _count: {
    receivedRatings: number
  }
}

interface SwapRequestData {
  receiverId: number
  skillOfferedId: number
  skillWantedId: number
  message: string
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentUserSkills, setCurrentUserSkills] = useState<User['userSkills']>([])
  const [swapRequest, setSwapRequest] = useState<SwapRequestData>({
    receiverId: 0,
    skillOfferedId: 0,
    skillWantedId: 0,
    message: ''
  })
  
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth()

  const categories = [
    'Technology',
    'Design',
    'Marketing',
    'Music',
    'Language',
    'Cooking',
    'Sports',
    'Art',
    'Business',
    'Education'
  ]

  useEffect(() => {
    fetchUsers()
    // Fetch current user skills if logged in
    if (isAuthenticated && currentUser) {
      fetchCurrentUserSkills()
    }
  }, [isAuthenticated, currentUser])

  const fetchCurrentUserSkills = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users/skills', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setCurrentUserSkills(data.data)
      }
    } catch (error) {
      console.error('Error fetching current user skills:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.data.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('query', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)
      
      const response = await fetch(`/api/users?${params}`)
      const data = await response.json()
      if (data.success) {
        setUsers(data.data.data)
      }
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwapRequest = (user: User) => {
    if (!isAuthenticated) {
      alert('Please login to send swap requests')
      return
    }
    setSelectedUser(user)
    setSwapRequest({
      receiverId: user.id,
      skillOfferedId: 0,
      skillWantedId: 0,
      message: ''
    })
    setShowSwapModal(true)
  }

  const submitSwapRequest = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to send swap requests')
        return
      }

      if (!swapRequest.skillOfferedId || !swapRequest.skillWantedId) {
        alert('Please select both skills for the swap')
        return
      }

      const response = await fetch('/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(swapRequest)
      })

      const data = await response.json()
      if (data.success) {
        alert('Swap request sent successfully!')
        setShowSwapModal(false)
        setSelectedUser(null)
        setSwapRequest({
          receiverId: 0,
          skillOfferedId: 0,
          skillWantedId: 0,
          message: ''
        })
      } else {
        alert(data.error || 'Failed to send swap request')
      }
    } catch (error) {
      console.error('Error sending swap request:', error)
      alert('Error sending swap request')
    }
  }

  const getOfferedSkills = (user: User) => {
    return user.userSkills.filter(us => us.type === 'OFFERED').map(us => us.skill.name)
  }

  const getWantedSkills = (user: User) => {
    return user.userSkills.filter(us => us.type === 'WANTED').map(us => us.skill.name)
  }

  const getCurrentUserOfferedSkills = () => {
    return currentUserSkills.filter(us => us.type === 'OFFERED')
  }

  const getSelectedUserWantedSkills = () => {
    return selectedUser?.userSkills.filter(us => us.type === 'WANTED') || []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Skill Swap Platform</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link href="/skills" className="text-gray-700 hover:text-gray-900">
                    Skills
                  </Link>
                  <Link href="/swaps" className="text-gray-700 hover:text-gray-900">
                    Swaps
                  </Link>
                  <span className="text-gray-700">Welcome, {currentUser?.name}!</span>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-gray-900">
                    Login
                  </Link>
                  <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Share Your Skills, Learn Something New
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connect with people in your community to exchange skills and knowledge.
              Teach what you know, learn what you want.
            </p>
            
            {/* Search Section */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Users Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Connect with Skill Sharers
          </h3>
          <p className="text-gray-600">
            Browse profiles and find people who can teach you new skills or learn from you.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {user.location || 'Location not specified'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Skills Offered</h5>
                      <div className="flex flex-wrap gap-1">
                        {getOfferedSkills(user).slice(0, 3).map(skill => (
                          <span key={skill} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {getOfferedSkills(user).length > 3 && (
                          <span className="text-xs text-gray-500">+{getOfferedSkills(user).length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Skills Wanted</h5>
                      <div className="flex flex-wrap gap-1">
                        {getWantedSkills(user).slice(0, 3).map(skill => (
                          <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {getWantedSkills(user).length > 3 && (
                          <span className="text-xs text-gray-500">+{getWantedSkills(user).length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                        <span>{user._count.receivedRatings} reviews</span>
                      </div>
                      <div className="flex space-x-2">
                        {isAuthenticated && (
                          <button
                            onClick={() => handleSwapRequest(user)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center text-sm"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Request Swap
                          </button>
                        )}
                        <Link
                          href={`/profile/${user.id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center text-sm"
                        >
                          View Profile
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
          </div>
        )}
      </section>

      {/* Swap Request Modal */}
      {showSwapModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Request Skill Swap</h2>
              <button
                onClick={() => setShowSwapModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Sending request to: <span className="font-medium">{selectedUser.name}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill you want to offer:
                </label>
                <select
                  value={swapRequest.skillOfferedId}
                  onChange={(e) => setSwapRequest({...swapRequest, skillOfferedId: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value={0}>Select a skill you offer</option>
                  {getCurrentUserOfferedSkills().map(userSkill => (
                    <option key={userSkill.id} value={userSkill.id}>
                      {userSkill.skill.name} ({userSkill.skill.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill you want to learn:
                </label>
                <select
                  value={swapRequest.skillWantedId}
                  onChange={(e) => setSwapRequest({...swapRequest, skillWantedId: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value={0}>Select a skill you want to learn</option>
                  {getSelectedUserWantedSkills().map(userSkill => (
                    <option key={userSkill.id} value={userSkill.id}>
                      {userSkill.skill.name} ({userSkill.skill.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optional):
                </label>
                <textarea
                  value={swapRequest.message}
                  onChange={(e) => setSwapRequest({...swapRequest, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  rows={3}
                  placeholder="Add a personal message..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSwapModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitSwapRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
