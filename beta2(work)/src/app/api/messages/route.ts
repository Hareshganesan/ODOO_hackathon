import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { ApiResponse } from '@/types'

// Get messages for a user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const userId = decoded.id
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Get swap requests involving this user (as messages)
    const swapRequests = await prisma.swapRequest.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const total = await prisma.swapRequest.count({
      where: {
        OR: [
          { requesterId: userId },
          { receiverId: userId }
        ]
      }
    })

    const response: ApiResponse = {
      success: true,
      data: {
        messages: swapRequests,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Send a new message (create swap request)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { receiverId, skillOfferedId, skillWantedId, message } = await request.json()
    
    if (!receiverId || !skillOfferedId || !skillWantedId) {
      return NextResponse.json(
        { success: false, error: 'receiverId, skillOfferedId, and skillWantedId are required' },
        { status: 400 }
      )
    }

    // Create swap request
    const swapRequest = await prisma.swapRequest.create({
      data: {
        requesterId: decoded.id,
        receiverId,
        skillOfferedId,
        skillWantedId,
        message: message || null,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true
          }
        }
      }
    })

    const response: ApiResponse = {
      success: true,
      data: swapRequest,
      message: 'Message sent successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}