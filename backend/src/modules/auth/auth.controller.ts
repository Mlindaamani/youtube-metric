
import type { Request, Response } from 'express';
import { config } from '@/config/index.ts';
import { registerOrUpdateChannel } from '@/modules/auth/auth.service.ts';

export const authCallbackHandler = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
    }

    const { refreshToken, profile } = req.user as any;
    
    if (!refreshToken) {
      return res.redirect(`${config.frontendUrl}/login?error=no_refresh_token`);
    }

    await registerOrUpdateChannel(profile, refreshToken);
    res.redirect(`${config.frontendUrl}/dashboard`);
  } catch (error: any) {
    console.error('Auth callback error:', error);
    res.redirect(`${config.frontendUrl}/login?error=channel_registration_failed`);
  }
};

export const getAuthStatus = (req: Request, res: Response) => {
  console.log('Auth status check:', {
    isAuthenticated: req.isAuthenticated(),
    hasUser: !!req.user,
    sessionID: req.sessionID,
    cookies: req.headers.cookie
  });
  
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null,
  });
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    
    // Destroy session after successful logout
    if (req.session) {
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error('Session destroy error:', destroyErr);
          return res.status(500).json({ error: 'Failed to destroy session' });
        }
        
        // Clear the session cookie
        res.clearCookie('sessionId');
        res.json({ message: 'Logged out successfully' });
      });
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
};