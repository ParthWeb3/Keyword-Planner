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
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_URL}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
  {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
  }
)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    if (err.message.includes('querySrv ENOTFOUND')) {
      console.error('Check your MongoDB URI and ensure the cluster URL is correct.');
    } else if (err.message.includes('authentication failed')) {
      console.error('Authentication failed. Check your username and password.');
    }
    process.exit(1); // Exit the process if the database connection fails
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