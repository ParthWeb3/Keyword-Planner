// backend/server.js
require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const connectDB = require('./utils/db');
const config = require('./config/config');
const mongoose = require('mongoose');

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'OPENAI_API_KEY', 'REDIS_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const PORT = config.port;

// Connect to MongoDB
connectDB();

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.env} mode`);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down gracefully...');
  try {
    await mongoose.connection.close();
    server.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
