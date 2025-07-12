# Skill Swap Platform

A full-stack web application that enables users to exchange skills and knowledge within their community. Built with Next.js 15, TypeScript, MySQL, and modern web technologies.

## Features

### User Authentication
- Email/password registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Secure session management

### User Profiles
- Complete profile creation with personal information
- Profile photo upload capability
- Public/private visibility settings
- Location-based user discovery

### Skills Management
- Add skills you can offer to others
- List skills you want to learn
- Categorize skills by type (Technology, Design, etc.)
- Skill level indicators (Beginner, Intermediate, Advanced, Expert)

### Skill Matching & Search
- Browse and search users by skills
- Filter by location, category, and skill type
- Advanced search functionality
- Smart matching algorithm

### Swap Request System
- Send skill exchange requests to other users
- Accept or reject incoming requests
- Message system for communication
- Request status tracking (Pending, Accepted, Rejected, Completed)

### Rating & Feedback
- Rate completed skill exchanges
- Leave feedback for other users
- View ratings and reviews
- Build reputation within the community

### Availability Management
- Set your availability schedule
- View when others are available
- Time zone support
- Calendar integration

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **React Hooks** - State management and side effects

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Additional Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skill-swap-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL="mysql://username:password@localhost:3306/skill_swap_platform"
   
   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"
   
   # JWT Configuration
   JWT_SECRET="your-jwt-secret-here"
   
   # File Upload Configuration
   UPLOAD_DIR="public/uploads"
   MAX_FILE_SIZE=5000000
   ```

4. **Set up the database**
   ```bash
   # Create the database
   mysql -u root -p
   CREATE DATABASE skill_swap_platform;
   
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Database Schema

The application uses the following database tables:
- **Users** - User profiles with authentication
- **Skills** - Categorized list of available skills
- **UserSkills** - Junction table linking users to skills
- **SwapRequests** - Skill exchange requests between users
- **Ratings** - User ratings and feedback system
- **Availability** - User availability schedules

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (with search/filter)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user profile

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill

### Swap Requests
- `GET /api/swaps` - Get swap requests
- `POST /api/swaps` - Create swap request

## Project Structure

```
skill-swap-platform/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   └── page.tsx        # Home page
│   ├── lib/               # Utility functions and configurations
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── middleware.ts  # API middleware
│   │   └── prisma.ts      # Database client
│   └── types/             # TypeScript type definitions
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Development

### Building for Production
```bash
npm run build
```

### Database Operations
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Input validation and sanitization
- SQL injection prevention with Prisma
- CORS configuration for API security

## License

This project is licensed under the MIT License.
