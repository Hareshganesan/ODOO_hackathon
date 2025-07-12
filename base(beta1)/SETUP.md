# Skill Swap Platform - Setup Instructions

## Quick Start Guide

### 1. Prerequisites
- Node.js 18.0 or higher
- MySQL 8.0 or higher
- Git

### 2. Database Setup

#### Option A: Local MySQL
1. Install MySQL locally
2. Create a new database:
   ```sql
   CREATE DATABASE skill_swap_platform;
   ```

#### Option B: Cloud MySQL (Recommended)
- Use services like PlanetScale, AWS RDS, or Google Cloud SQL
- Create a new MySQL database instance

### 3. Environment Configuration

Update the `.env` file with your database credentials:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/skill_swap_platform"

# Authentication Secrets (Change these in production!)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
JWT_SECRET="your-jwt-secret-change-this-in-production"

# File Upload Configuration
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE=5000000
```

### 4. Database Migration

Run the following commands to set up the database schema:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npm run db:seed
```

### 5. Start the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Sample Login Credentials

After running the seed script, you can use these test accounts:

- **Email:** john.doe@example.com | **Password:** password123
- **Email:** jane.smith@example.com | **Password:** password123
- **Email:** mike.johnson@example.com | **Password:** password123
- **Email:** sarah.wilson@example.com | **Password:** password123
- **Email:** david.brown@example.com | **Password:** password123

## Application Features

### 1. User Registration & Authentication
- Create new accounts with email/password
- Secure login with JWT tokens
- Password hashing with bcrypt

### 2. Profile Management
- Complete user profiles with skills and availability
- Public/private profile settings
- Location-based user discovery

### 3. Skill Exchange System
- Browse users by skills offered/wanted
- Send and receive skill swap requests
- Track request status and communications

### 4. Search & Discovery
- Search users by name, skills, or location
- Filter by skill categories
- Advanced search options

### 5. Responsive Design
- Mobile-friendly interface
- Modern UI with Tailwind CSS
- Accessible components

## File Structure

```
skill-swap-platform/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # User dashboard
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   └── page.tsx       # Home page
│   ├── lib/
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── middleware.ts  # API middleware
│   │   └── prisma.ts      # Database client
│   └── types/
│       └── index.ts       # Type definitions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js           # Sample data
├── .env                   # Environment variables
└── package.json          # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - List users with search/filter
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile

### Skills
- `GET /api/skills` - List all skills
- `POST /api/skills` - Create new skill

### Swap Requests
- `GET /api/swaps` - Get swap requests
- `POST /api/swaps` - Create swap request

## Development Tools

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name description
```

### Code Quality
```bash
# Run linting
npm run lint

# Build for production
npm run build
```

## Common Issues & Solutions

### Database Connection Issues
1. Verify MySQL is running
2. Check database credentials in `.env`
3. Ensure database exists
4. Verify network connectivity

### Build Issues
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Next.js cache: `rm -rf .next`
4. Run `npm run build`

### Missing Dependencies
```bash
# Install missing packages
npm install

# Update packages
npm update
```

## Production Deployment

### Environment Variables
Set these in your production environment:
- `DATABASE_URL` - Production database connection
- `NEXTAUTH_SECRET` - Strong secret for authentication
- `JWT_SECRET` - Strong secret for JWT tokens
- `NEXTAUTH_URL` - Your production domain

### Database Migration
```bash
# Deploy migrations to production
npx prisma migrate deploy

# Generate production client
npx prisma generate
```

### Build and Start
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Security Considerations

1. **Change default secrets** in production
2. **Use strong database passwords**
3. **Enable HTTPS** in production
4. **Implement rate limiting** for API endpoints
5. **Validate all user inputs**
6. **Use environment variables** for sensitive data
7. **Regular security updates** for dependencies

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the application logs
3. Check database connectivity
4. Verify environment variables

The application follows modern web development best practices and should be straightforward to set up and run.
