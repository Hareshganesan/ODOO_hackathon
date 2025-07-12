// User types
export interface User {
  id: number
  email: string
  name: string | null
  location: string | null
  profilePhoto: string | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface UserWithSkills extends User {
  userSkills: UserSkillWithSkill[]
  availability: Availability[]
  _count?: {
    givenRatings: number
    receivedRatings: number
  }
}

// Skill types
export interface Skill {
  id: number
  name: string
  category: string
  description: string | null
  createdAt: Date
}

export interface UserSkill {
  id: number
  userId: number
  skillId: number
  type: 'OFFERED' | 'WANTED'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
}

export interface UserSkillWithSkill extends UserSkill {
  skill: Skill
}

// Swap Request types
export interface SwapRequest {
  id: number
  requesterId: number
  receiverId: number
  skillOfferedId: number
  skillWantedId: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
  message: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SwapRequestWithDetails extends SwapRequest {
  requester: User
  receiver: User
  ratings: Rating[]
}

// Rating types
export interface Rating {
  id: number
  swapRequestId: number
  raterId: number
  ratedId: number
  rating: number
  feedback: string | null
  createdAt: Date
}

export interface RatingWithUsers extends Rating {
  rater: User
  rated: User
}

// Availability types
export interface Availability {
  id: number
  userId: number
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime: string
  endTime: string
}

// Auth types
export interface AuthUser {
  id: number
  email: string
  name: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  location?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Search and filter types
export interface SearchFilters {
  query?: string
  category?: string
  skillType?: 'OFFERED' | 'WANTED'
  location?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
