/**
 * Middleware to protect routes — requires an active GitHub OAuth session.
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Please log in at /auth/github' });
};

module.exports = { isAuthenticated };
