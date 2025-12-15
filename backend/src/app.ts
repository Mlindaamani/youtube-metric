import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from '@/modules/auth/auth.routes.ts';
import channelRoutes from '@/modules/channel/channel.routes.ts';
import reportRoutes from '@/modules/report/report.routes.ts';
import { config } from '@/config/index.ts';


const app = express();

app.use(express.json());
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/report', reportRoutes);

export default app;
