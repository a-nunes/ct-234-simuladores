import { InvalidArrayError, InvalidSearchValueError } from '@features/binary-search/domain/errors/InvalidArrayError';

/**
 * Validates that an array is not empty and is sorted in ascending order.
 * @param arr - Array to validate
 * @throws InvalidArrayError if array is invalid
 */
export function validateArray(arr: number[]): void {
  if (arr.length === 0) {
    throw new InvalidArrayError('Array não pode estar vazio!');
  }

  // Check if array is sorted
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      throw new InvalidArrayError('Array deve estar ordenado em ordem crescente!');
    }
  }
}

/**
 * Validates that a search value is a valid number.
 * @param value - Search value to validate
 * @throws InvalidSearchValueError if value is invalid
 */
export function validateSearchValue(value: number): void {
  if (isNaN(value)) {
    throw new InvalidSearchValueError('Valor de busca inválido!');
  }
}

/**
 * Parses a comma-separated string into an array of numbers.
 * @param input - Comma-separated string
 * @returns Array of numbers
 * @throws InvalidArrayError if parsing fails or array is empty
 */
export function parseArray(input: string): number[] {
  const parsed = input
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n));

  if (parsed.length === 0) {
    throw new InvalidArrayError('Array inválido! Use números separados por vírgula.');
  }

  return parsed;
}

/**
 * Parses a string into a number.
 * @param input - String to parse
 * @returns Parsed number
 * @throws InvalidSearchValueError if parsing fails
 */
export function parseSearchValue(input: string): number {
  const parsed = parseInt(input.trim(), 10);
  
  if (isNaN(parsed)) {
    throw new InvalidSearchValueError('Valor de busca inválido!');
  }

  return parsed;
}

