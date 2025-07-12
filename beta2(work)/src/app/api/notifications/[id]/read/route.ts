import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { ApiResponse } from '@/types'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const requestId = parseInt(params.id)
    if (isNaN(requestId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request ID' },
        { status: 400 }
      )
    }

    const { action } = await request.json()
    
    if (!['ACCEPTED', 'REJECTED'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be ACCEPTED or REJECTED' },
        { status: 400 }
      )
    }

    // Update the swap request
    const updatedRequest = await prisma.swapRequest.update({
      where: {
        id: requestId,
        receiverId: decoded.id
      },
      data: {
        status: action
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
      data: updatedRequest,
      message: `Request ${action.toLowerCase()} successfully`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Update notification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}