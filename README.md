# YT Metric

A comprehensive YouTube analytics and reporting platform built with modern web technologies. Generate detailed insights about your YouTube channel performance, schedule automated reports, and track key metrics over time.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)

## ✨ Features

### Dashboard & Analytics
- **Channel Management**: Connect and manage YouTube channels with real-time statistics
- **Report Generation**: Create comprehensive reports with detailed channel insights
- **Report Scheduling**: Schedule automated weekly reports for continuous monitoring
- **Report Management**: Download, view, and delete generated reports
- **Live Statistics**: Real-time view counts, subscriber counts, and video metrics

### User Experience
- **Dark Mode Support**: Full dark/light theme toggle with Tailwind CSS
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Professional UI**: shadcn/ui components with custom styling
- **Real-time Feedback**: Toast notifications for all user actions
- **Loading States**: Skeleton loaders and spinners during data fetching

### Backend Features
- **OAuth Authentication**: Secure YouTube OAuth 2.0 integration
- **Session Management**: MongoDB-based session persistence
- **Job Scheduling**: Automated report generation with node-cron
- **Database ORM**: Prisma for type-safe database operations
- **Error Handling**: Comprehensive error handling and validation

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (OAuth 2.0)
- **Job Scheduling**: node-cron
- **File Processing**: DOCX generation
- **API**: YouTube Data API v3

## 📁 Project Structure

```
yt-metric/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── ChannelCard.tsx
│   │   │   ├── DashboardTabs.tsx
│   │   │   ├── GenerateTab.tsx
│   │   │   ├── ReportsTable.tsx
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── NotFound.tsx
│   │   ├── store/              # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── channelStore.ts
│   │   │   ├── jobsStore.ts
│   │   │   └── reportsStore.ts
│   │   ├── api/                # API client functions
│   │   │   ├── auth.ts
│   │   │   ├── channel.ts
│   │   │   ├── reports.ts
│   │   │   └── jobs.ts
│   │   ├── types/              # TypeScript type definitions
│   │   └── hooks/              # Custom React hooks
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                     # Express application
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication logic
│   │   │   ├── channel/        # Channel management
│   │   │   ├── job/            # Job scheduling
│   │   │   ├── report/         # Report generation
│   │   │   └── youtube/        # YouTube API integration
│   │   ├── middleware/         # Express middleware
│   │   ├── config/             # Configuration files
│   │   ├── jobs/               # Background job handlers
│   │   ├── utils/              # Utility functions
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server entry point
│   ├── prisma/                 # Database schema
│   ├── tsconfig.json
│   └── package.json
│
└── README.md                    # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16 or higher
- **npm**: v7 or higher (or Bun)
- **MongoDB**: Local or cloud instance (MongoDB Atlas recommended)
- **YouTube Developer Account**: For OAuth credentials

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd yt-metric
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (local development)
   - Your production URL

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yt-metric

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/callback

# Session
SESSION_SECRET=your_session_secret_key

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm preview
```

## 📚 API Documentation

### Authentication
- **POST** `/api/auth/google` - Google OAuth login
- **POST** `/api/auth/logout` - Logout user

### Channels
- **GET** `/api/channels/info` - Get connected channel info
- **PUT** `/api/channels/:id` - Update channel details

### Reports
- **GET** `/api/reports` - List all reports
- **POST** `/api/reports/generate` - Generate new report
- **GET** `/api/reports/:id/download` - Download report as DOCX
- **DELETE** `/api/reports/:id` - Delete report

### Jobs
- **GET** `/api/jobs` - List scheduled jobs
- **POST** `/api/jobs` - Create new scheduled job
- **DELETE** `/api/jobs/:id` - Cancel scheduled job

## 🏗 Architecture

### State Management (Frontend)

The application uses **Zustand** for state management with the following stores:

- **authStore**: User authentication state and actions
- **channelStore**: Connected YouTube channel information
- **reportsStore**: Generated reports with caching (10-second debounce)
- **jobsStore**: Scheduled report jobs

All stores implement debouncing to prevent excessive API calls and maintain optimal performance.

### Data Flow

```
User Action → Component → Store Action → API Call → Response Update → State Update → UI Re-render
```

### Backend Architecture

The backend follows a modular architecture with clear separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data operations
- **Models**: Database schema definitions
- **Routes**: API endpoint definitions
- **Middleware**: Request processing and validation

## 📊 Key Technologies Explained

### Zustand (State Management)
Lightweight alternative to Redux providing simple, scalable state management without boilerplate.

### Tailwind CSS
Utility-first CSS framework enabling rapid UI development with a consistent design system.

### shadcn/ui (Component Library)
High-quality, accessible React components built on Radix UI and Tailwind CSS.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB URI is correct in `.env`
- Check MongoDB Atlas IP whitelist includes your current IP
- Verify credentials are properly encoded

### OAuth Redirect Issues
- Confirm redirect URIs match in Google Cloud Console and backend config
- Clear browser cookies for localhost
- Check `GOOGLE_CALLBACK_URL` matches exactly

### Build Errors
- Delete `node_modules` and run `npm install` again
- Clear build cache: `npm run clean && npm run build`
- Check Node.js version compatibility

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting

### Component Development
- Keep components focused and reusable
- Use functional components with hooks
- Implement proper TypeScript interfaces

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@ytmetric.com or open an issue in the repository.

---

**Made with ❤️ by the YT Metric Team**
