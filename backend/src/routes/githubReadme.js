import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { generateReadmeSchema } from '../schemas/github.schema.js';
import { generateReadme } from '../services/readmeGenerator.js';

const router = express.Router();

router.post(
  '/generate',
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(generateReadmeSchema),
  asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    try {
      const result = await generateReadme(prompt, req.aiProvider);
      res.json({
        success: true,
        data: {
          markdown: result.markdown,
          provider: req.aiProvider.providerName,
          providerSource: req.aiProviderSource,
          usage: result.usage || null,
        },
      });
    } catch (error) {
      console.error('README generation error:', error);
      throw new ApiError(502, 'Failed to generate README. Please try again.');
    }
  })
);

export default router;
