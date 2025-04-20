const { rest } = require('msw');

const handlers = [
  rest.post('https://api.openai.com/v1/chat/completions', async (req, res, ctx) => {
    return res(
      ctx.json({
        choices: [{
          message: {
            content: JSON.stringify({
              keywords: [{
                keyword: "test keyword",
                searchVolume: 1000,
                competition: 0.5,
                cpc: 1.2
              }]
            })
          }
        }]
      })
    );
  }),
  
  rest.get('/api/keywords/analyze', async (req, res, ctx) => {
    const { keyword } = req.url.searchParams;
    return res(
      ctx.json({
        success: true,
        data: {
          keyword,
          searchVolume: 1000,
          competition: 0.5
        }
      })
    );
  })
];

module.exports = { handlers }; 