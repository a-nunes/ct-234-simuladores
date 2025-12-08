import { AutomatonConfig } from '@features/automaton/domain/entities/AutomatonConfig';
import { InvalidInputError } from '@shared/pattern-matching';

/**
 * Validates the automaton configuration.
 * 
 * @param config - The configuration to validate
 * @throws InvalidInputError if validation fails
 */
export function validateAutomatonConfig(config: AutomatonConfig): void {
  validatePattern(config.pattern);
  validateAlphabet(config.alphabet);
  validatePatternInAlphabet(config.pattern, config.alphabet);
}

/**
 * Validates the pattern string.
 * 
 * @param pattern - The pattern to validate
 * @throws InvalidInputError if pattern is invalid
 */
export function validatePattern(pattern: string): void {
  if (!pattern) {
    throw new InvalidInputError('O padrão não pode estar vazio.');
  }
  
  if (pattern.length === 0) {
    throw new InvalidInputError('O padrão deve ter pelo menos um caractere.');
  }
}

/**
 * Validates the alphabet array.
 * 
 * @param alphabet - The alphabet to validate
 * @throws InvalidInputError if alphabet is invalid
 */
export function validateAlphabet(alphabet: string[]): void {
  if (!alphabet || !Array.isArray(alphabet)) {
    throw new InvalidInputError('O alfabeto deve ser um array de caracteres.');
  }
  
  if (alphabet.length === 0) {
    throw new InvalidInputError('O alfabeto deve ter pelo menos um caractere.');
  }
  
  // Check for empty strings
  const hasEmptyChar = alphabet.some(char => !char || char.length === 0);
  if (hasEmptyChar) {
    throw new InvalidInputError('O alfabeto não pode conter caracteres vazios.');
  }
  
  // Check for duplicates
  const uniqueChars = new Set(alphabet);
  if (uniqueChars.size !== alphabet.length) {
    throw new InvalidInputError('O alfabeto não pode conter caracteres duplicados.');
  }
}

/**
 * Validates that all characters in the pattern are in the alphabet.
 * 
 * @param pattern - The pattern to check
 * @param alphabet - The alphabet to check against
 * @throws InvalidInputError if pattern contains characters not in alphabet
 */
export function validatePatternInAlphabet(pattern: string, alphabet: string[]): void {
  const alphabetSet = new Set(alphabet);
  
  for (const char of pattern) {
    if (!alphabetSet.has(char)) {
      throw new InvalidInputError(
        `O caractere '${char}' no padrão não está no alfabeto. ` +
        `Alfabeto atual: {${alphabet.join(', ')}}`
      );
    }
  }
}

/**
 * Parses a comma-separated string into an alphabet array.
 * Trims whitespace and filters empty strings.
 * 
 * @param input - Comma-separated string (e.g., "a, b, c")
 * @returns Array of characters
 * 
 * @example
 * parseAlphabetString("a, b, c") // returns ['a', 'b', 'c']
 * parseAlphabetString("a,b,c")   // returns ['a', 'b', 'c']
 */
export function parseAlphabetString(input: string): string[] {
  return input
    .split(',')
    .map(char => char.trim())
    .filter(char => char.length > 0);
}
