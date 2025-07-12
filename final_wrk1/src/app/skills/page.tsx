'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Book, Star } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Skill {
  id: number
  name: string
  category: string
  description: string | null
}

interface UserSkill {
  id: number
  skillId: number
  type: 'OFFERED' | 'WANTED'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  skill: Skill
}

export default function SkillsManagementPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [userSkills, setUserSkills] = useState<UserSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    description: '',
  })
  const router = useRouter()
  const { user: currentUser, isAuthenticated, isLoading } = useAuth()

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
    'Education',
    'Health',
    'Media',
    'Communication',
    'Life Skills'
  ]

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    } else if (!isLoading && isAuthenticated) {
      fetchSkills()
      fetchUserSkills()
    }
  }, [isAuthenticated, isLoading, router])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      const data = await response.json()
      if (data.success) {
        setSkills(data.data)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  const fetchUserSkills = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users/skills', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setUserSkills(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching user skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSkill),
      })

      const data = await response.json()
      if (data.success) {
        setSkills([...skills, data.data])
        setNewSkill({ name: '', category: '', description: '' })
        setShowAddSkill(false)
      }
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  const handleAddUserSkill = async (skillId: number, type: 'OFFERED' | 'WANTED') => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please log in to add skills to your profile')
        return
      }

      const response = await fetch('/api/users/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          skillId,
          type,
          level: 'BEGINNER' // Default level
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Refresh user skills
        fetchUserSkills()
        alert(`Skill added to your ${type.toLowerCase()} skills!`)
      } else {
        alert(data.message || 'Failed to add skill to profile')
      }
    } catch (error) {
      console.error('Error adding skill to profile:', error)
      alert('Error adding skill to profile')
    }
  }

  const handleRemoveUserSkill = async (userSkillId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please log in to remove skills from your profile')
        return
      }

      const response = await fetch(`/api/users/skills?id=${userSkillId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        // Refresh user skills
        fetchUserSkills()
        alert('Skill removed from your profile!')
      } else {
        alert(data.message || 'Failed to remove skill from profile')
      }
    } catch (error) {
      console.error('Error removing skill from profile:', error)
      alert('Error removing skill from profile')
    }
  }

  const getOfferedSkills = () => {
    return userSkills.filter(us => us.type === 'OFFERED')
  }

  const getWantedSkills = () => {
    return userSkills.filter(us => us.type === 'WANTED')
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
              <p className="mt-2 text-gray-600">
                Manage your skills and browse available skills in the platform.
              </p>
            </div>
            <button
              onClick={() => setShowAddSkill(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Skill
            </button>
          </div>
        </div>

        {/* Add Skill Modal */}
        {showAddSkill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Skill</h2>
                <button
                  onClick={() => setShowAddSkill(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="Enter skill name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    rows={3}
                    placeholder="Enter skill description"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddSkill(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Skill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Skills */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Skills</h2>
              
              {/* Offered Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Star className="h-5 w-5 text-green-500 mr-2" />
                  Skills You Offer
                </h3>
                <div className="space-y-2">
                  {getOfferedSkills().map(userSkill => (
                    <div key={userSkill.id} className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                      <div>
                        <span className="font-medium text-gray-900">{userSkill.skill.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({userSkill.skill.category})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(userSkill.level)}`}>
                          {userSkill.level}
                        </span>
                        <button
                          onClick={() => handleRemoveUserSkill(userSkill.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {getOfferedSkills().length === 0 && (
                    <p className="text-gray-500 text-sm">No skills offered yet.</p>
                  )}
                </div>
              </div>

              {/* Wanted Skills */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Book className="h-5 w-5 text-blue-500 mr-2" />
                  Skills You Want to Learn
                </h3>
                <div className="space-y-2">
                  {getWantedSkills().map(userSkill => (
                    <div key={userSkill.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                      <div>
                        <span className="font-medium text-gray-900">{userSkill.skill.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({userSkill.skill.category})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(userSkill.level)}`}>
                          {userSkill.level}
                        </span>
                        <button
                          onClick={() => handleRemoveUserSkill(userSkill.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {getWantedSkills().length === 0 && (
                    <p className="text-gray-500 text-sm">No skills wanted yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Available Skills */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Available Skills</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {skills.map(skill => (
                  <div key={skill.id} className="p-3 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{skill.name}</h4>
                        <p className="text-sm text-gray-500">{skill.category}</p>
                        {skill.description && (
                          <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleAddUserSkill(skill.id, 'OFFERED')}
                          className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                        >
                          Offer
                        </button>
                        <button
                          onClick={() => handleAddUserSkill(skill.id, 'WANTED')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Want
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
