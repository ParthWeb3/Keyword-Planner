# Backend API Documentation

## API Endpoints

### Keyword Analysis
**GET** `/api/keywords/analyze`

#### Request Parameters
- `keyword` (string, required): Seed keyword for analysis
- `userId` (string, optional): User identifier for rate limiting

#### Response Format
```json
{
  "success": true,
  "data": {
    "mainKeyword": {
      "keyword": "string",
      "searchVolume": number,
      "competition": number,
      "cpc": number
    },
    "relatedKeywords": [
      {
        "keyword": "string",
        "searchVolume": number,
        "competition": number,
        "cpc": number
      }
    ]
  }
}
```

#### Rate Limits
- 100 requests/hour for keyword analysis
- 200 requests/hour for suggestions
- ChatGPT API: 50 requests/hour per user

#### Error Codes
- `429`: Rate limit exceeded
- `400`: Invalid input parameters
- `500`: ChatGPT API error
