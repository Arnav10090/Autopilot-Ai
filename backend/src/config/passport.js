import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { getUserByOAuthId, createOAuthUser, getUserById } from '../db/user.repository.js';
import { getBackendPublicUrl } from '../utils/runtimeConfig.js';

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || `${getBackendPublicUrl()}/api/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await getUserByOAuthId('google', profile.id);

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Extract user info from Google profile
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        const name = profile.displayName || 'Google User';

        // Create new user
        user = await createOAuthUser({
          name,
          email,
          oauth_provider: 'google',
          oauth_id: profile.id,
        });

        done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || `${getBackendPublicUrl()}/api/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this GitHub ID
        let user = await getUserByOAuthId('github', profile.id);

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Extract user info from GitHub profile
        // GitHub emails might not be in the profile, check emails array
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        const name = profile.displayName || profile.username || 'GitHub User';

        // Create new user
        user = await createOAuthUser({
          name,
          email,
          oauth_provider: 'github',
          oauth_id: profile.id,
        });

        done(null, user);
      } catch (error) {
        console.error('GitHub OAuth error:', error);
        done(error, null);
      }
    }
  )
);

export default passport;
