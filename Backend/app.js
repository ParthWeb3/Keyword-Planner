// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes (we'll create these later)
const keywordRoutes = require('./routes/keywordRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize express app
const app = express();

// Load environment variables
dotenv.config({ path: './.env' }); // Ensure the .env file is in the root of the Backend directory

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Debug log for MONGODB_URI
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if the database connection fails
  });

// Routes
app.use('/api/keywords', keywordRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Keyword Planner API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Remove app.listen() from here

module.exports = app;


// Ensure the .env file is created in the root directory with the required variables
