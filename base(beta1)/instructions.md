

## Project Overview
This is a full-stack Skill Swap Platform built with:
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and React
- **Backend**: Next.js API routes with Express-like functionality
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT tokens

## Key Features
- User registration and authentication (email/password)
- User profiles with skills offered/wanted and availability
- Public/private profile visibility settings
- Browse and search users by skills
- Skill swap request system with accept/reject functionality
- Rating and feedback system after completed swaps
- Admin panel for content moderation
- Responsive design matching the provided mockup

## Development Guidelines
1. Use TypeScript for all code
2. Follow Next.js 15 App Router conventions
3. Use Tailwind CSS for styling with responsive design
4. Implement proper error handling and validation
5. Use Prisma for database operations
6. Follow REST API conventions for API routes
7. Implement proper authentication middleware
8. Use proper TypeScript interfaces for data structures
9. Ensure mobile-responsive design
10. Follow security best practices for user data and authentication

## Database Schema
- Users (id, email, password, name, location, profile_photo, is_public, created_at, updated_at)
- Skills (id, name, category, description)
- UserSkills (user_id, skill_id, type: 'offered'|'wanted', level)
- SwapRequests (id, requester_id, receiver_id, skill_offered_id, skill_wanted_id, status, message, created_at)
- Ratings (id, swap_request_id, rater_id, rated_id, rating, feedback, created_at)
- Availability (id, user_id, day_of_week, start_time, end_time)

## API Endpoints Structure
- /api/auth/* - Authentication routes
- /api/users/* - User management
- /api/skills/* - Skills management
- /api/swaps/* - Swap requests
- /api/ratings/* - Rating system
- /api/admin/* - Admin functions


