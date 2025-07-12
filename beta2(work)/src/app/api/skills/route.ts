import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const category = searchParams.get('category') || ''

  try {
    const whereClause: any = {}

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { description: { contains: query } }
      ]
    }

    if (category) {
      whereClause.category = { contains: category }
    }

    const skills = await prisma.skill.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc'
      }
    })

    const response: ApiResponse = {
      success: true,
      data: skills
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get skills error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, description } = body

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Check if skill already exists
    const existingSkill = await prisma.skill.findUnique({
      where: { name }
    })

    if (existingSkill) {
      return NextResponse.json(
        { success: false, error: 'Skill already exists' },
        { status: 409 }
      )
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        description
      }
    })

    const response: ApiResponse = {
      success: true,
      data: skill,
      message: 'Skill created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Create skill error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
