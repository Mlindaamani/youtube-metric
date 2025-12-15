
import type { Request, Response } from 'express';
import { config } from '@/config/index.ts';
import { registerOrUpdateChannel } from '@/modules/auth/auth.service.ts';

export const authCallbackHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
  }

  const { refreshToken, profile } = req.user as any;
  await registerOrUpdateChannel(profile, refreshToken);

  res.redirect(`${config.frontendUrl}/dashboard`);
};

export const getAuthStatus = (req: Request, res: Response) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user || null,
  });
};

export const logout = (req: Request, res: Response) => {
  req.logout(() => {});
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
};