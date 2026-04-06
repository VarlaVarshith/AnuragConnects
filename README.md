# Alumni Association Platform - MERN Stack

A comprehensive Alumni Association Platform built with MongoDB, Express.js, React.js, and Node.js featuring authentication, networking, job portal, and AI-powered connection suggestions.

## Features

### Phase 1 (Core Features)
- **Authentication & Registration**
  - Roll number validation against preloaded students database
  - OTP verification via personal email
  - JWT-based authentication
- **Profile Management**
  - Complete alumni profiles with education and work details
- **Alumni Directory**
  - Searchable directory with filters (department, year, city, company)
- **News & Updates**
  - Admin-managed announcements and news
- **Events Management**
  - Event creation, registration, and management
- **Basic Networking**
  - Connection requests and management

### Phase 2 (Advanced Features)
- **AI-Powered Connection Suggestions**
  - Smart recommendations based on department, graduation year, city, and industry
  - Similarity matching algorithm
- **Job Portal**
  - Job posting and application system
  - Resume upload and application tracking
  - Job filtering and search

## Tech Stack

- **Frontend**: React.js with custom CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Email**: Nodemailer for OTP verification

## Project Structure

```
alumni-platform/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── config/          # Email configuration
│   ├── seed.js          # Database seeding script
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
│   └── public/
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gmail account for SMTP (or other email service)

### Installation

1. **Clone and install dependencies**
   ```bash
   npm run install-all
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/alumni_platform
   JWT_SECRET=your_jwt_secret_key_here
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password_here
   PORT=5000
   ```

3. **Database Setup**
   ```bash
   # Seed the database with sample students
   npm run seed
   ```

4. **Start the Application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Or start backend only
   npm run server
   
   # Or start production
   npm start
   ```

### Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

## Database Schema

### Students Collection (Preloaded)
```javascript
{
  rollNo: "22eg105p33",
  yearOfJoining: 2022,
  department: "EG",
  sequence: "105",
  section: "P",
  number: 33,
  collegeEmail: "22eg105p33@anurag.edu.in",
  name: "Sample Student",
  personalEmail: "student@gmail.com",
  yearOfGraduation: 2026,
  isVerified: false
}
```

### Users Collection
```javascript
{
  rollNo: "22eg105p33",
  collegeEmail: "22eg105p33@anurag.edu.in",
  personalEmail: "student@gmail.com",
  name: "Sample Student",
  department: "CSE",
  yearOfJoining: 2022,
  yearOfGraduation: 2026,
  currentCity: "Hyderabad",
  currentCompany: "Infosys",
  passwordHash: "...",
  connections: [],
  role: "alumni" | "admin"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (directory)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `POST /api/events/:id/register` - Register for event

### News
- `GET /api/news` - Get all news
- `POST /api/news` - Create news (admin)

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `POST /api/jobs/:id/apply` - Apply for job
- `GET /api/jobs/my-applications` - Get user applications

### Connections
- `GET /api/connections` - Get user connections
- `POST /api/connections/request/:userId` - Send connection request
- `PUT /api/connections/request/:requestId` - Accept/decline request

### Suggestions
- `GET /api/suggestions` - Get AI-powered connection suggestions

## Default Admin Account

After running the seed script:
- **Roll No**: 19ec401c08
- **Password**: admin123

## Roll Number Format

Format: `YYdeptSEQSectionNo`
- YY: Year of joining (e.g., 22 → 2022)
- dept: Department code (e.g., "eg" = Engineering)
- SEQ: Unique sequence number (e.g., 105)
- Section: Single letter a–z (e.g., "p")
- No: Roll number in section (e.g., 33)

Example: `22eg105p33`

## Features Overview

### For Alumni
- Register with college roll number validation
- Build comprehensive profiles
- Search and connect with other alumni
- View events and news
- Apply for jobs posted by other alumni
- Get AI-powered connection suggestions

### For Admins
- Manage events and news
- View all user activities
- Moderate content and connections

## AI Suggestion Algorithm

The platform uses a scoring system to suggest connections:
- **Batchmates (same dept + year)**: Score 10
- **Same company**: Score 9  
- **Same city**: Score 8
- **Same department**: Score 7

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
