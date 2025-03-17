const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const keywordRoutes = require('./routes/keywordRoutes');

// Initialize express app
const app = express();

// Load environment variables
dotenv.config(); // Ensure this is called before accessing process.env

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Debug log for MONGODB_URI
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    if (err.message.includes('querySrv ENOTFOUND')) {
      console.error('Check your MongoDB URI and ensure the cluster URL is correct.');
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Export the app
module.exports = app;