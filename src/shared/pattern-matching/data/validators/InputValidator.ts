import { PatternMatchingConfig } from '@shared/pattern-matching/domain/entities/PatternMatchingConfig';
import { InvalidInputError } from '@shared/pattern-matching/domain/errors/InvalidInputError';

/**
 * Validates the input configuration for pattern matching algorithms.
 * @param config - The configuration to validate
 * @throws InvalidInputError if validation fails
 */
export function validateInput(config: PatternMatchingConfig): void {
  if (!config.text) {
    throw new InvalidInputError('O texto não pode estar vazio.');
  }
  
  if (!config.pattern) {
    throw new InvalidInputError('O padrão não pode estar vazio.');
  }
  
  if (config.pattern.length > config.text.length) {
    throw new InvalidInputError('O padrão não pode ser maior que o texto.');
  }
}
