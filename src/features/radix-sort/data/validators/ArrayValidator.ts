import { InvalidArrayError } from '@features/radix-sort/domain/errors/InvalidArrayError';

/**
 * Validates array input for Radix Sort algorithm.
 * Radix Sort requires non-negative integers.
 */
export function validateArray(array: number[]): void {
  if (!array || array.length === 0) {
    throw new InvalidArrayError('O vetor não pode estar vazio');
  }

  if (array.length < 2) {
    throw new InvalidArrayError('O vetor deve ter pelo menos 2 elementos');
  }

  if (array.length > 15) {
    throw new InvalidArrayError('O vetor deve ter no máximo 15 elementos para visualização do Radix Sort');
  }

  if (!array.every(n => Number.isInteger(n))) {
    throw new InvalidArrayError('Todos os elementos devem ser números inteiros');
  }

  if (!array.every(n => n >= 0)) {
    throw new InvalidArrayError('Radix Sort requer números não-negativos (≥ 0)');
  }

  if (!array.every(n => n <= 9999)) {
    throw new InvalidArrayError('Os valores devem estar entre 0 e 9999 para visualização');
  }
}

/**
 * Parses a string input into an array of numbers.
 * Accepts formats: "1, 2, 3" or "1 2 3" or "[1, 2, 3]"
 */
export function parseArrayInput(input: string): number[] {
  // Remove brackets if present
  let cleaned = input.trim().replace(/^\[|\]$/g, '');
  
  // Split by comma or space
  const parts = cleaned.split(/[,\s]+/).filter(s => s.length > 0);
  
  const numbers = parts.map(s => {
    const num = parseInt(s.trim(), 10);
    if (isNaN(num)) {
      throw new InvalidArrayError(`Valor inválido: "${s}"`);
    }
    return num;
  });

  return numbers;
}
