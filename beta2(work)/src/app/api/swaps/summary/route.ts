import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { ApiResponse } from '@/types'

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

    // Get counts for different swap request statuses
    const [
      totalSent,
      totalReceived,
      pendingSent,
      pendingReceived,
      acceptedSent,
      acceptedReceived,
      completedSent,
      completedReceived
    ] = await Promise.all([
      prisma.swapRequest.count({
        where: { requesterId: userId }
      }),
      prisma.swapRequest.count({
        where: { receiverId: userId }
      }),
      prisma.swapRequest.count({
        where: { requesterId: userId, status: 'PENDING' }
      }),
      prisma.swapRequest.count({
        where: { receiverId: userId, status: 'PENDING' }
      }),
      prisma.swapRequest.count({
        where: { requesterId: userId, status: 'ACCEPTED' }
      }),
      prisma.swapRequest.count({
        where: { receiverId: userId, status: 'ACCEPTED' }
      }),
      prisma.swapRequest.count({
        where: { requesterId: userId, status: 'COMPLETED' }
      }),
      prisma.swapRequest.count({
        where: { receiverId: userId, status: 'COMPLETED' }
      })
    ])

    const summary = {
      sent: {
        total: totalSent,
        pending: pendingSent,
        accepted: acceptedSent,
        completed: completedSent
      },
      received: {
        total: totalReceived,
        pending: pendingReceived,
        accepted: acceptedReceived,
        completed: completedReceived
      },
      overall: {
        total: totalSent + totalReceived,
        pending: pendingSent + pendingReceived,
        accepted: acceptedSent + acceptedReceived,
        completed: completedSent + completedReceived
      }
    }

    const response: ApiResponse = {
      success: true,
      data: summary
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get swaps summary error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}