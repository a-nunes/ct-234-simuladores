/**
 * Error thrown when input validation fails for pattern matching algorithms.
 */
export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}
