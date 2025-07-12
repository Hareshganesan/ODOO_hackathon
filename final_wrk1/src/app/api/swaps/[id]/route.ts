import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser, createAuthResponse } from '@/lib/middleware'
import { ApiResponse } from '@/types'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateUser(request)
  if (auth.error) {
    return createAuthResponse(auth.error, auth.status!)
  }

  try {
    const { id } = await params
    const swapRequestId = parseInt(id)

    if (isNaN(swapRequestId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid swap request ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be ACCEPTED, REJECTED, COMPLETED, or CANCELLED' },
        { status: 400 }
      )
    }

    // Find the swap request
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: swapRequestId },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!swapRequest) {
      return NextResponse.json(
        { success: false, error: 'Swap request not found' },
        { status: 404 }
      )
    }

    // Check if user is authorized to update this request
    // Only the receiver can accept/reject, only the requester can cancel
    if (status === 'ACCEPTED' || status === 'REJECTED') {
      if (swapRequest.receiverId !== auth.user.id) {
        return NextResponse.json(
          { success: false, error: 'Only the receiver can accept or reject the request' },
          { status: 403 }
        )
      }
    } else if (status === 'CANCELLED') {
      if (swapRequest.requesterId !== auth.user.id) {
        return NextResponse.json(
          { success: false, error: 'Only the requester can cancel the request' },
          { status: 403 }
        )
      }
    } else if (status === 'COMPLETED') {
      if (swapRequest.requesterId !== auth.user.id && swapRequest.receiverId !== auth.user.id) {
        return NextResponse.json(
          { success: false, error: 'Only participants can mark the request as completed' },
          { status: 403 }
        )
      }
    }

    // Check if request is in a valid state for the update
    if (swapRequest.status !== 'PENDING' && status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Can only update pending requests, or mark accepted requests as completed' },
        { status: 400 }
      )
    }

    // Update the swap request
    const updatedSwapRequest = await prisma.swapRequest.update({
      where: { id: swapRequestId },
      data: {
        status,
        updatedAt: new Date()
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
      data: updatedSwapRequest,
      message: `Swap request ${status.toLowerCase()} successfully`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Update swap request error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authenticateUser(request)
  if (auth.error) {
    return createAuthResponse(auth.error, auth.status!)
  }

  try {
    const { id } = await params
    const swapRequestId = parseInt(id)

    if (isNaN(swapRequestId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid swap request ID' },
        { status: 400 }
      )
    }

    // Find the swap request
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: swapRequestId }
    })

    if (!swapRequest) {
      return NextResponse.json(
        { success: false, error: 'Swap request not found' },
        { status: 404 }
      )
    }

    // Check if user is authorized to delete this request
    if (swapRequest.requesterId !== auth.user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the requester can delete the request' },
        { status: 403 }
      )
    }

    // Delete the swap request
    await prisma.swapRequest.delete({
      where: { id: swapRequestId }
    })

    const response: ApiResponse = {
      success: true,
      message: 'Swap request deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Delete swap request error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
