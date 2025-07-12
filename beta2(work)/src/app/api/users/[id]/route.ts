import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser, createAuthResponse } from '@/lib/middleware'
import { ApiResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSkills: {
          include: {
            skill: true
          }
        },
        availability: true,
        _count: {
          select: {
            givenRatings: true,
            receivedRatings: true
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

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'User account is deactivated' },
        { status: 404 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    const response: ApiResponse = {
      success: true,
      data: userWithoutPassword
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authenticateUser(request)
  if (auth.error) {
    return createAuthResponse(auth.error, auth.status!)
  }

  try {
    const userId = parseInt(params.id)
    const body = await request.json()
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Check if user can update this profile
    if (auth.user.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to update this profile' },
        { status: 403 }
      )
    }

    const { name, location, isPublic } = body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        location,
        isPublic
      },
      select: {
        id: true,
        email: true,
        name: true,
        location: true,
        profilePhoto: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
      }
    })

    const response: ApiResponse = {
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
