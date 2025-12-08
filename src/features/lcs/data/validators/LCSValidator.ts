import { LCSConfig } from '@features/lcs/domain/entities/LCSConfig';
import { InvalidLCSStringError } from '@features/lcs/domain/errors/InvalidLCSInputError';

/**
 * Validates LCS input strings to ensure they are usable by the algorithm.
 * - Both strings must be non-empty after trimming.
 * - Validation is strict but non-mutating (no normalization here).
 */
export function validateLCSConfig(config: LCSConfig): void {
  if (!config) {
    throw new InvalidLCSStringError('Configuração LCS é obrigatória.');
  }

  validateString(config.stringX, 'X');
  validateString(config.stringY, 'Y');
}

function validateString(value: string, label: 'X' | 'Y'): void {
  if (typeof value !== 'string') {
    throw new InvalidLCSStringError(`String ${label} deve ser um texto válido.`);
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    throw new InvalidLCSStringError(`String ${label} não pode ser vazia ou apenas espaços.`);
  }
}
