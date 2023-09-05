// passport.js
const passport = require('passport');
const User = require('../models/user');

// Define our passport oauth strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  async function(accessToken, refreshToken, profile, cb) {
    // Find or create user based on profile.id (Google ID)
    // Call done() with user data
    try {
      // check for the user in our db
      let user = await User.findOne({ googleId: profile.id})
      // If a user is found, provide to passport
      if (user) return cb(null, user)
      // Otherwise, we'll create a new user to provide to passport
    user = await User.create({
      name: profile.displayName,
      googleId: profile.id,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value
    })
    } catch (err) {
      return cb(err)
    }
  }
));

// This is the method to serialized our users
passport.serializeUser(function(user, cb) {
  // Serialize user ID into session
  cb(null, user.id);
});
// This is the method to deserialized our users
passport.deserializeUser(async function(userId, cb) {
  // Deserialize user by ID from session
  // Find user in database and call done() with user data
  cb(null, await User.findById(userId))
});
