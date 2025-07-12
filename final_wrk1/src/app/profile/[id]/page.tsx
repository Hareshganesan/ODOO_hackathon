'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, Send, User, Calendar, MessageSquare } from 'lucide-react'

interface UserProfile {
  id: number
  name: string
  email: string
  location: string | null
  profilePhoto: string | null
  isPublic: boolean
  createdAt: string
  userSkills: Array<{
    id: number
    type: 'OFFERED' | 'WANTED'
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
    skill: {
      id: number
      name: string
      category: string
      description: string | null
    }
  }>
  availability: Array<{
    id: number
    dayOfWeek: string
    startTime: string
    endTime: string
  }>
  _count: {
    givenRatings: number
    receivedRatings: number
  }
}

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageData, setMessageData] = useState({
    skillOfferedId: '',
    skillWantedId: '',
    message: ''
  })
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setCurrentUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }

    fetchProfile()
  }, [resolvedParams.id])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${resolvedParams.id}`)
      const data = await response.json()
      
      if (data.success) {
        setProfile(data.data)
      } else {
        setError(data.error || 'Failed to load profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      router.push('/login')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: profile?.id,
          skillOfferedId: parseInt(messageData.skillOfferedId),
          skillWantedId: parseInt(messageData.skillWantedId),
          message: messageData.message
        }),
      })

      const data = await response.json()
      if (data.success) {
        setShowMessageModal(false)
        setMessageData({ skillOfferedId: '', skillWantedId: '', message: '' })
        alert('Message sent successfully!')
      } else {
        alert(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const getOfferedSkills = () => {
    return profile?.userSkills.filter(us => us.type === 'OFFERED') || []
  }

  const getWantedSkills = () => {
    return profile?.userSkills.filter(us => us.type === 'WANTED') || []
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This user profile could not be found.'}</p>
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
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
            {currentUser && (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Browse
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {profile.name?.charAt(0) || 'U'}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                {profile.location && (
                  <div className="flex items-center justify-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Member since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(profile.createdAt)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total ratings</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {profile._count.receivedRatings}
                    </span>
                  </div>
                </div>
              </div>

              {currentUser && currentUser.id !== profile.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Send Skill Swap Request
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills & Availability */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Offered */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills Offered</h2>
              {getOfferedSkills().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getOfferedSkills().map(userSkill => (
                    <div key={userSkill.id} className="p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{userSkill.skill.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(userSkill.level)}`}>
                          {userSkill.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{userSkill.skill.category}</p>
                      {userSkill.skill.description && (
                        <p className="text-sm text-gray-700 mt-2">{userSkill.skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills offered yet.</p>
              )}
            </div>

            {/* Skills Wanted */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills Wanted</h2>
              {getWantedSkills().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getWantedSkills().map(userSkill => (
                    <div key={userSkill.id} className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{userSkill.skill.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(userSkill.level)}`}>
                          {userSkill.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{userSkill.skill.category}</p>
                      {userSkill.skill.description && (
                        <p className="text-sm text-gray-700 mt-2">{userSkill.skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills wanted yet.</p>
              )}
            </div>

            {/* Availability */}
            {profile.availability.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Availability</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.availability.map(avail => (
                    <div key={avail.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-900">
                          {avail.dayOfWeek.charAt(0) + avail.dayOfWeek.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {avail.startTime} - {avail.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Send Skill Swap Request</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill you're offering
                </label>
                <select
                  required
                  value={messageData.skillOfferedId}
                  onChange={(e) => setMessageData({ ...messageData, skillOfferedId: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a skill</option>
                  {getOfferedSkills().map(us => (
                    <option key={us.skill.id} value={us.skill.id}>
                      {us.skill.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill you want to learn
                </label>
                <select
                  required
                  value={messageData.skillWantedId}
                  onChange={(e) => setMessageData({ ...messageData, skillWantedId: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a skill</option>
                  {getWantedSkills().map(us => (
                    <option key={us.skill.id} value={us.skill.id}>
                      {us.skill.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={messageData.message}
                  onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Introduce yourself and explain your skill swap proposal..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
