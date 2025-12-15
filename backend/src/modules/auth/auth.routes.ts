
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '@/config/index.ts';
import { authCallbackHandler, getAuthStatus, logout } from '@/modules/auth/auth.controller.ts';


passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.redirectUri,
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'],
    },
    (accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
      return done(null, { accessToken, refreshToken, profile });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

const router = express.Router();

router.get('/status', getAuthStatus);
router.get('/google', passport.authenticate('google', {
  accessType: 'offline',
  prompt: 'consent'
}));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authCallbackHandler);
router.post('/logout', logout);

export default router;