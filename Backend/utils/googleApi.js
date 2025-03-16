const fs = require('fs');
const path = require('path');

// Load credentials
const credentialsPath = path.join(__dirname, '../google-credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// Access the API key
const apiKey = credentials.apiKey;

console.log('Google API Key:', apiKey); // For debugging purposes

// Example: Using the API key in a Google API client
const { google } = require('googleapis');
const customSearch = google.customsearch('v1');

module.exports = {
  search: async (query) => {
    const response = await customSearch.cse.list({
      q: query,
      cx: 'YOUR_SEARCH_ENGINE_ID', // Replace with your search engine ID
      key: apiKey,
    });
    return response.data;
  },
};
