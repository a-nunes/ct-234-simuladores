import { InvalidArrayError } from '@features/heap-sort/domain/errors/InvalidArrayError';

/**
 * Validates array input for Heap Sort algorithm.
 */
export function validateArray(array: number[]): void {
  if (!array || array.length === 0) {
    throw new InvalidArrayError('O vetor não pode estar vazio');
  }

  if (array.length < 2) {
    throw new InvalidArrayError('O vetor deve ter pelo menos 2 elementos');
  }

  if (array.length > 15) {
    throw new InvalidArrayError('O vetor deve ter no máximo 15 elementos para visualização da árvore');
  }

  if (!array.every(n => Number.isInteger(n))) {
    throw new InvalidArrayError('Todos os elementos devem ser números inteiros');
  }

  if (!array.every(n => n >= 0 && n <= 999)) {
    throw new InvalidArrayError('Os valores devem estar entre 0 e 999');
  }
}

/**
 * Parses a string input into an array of numbers.
 */
export function parseArrayInput(input: string): number[] {
  let cleaned = input.trim().replace(/^\[|\]$/g, '');
  const parts = cleaned.split(/[,\s]+/).filter(s => s.length > 0);
  
  if (parts.length === 0) {
    throw new InvalidArrayError('Entrada vazia ou inválida');
  }

  const numbers = parts.map(s => {
    const num = parseInt(s.trim(), 10);
    if (isNaN(num)) {
      throw new InvalidArrayError(`Valor inválido: "${s}"`);
    }
    return num;
  });

  return numbers;
}

/**
 * Generates a random array for Heap Sort visualization.
 */
export function generateRandomArray(length?: number): number[] {
  const size = length ?? Math.floor(Math.random() * 6) + 5; // 5-10 elements by default
  return Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
}
