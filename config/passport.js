// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://your-app-domain/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Find or create user based on profile.id (Google ID)
    // Call done() with user data
  }
));

passport.serializeUser((user, done) => {
  // Serialize user ID into session
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Deserialize user by ID from session
  // Find user in database and call done() with user data
});
