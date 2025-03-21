# Backend API Documentation

## Keyword Analysis Endpoint

### Description
Fetch keyword suggestions using the ChatGPT API.

### Request
**GET** `/api/keywords/analyze`

#### Query Parameters
- `keyword` (string, required): The seed keyword for generating suggestions.

### Response
```json
{
  "success": true,
  "data": [
    {
      "keyword": "example keyword",
      "searchVolume": 1000,
      "difficulty": 3
    }
  ]
}
```
