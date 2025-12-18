import session from 'express-session';
import MongoStore from 'connect-mongo';

export const createSessionConfig = () => {
  const sessionSecret = process.env.SESSION_SECRET!;
  const mongoUri = process.env.MONGODB_URI!;
  const environment = process.env.NODE_ENV || 'development';
  
  return session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      touchAfter: 24 * 3600,
    }),
    cookie: {
      secure: environment === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: environment === 'production' ? 'none' : 'lax',
    },
    name: 'sessionId',
  });
};