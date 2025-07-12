import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: number }
    const userId = decoded.userId

    const { skillId, type, level } = await request.json()

    if (!skillId || !type || !level) {
      return NextResponse.json(
        { success: false, message: 'skillId, type, and level are required' },
        { status: 400 }
      )
    }

    if (!['OFFERED', 'WANTED'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'type must be OFFERED or WANTED' },
        { status: 400 }
      )
    }

    if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].includes(level)) {
      return NextResponse.json(
        { success: false, message: 'level must be BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT' },
        { status: 400 }
      )
    }

    // Check if the user already has this skill with the same type
    const existingUserSkill = await prisma.userSkill.findFirst({
      where: {
        userId,
        skillId,
        type
      }
    })

    if (existingUserSkill) {
      return NextResponse.json(
        { success: false, message: 'You already have this skill in your profile' },
        { status: 400 }
      )
    }

    // Create the user skill
    const userSkill = await prisma.userSkill.create({
      data: {
        userId,
        skillId,
        type,
        level
      },
      include: {
        skill: true
      }
    })

    return NextResponse.json({
      success: true,
      data: userSkill
    })

  } catch (error) {
    console.error('Error adding user skill:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: number }
    const userId = decoded.userId

    const userSkills = await prisma.userSkill.findMany({
      where: {
        userId
      },
      include: {
        skill: true
      }
    })

    return NextResponse.json({
      success: true,
      data: userSkills
    })

  } catch (error) {
    console.error('Error fetching user skills:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: number }
    const userId = decoded.userId

    const { searchParams } = new URL(request.url)
    const userSkillId = searchParams.get('id')

    if (!userSkillId) {
      return NextResponse.json(
        { success: false, message: 'User skill ID is required' },
        { status: 400 }
      )
    }

    // Check if the user skill belongs to the current user
    const userSkill = await prisma.userSkill.findFirst({
      where: {
        id: parseInt(userSkillId),
        userId
      }
    })

    if (!userSkill) {
      return NextResponse.json(
        { success: false, message: 'User skill not found or not authorized' },
        { status: 404 }
      )
    }

    await prisma.userSkill.delete({
      where: {
        id: parseInt(userSkillId)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'User skill deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting user skill:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
