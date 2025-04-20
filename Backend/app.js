const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression'); // Import compression middleware
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

// Then import logger
const logger = require('./utils/logger');

// Import routes
const keywordRoutes = require('./routes/keywordRoutes');
const monitoringRoutes = require('./routes/monitoringRoutes');

// Import other middleware
const rateLimitMiddleware = require('./middleware/rateLimitMiddleware');
const loggingMiddleware = require('./middleware/loggingMiddleware'); // Import logging middleware
const errorHandler = require('./middleware/errorHandler'); // Import error handler middleware

// Initialize express app
const app = express();

// Middleware
app.use(loggingMiddleware); // Add logging middleware
app.use(helmet());
app.use(compression()); // Enable gzip compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Apply rate limiting to API routes
app.use('/api', rateLimitMiddleware);

// Debug log for MONGODB_URI
console.log('Connecting to MongoDB:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1); // Exit if connection fails
  });

// Routes
app.use('/api/keywords', keywordRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Keyword Planner API' });
});

// Error handling middleware
app.use(errorHandler);

// Export the app
module.exports = app;