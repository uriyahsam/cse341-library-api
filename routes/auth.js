const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: GitHub OAuth authentication
 */

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Login with GitHub
 *     tags: [Auth]
 *     description: Redirects to GitHub OAuth consent screen.
 *     responses:
 *       302:
 *         description: Redirect to GitHub login
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to /auth/profile on success
 */
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure' }),
  (req, res) => res.redirect('/auth/profile')
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged-in user info
 *       401:
 *         description: Not authenticated
 */
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated. Visit /auth/github to log in.' });
  }
  res.status(200).json({
    message: 'Authenticated successfully',
    user: {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName,
      email: req.user.emails?.[0]?.value
    }
  });
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.status(200).json({ message: 'Logged out successfully' }));
  });
});

/**
 * @swagger
 * /auth/failure:
 *   get:
 *     summary: Authentication failure
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: Authentication failed
 */
router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'GitHub authentication failed' });
});

module.exports = router;