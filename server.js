require('dotenv').config();
const express = require('express');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const swaggerSpec = require('./config/swagger');

const app = express();

// Trust Render's proxy — required for secure cookies on Render/Heroku
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProduction = process.env.NODE_ENV === 'production';

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,       // HTTPS only in production
      sameSite: isProduction ? 'none' : 'lax', // 'none' needed for Render's proxy
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/books', require('./routes/books'));
app.use('/authors', require('./routes/authors'));
app.use('/members', require('./routes/members'));
app.use('/loans', require('./routes/loans'));

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Library Management API',
    docs: '/api-docs',
    auth: '/auth/github',
    collections: ['/books', '/authors', '/members', '/loans']
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});

module.exports = { app, server };