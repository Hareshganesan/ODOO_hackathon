import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function authenticateUser(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return { error: 'No token provided', status: 401 }
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return { error: 'Invalid token', status: 401 }
  }

  return { user: decoded, error: null }
}

export function createAuthResponse(error: string, status: number) {
  return NextResponse.json(
    { success: false, error },
    { status }
  )
}
