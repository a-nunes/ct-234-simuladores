import { BoyerMooreConfig } from '@features/boyer-moore/domain/entities/BoyerMooreConfig';
import { InvalidInputError } from '@features/boyer-moore/domain/errors/InvalidInputError';

/**
 * Validates the input configuration for Boyer-Moore algorithm.
 * @param config - The configuration to validate
 * @throws InvalidInputError if validation fails
 */
export function validateInput(config: BoyerMooreConfig): void {
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
