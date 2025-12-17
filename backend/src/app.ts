import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import authRoutes from '@/modules/auth/auth.routes.ts';
import channelRoutes from '@/modules/channel/channel.routes.ts';
import reportRoutes from '@/modules/report/report.routes.ts';
import { jobRoutes } from '@/modules/job/job.routes.ts';
import { config } from '@/config/index.ts';


const app = express();

// Add morgan logging for development
if (config.environment === 'development') {
  app.use(morgan('combined'));
}

// CORS configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
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
