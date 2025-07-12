import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser, createAuthResponse } from '@/lib/middleware'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  const auth = authenticateUser(request)
  if (auth.error) {
    return createAuthResponse(auth.error, auth.status!)
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        profilePhoto: true,
        isPublic: true,
        createdAt: true,
        userSkills: {
          include: {
            skill: {
              select: {
                id: true,
                name: true,
                category: true,
                description: true
              }
            }
          }
        },
        _count: {
          select: {
            receivedRatings: true,
            sentRequests: true,
            receivedRequests: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const response: ApiResponse = {
      success: true,
      data: user
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
