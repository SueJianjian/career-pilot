import { z } from 'zod';

export const generateReadmeSchema = z.object({
  prompt: z
    .string({ required_error: 'prompt is required' })
    .min(10, 'prompt must be at least 10 characters')
    .max(5_000, 'prompt must be at most 5,000 characters'),
});
