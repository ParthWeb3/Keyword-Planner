// backend/server.js
const dotenv = require('dotenv');
dotenv.config(); // Ensure this is called before accessing process.env

const app = require('./app');
const { Configuration, OpenAIApi } = require('openai');

// Ensure OPENAI_API_KEY is set
if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is not set in the environment variables.");
  process.exit(1); // Exit the application if the key is missing
}

// Ensure MONGODB_URI is set
if (!process.env.MONGODB_URI) {
  console.warn("Warning: MONGODB_URI is not set in the environment variables. Database connection may fail.");
}

// Configure OpenAI API
const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is loaded correctly
});
const openai = new OpenAIApi(openaiConfig);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
