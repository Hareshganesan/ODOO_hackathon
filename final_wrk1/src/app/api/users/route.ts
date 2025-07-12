import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser, createAuthResponse } from '@/lib/middleware'
import { ApiResponse, SearchFilters, PaginatedResponse, UserWithSkills } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const category = searchParams.get('category') || ''
  const skillType = searchParams.get('skillType') as 'OFFERED' | 'WANTED' | null
  const location = searchParams.get('location') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      isActive: true,
      isPublic: true,
    }

    if (location) {
      whereClause.location = {
        contains: location
      }
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { email: { contains: query } },
        {
          userSkills: {
            some: {
              skill: {
                name: { contains: query }
              }
            }
          }
        }
      ]
    }

    if (category && skillType) {
      whereClause.userSkills = {
        some: {
          type: skillType,
          skill: {
            category: { contains: category }
          }
        }
      }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where: whereClause })
    ])

    const response: ApiResponse<PaginatedResponse<UserWithSkills>> = {
      success: true,
      data: {
        data: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
