const { APIError } = require('./errors');

async function resilientAPICall(fn, retries = 3) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        throw new APIError('Maximum retry attempts reached', error);
      }
      
      if (error.status === 429 || error.code === 'ECONNRESET') {
        const delay = Math.min(2 ** attempt * 1000, 10000); // Cap at 10 seconds
        await new Promise(res => setTimeout(res, delay));
        attempt++;
        continue;
      }
      
      throw error;
    }
  }
}

module.exports = {
  resilientAPICall
}; 