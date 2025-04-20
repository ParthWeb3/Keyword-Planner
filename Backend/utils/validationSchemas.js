const { z } = require('zod');

const KeywordSchema = z.object({
  keyword: z.string().min(1, "Keyword must not be empty"),
  searchVolume: z.union([
    z.number().int().positive(),
    z.string().transform(val => parseInt(val))
  ]).pipe(z.number().int().min(100).max(10000)),
  competition: z.union([
    z.number().min(0).max(1),
    z.string().transform(val => parseFloat(val))
  ]).pipe(z.number().min(0).max(1)),
  cpc: z.union([
    z.number().min(0.1).max(10),
    z.string().transform(val => parseFloat(val))
  ]).pipe(z.number().min(0.1).max(10))
});

const KeywordResponseSchema = z.object({
  keywords: z.array(KeywordSchema)
});

const validateKeywordResponse = (data) => {
  try {
    return KeywordResponseSchema.parse(data);
  } catch (error) {
    throw new Error(`Invalid keyword response format: ${error.message}`);
  }
};

module.exports = {
  KeywordSchema,
  KeywordResponseSchema,
  validateKeywordResponse
}; 