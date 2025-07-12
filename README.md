# Skill Swap Platform

A full-stack web application that empowers users to exchange skills and knowledge within their community. Built using **Next.js 15**, **TypeScript**, **MySQL**, and other modern web technologies.

---

## Features

### User Authentication
- Email and password-based registration/login
- JSON Web Token (JWT) authentication
- Secure password hashing with bcrypt
- Session security best practices

###  User Profiles
- Create detailed personal profiles
- Upload a profile photo
- Control public/private profile visibility
- Discover users nearby using location

###  Skills Management
- Add skills you can teach
- Add skills you want to learn
- Group skills into categories (e.g., Technology, Design)
- Indicate proficiency (Beginner, Intermediate, Advanced, Expert)

###  Skill Matching & Search
- Search users by specific skills
- Filter results by category, location, and skill level
- Intelligent matching recommendations

###  Swap Request System
- Send and receive skill exchange requests
- Accept or reject requests
- Built-in chat for communication
- Track request statuses (Pending, Accepted, Rejected, Completed)

###  Ratings & Feedback
- Rate your skill exchange experience
- Leave written feedback
- Build a trustworthy reputation over time

###  Availability Management
- Set your availability schedule
- View others' availability
- Time zone support
- Optional calendar integration

---

## Technology Stack

### Frontend
- **Next.js 15** – App Router based framework
- **TypeScript** – Type-safe development
- **Tailwind CSS** – Utility-first styling
- **React Hooks** – Efficient state and side effect handling

### Backend
- **Next.js API Routes** – Serverless backend endpoints
- **Prisma ORM** – Type-safe database access
- **MySQL** – Relational database
- **bcryptjs** – Password hashing
- **JWT** – Secure authentication

### Developer Tools
- **ESLint** – Code linting
- **Prettier** – Code formatting
- **Prisma Studio** – Visual DB interface

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd skill-swap-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root:
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/skill_swap_platform"

   # Auth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"

   # JWT
   JWT_SECRET="your-jwt-secret"

   # File Uploads
   UPLOAD_DIR="public/uploads"
   MAX_FILE_SIZE=5000000
   ```

4. **Set Up Database**
   ```bash
   # Create database manually (or in MySQL client)
   mysql -u root -p
   CREATE DATABASE skill_swap_platform;

   # Generate and apply Prisma schema
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

6. **Visit in Browser**
   ```
   http://localhost:3000
   ```

---

## Database Schema Overview

The following tables are used:

- **Users** – Stores user profile and credentials
- **Skills** – List of all skill types
- **UserSkills** – Maps users to skills (can teach / want to learn)
- **SwapRequests** – Handles skill exchange transactions
- **Ratings** – User ratings and feedback
- **Availability** – Schedules for user availability

---

## API Endpoints

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user

### Users
- `GET /api/users` – Get list of users
- `GET /api/users/[id]` – Get specific user
- `PUT /api/users/[id]` – Update user profile

### Skills
- `GET /api/skills` – List all skills
- `POST /api/skills` – Add a new skill

### Swap Requests
- `GET /api/swaps` – Fetch all swap requests
- `POST /api/swaps` – Send a swap request

---

## Project Structure

```
skill-swap-platform/
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── login/         # Login page
│   │   ├── register/      # Register page
│   │   └── page.tsx       # Home page
│   ├── lib/               # Helper functions
│   │   ├── auth.ts        # Auth utilities
│   │   ├── middleware.ts  # Custom middleware
│   │   └── prisma.ts      # Prisma client
│   └── types/             # Type definitions
├── prisma/
│   └── schema.prisma      # DB schema
├── public/                # Static assets
├── .env                   # Environment config
├── package.json           # Dependencies
└── README.md              # This file
```

---

## Development Tips

### Build for Production
```bash
npm run build
```

### Database Operations
```bash
# Launch Prisma Studio
npx prisma studio

# Reset the database
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

---

## Security Considerations

- Passwords are hashed with bcrypt
- JWT used for session authentication
- Prisma prevents SQL injection by default
- Input validation and sanitation included
- CORS configured for secure API access

---

## License

This project is licensed under the MIT License.
