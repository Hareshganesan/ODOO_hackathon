import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { RegisterRequest, ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, name, location } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        location: location || null,
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

    // Generate token
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    })

    const response: ApiResponse = {
      success: true,
      data: { user, token },
      message: 'User registered successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
