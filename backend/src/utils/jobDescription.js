import { ApiError } from '../middleware/errorHandler.js';

export const MAX_JOB_DESCRIPTION_LENGTH = 20_000;

export function assertJobDescriptionWithinLimit(jobDescription, fieldName = 'jobDescription') {
  if (typeof jobDescription !== 'string') {
    return;
  }

  if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
    throw new ApiError(
      413,
      `${fieldName} exceeds the maximum allowed length of ${MAX_JOB_DESCRIPTION_LENGTH} characters.`
    );
  }
}
