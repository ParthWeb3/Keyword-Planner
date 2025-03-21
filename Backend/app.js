const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression'); // Import compression middleware
const dotenv = require('dotenv');
const loggingMiddleware = require('./middleware/loggingMiddleware'); // Import logging middleware
const errorHandler = require('./middleware/errorHandler'); // Import error handler middleware

// Import routes
const keywordRoutes = require('./routes/keywordRoutes');

// Initialize express app
const app = express();

// Load environment variables
dotenv.config(); // Ensure this is called before accessing process.env

// Middleware
app.use(loggingMiddleware); // Add logging middleware
app.use(helmet());
app.use(compression()); // Enable gzip compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  },
});
app.use(limiter);

// Debug log for MONGODB_URI
console.log('Connecting to MongoDB:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit if connection fails
  });

// Routes
app.use('/api/keywords', keywordRoutes);

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Keyword Planner API' });
});

// Error handling middleware
app.use(errorHandler);

// Export the app
module.exports = app;