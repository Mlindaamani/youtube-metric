import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI!,
  environment: process.env.NODE_ENV || 'development',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  },
  sessionSecret: process.env.SESSION_SECRET!,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};