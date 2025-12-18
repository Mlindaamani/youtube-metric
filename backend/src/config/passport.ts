import passport from 'passport';

// Initialize passport configuration
export const initializePassport = () => {
  // Passport will be initialized in app.ts
  return {
    initialize: passport.initialize(),
    session: passport.session()
  };
};