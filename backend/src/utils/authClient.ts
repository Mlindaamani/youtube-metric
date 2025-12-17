import { google } from 'googleapis';
import { config } from '@/config/index.ts';

/**
 * Centralized OAuth2 client creation for YouTube API access
 * @param refreshToken - The user's refresh token
 * @returns Configured OAuth2 client
 */
export const getAuthClient = (refreshToken: string) => {
  const oauth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
};