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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'sent' or 'received'
    const status = searchParams.get('status') as any

    let whereClause: any = {}

    if (type === 'sent') {
      whereClause.requesterId = auth.user.id
    } else if (type === 'received') {
      whereClause.receiverId = auth.user.id
    } else {
      whereClause.OR = [
        { requesterId: auth.user.id },
        { receiverId: auth.user.id }
      ]
    }

    if (status) {
      whereClause.status = status
    }

    const swapRequests = await prisma.swapRequest.findMany({
      where: whereClause,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            location: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            location: true
          }
        },
        ratings: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const response: ApiResponse = {
      success: true,
      data: swapRequests
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get swap requests error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = authenticateUser(request)
  if (auth.error) {
    return createAuthResponse(auth.error, auth.status!)
  }

  try {
    const body = await request.json()
    const { receiverId, skillOfferedId, skillWantedId, message } = body

    if (!receiverId || !skillOfferedId || !skillWantedId) {
      return NextResponse.json(
        { success: false, error: 'Receiver ID, skill offered ID, and skill wanted ID are required' },
        { status: 400 }
      )
    }

    if (receiverId === auth.user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot send swap request to yourself' },
        { status: 400 }
      )
    }

    // Check if receiver exists and is active
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver || !receiver.isActive) {
      return NextResponse.json(
        { success: false, error: 'Receiver not found or inactive' },
        { status: 404 }
      )
    }

    // Check if there's already a pending request
    const existingRequest = await prisma.swapRequest.findFirst({
      where: {
        requesterId: auth.user.id,
        receiverId,
        status: 'PENDING'
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: 'You already have a pending request to this user' },
        { status: 409 }
      )
    }

    const swapRequest = await prisma.swapRequest.create({
      data: {
        requesterId: auth.user.id,
        receiverId,
        skillOfferedId,
        skillWantedId,
        message
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            location: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            location: true
          }
        }
      }
    })

    const response: ApiResponse = {
      success: true,
      data: swapRequest,
      message: 'Swap request sent successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Create swap request error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
