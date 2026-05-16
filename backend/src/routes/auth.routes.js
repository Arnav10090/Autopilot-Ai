import express from "express";
import { createUser, getUserByEmail, getUserById, updateUserPassword, deactivateUser } from "../db/user.repository.js";
import bcrypt from "bcrypt";
import { getPrimaryFrontendUrl } from "../utils/runtimeConfig.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, dob } = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await createUser({ name, email, password: passwordHash, phone, dob });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if account is deactivated
    if (user.account_status === 'Inactive') {
      return res.status(403).json({ error: "This account has been deactivated" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/profile/:id
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[PROFILE] Fetching profile for ID: ${id}`);

    // Integer validation for Serial ID
    if (!id || isNaN(id)) {
        console.error(`[PROFILE] Invalid ID format: ${id}`);
        return res.status(400).json({ error: "Invalid User ID" });
    }

    const user = await getUserById(id);
    if (!user) {
      console.warn(`[PROFILE] User not found for ID: ${id}`);
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if user has OAuth accounts
    const { pool } = await import('../db/index.js');
    const { rows: oauthAccounts } = await pool.query(
      `SELECT provider FROM oauth_accounts WHERE user_id = $1`,
      [id]
    );
    
    const providers = oauthAccounts.map(account => account.provider);
    const isOAuthUser = providers.length > 0;
    
    // Return full details except password (or include hashed if needed for UI "current password" check demo)
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      isOAuthUser,
      oauthProviders: providers,
      // For demo purposes only, sending back the "hash" so UI can populate "Current Password" field
      // In production, NEVER send password back.
      password_hash: user.password_hash 
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/auth/profile/:id
router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, dob } = req.body;
    
    console.log(`[PROFILE UPDATE] Updating profile for ID: ${id}`);
    
    // Integer validation for Serial ID
    if (!id || isNaN(id)) {
        console.error(`[PROFILE UPDATE] Invalid ID format: ${id}`);
        return res.status(400).json({ error: "Invalid User ID" });
    }

    // Import updateUserProfile
    const { updateUserProfile } = await import('../db/user.repository.js');
    
    const updatedUser = await updateUserProfile(id, { name, email, phone, dob });
    
    if (!updatedUser) {
      console.warn(`[PROFILE UPDATE] User not found for ID: ${id}`);
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// PUT /api/auth/password
router.put("/password", async (req, res) => {
  try {
    const { user_id, new_password } = req.body;
    
    if (!user_id || !new_password) {
      return res.status(400).json({ error: "User ID and new password are required" });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(new_password, saltRounds);

    const result = await updateUserPassword(user_id, passwordHash);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// DELETE /api/auth/account/:id (soft delete - deactivates account)
router.delete("/account/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const result = await deactivateUser(id);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error("Account deactivation error:", error);
    res.status(500).json({ error: "Failed to deactivate account" });
  }
});

// ============== OAuth Routes ==============

// Google OAuth - Initiate authentication
router.get('/google',
  (req, res, next) => {
    // Import passport here to avoid circular dependency
    import('../config/passport.js').then(module => {
      const passport = module.default;
      passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    });
  }
);

// Google OAuth - Callback
router.get('/google/callback',
  async (req, res, next) => {
    const passport = (await import('../config/passport.js')).default;
    const frontendUrl = getPrimaryFrontendUrl();
    passport.authenticate('google', { 
      failureRedirect: `${frontendUrl}/auth/signin?error=google_auth_failed`,
      session: false 
    })(req, res, next);
  },
  (req, res) => {
    // Successful authentication
    const user = req.user;
    const frontendUrl = getPrimaryFrontendUrl();
    
    // Redirect to frontend with user data in URL params (for demo purposes)
    // In production, use secure tokens/sessions
    res.redirect(`${frontendUrl}/auth/callback?user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }))}`);
  }
);

// GitHub OAuth - Initiate authentication
router.get('/github',
  (req, res, next) => {
    import('../config/passport.js').then(module => {
      const passport = module.default;
      passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
    });
  }
);

// GitHub OAuth - Callback
router.get('/github/callback',
  async (req, res, next) => {
    const passport = (await import('../config/passport.js')).default;
    const frontendUrl = getPrimaryFrontendUrl();
    passport.authenticate('github', { 
      failureRedirect: `${frontendUrl}/auth/signin?error=github_auth_failed`,
      session: false 
    })(req, res, next);
  },
  (req, res) => {
    // Successful authentication
    const user = req.user;
    const frontendUrl = getPrimaryFrontendUrl();
    
    // Redirect to frontend with user data in URL params
    res.redirect(`${frontendUrl}/auth/callback?user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }))}`);
  }
);

export default router;
