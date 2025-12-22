import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import authRoutes from '@/modules/auth/auth.routes.ts';
import channelRoutes from '@/modules/channel/channel.routes.ts';
import reportRoutes from '@/modules/report/report.routes.ts';
import { jobRoutes } from '@/modules/job/job.routes.ts';
import { config } from '@/config/index.ts';


const app = express();

// Add morgan logging for development
  app.use(morgan('dev'));


// CORS configuration
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  // Add your Vercel frontend URL here once deployed
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(
  session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: config.mongoUri,
      touchAfter: 24 * 3600, // Lazy session update (in seconds)
    }),
    cookie: {
      secure: config.environment === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: config.environment === 'production' ? 'none' : 'lax',
    },
    name: 'sessionId',
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/jobs', jobRoutes);

export default app;
