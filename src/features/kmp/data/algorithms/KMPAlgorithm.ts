import { KMPPreprocessStep } from '@features/kmp/domain/entities/KMPStep';

export interface BuildFailureFunctionResult {
  table: number[];
  steps: KMPPreprocessStep[];
}

/**
 * Builds the failure function (also known as prefix table) for the KMP algorithm.
 * Returns both the table and step-by-step visualization data.
 * 
 * @param pattern - The pattern string
 * @returns Object containing failure table and preprocessing steps
 */
export function buildFailureFunction(pattern: string): BuildFailureFunctionResult {
  const m = pattern.length;
  const F: number[] = new Array(m).fill(-1);
  F[0] = 0;
  const steps: KMPPreprocessStep[] = [];
  
  // Initial step
  steps.push({
    phase: 'preprocess',
    type: 'init',
    i: 1,
    j: 0,
    comparing: false,
    match: null,
    failureTable: [...F],
    message: 'Inicializando: F[0] = 0. Começando com i=1 e j=0'
  });

  let j = 0;
  let i = 1;

  while (i < m) {
    // Comparison step
    steps.push({
      phase: 'preprocess',
      type: 'compare',
      i,
      j,
      comparing: true,
      match: null,
      failureTable: [...F],
      message: `Comparando P[${i}]='${pattern[i]}' com P[${j}]='${pattern[j]}'`
    });

    if (pattern[i] === pattern[j]) {
      // Match
      F[i] = j + 1;
      steps.push({
        phase: 'preprocess',
        type: 'match',
        i,
        j,
        comparing: true,
        match: true,
        failureTable: [...F],
        message: `Match! F[${i}] = ${j + 1}. Incrementando i e j`
      });
      i++;
      j++;
    } else {
      // Mismatch
      steps.push({
        phase: 'preprocess',
        type: 'mismatch',
        i,
        j,
        comparing: true,
        match: false,
        failureTable: [...F],
        message: `Falha. P[${i}] ≠ P[${j}]`
      });

      if (j > 0) {
        const oldJ = j;
        j = F[j - 1];
        steps.push({
          phase: 'preprocess',
          type: 'use_failure',
          i,
          j,
          comparing: false,
          match: false,
          failureTable: [...F],
          message: `Usando F[${oldJ - 1}] = ${j}. j agora é ${j}`
        });
      } else {
        F[i] = 0;
        steps.push({
          phase: 'preprocess',
          type: 'base_case',
          i,
          j,
          comparing: false,
          match: false,
          failureTable: [...F],
          message: `j=0. F[${i}] = 0. Incrementando i`
        });
        i++;
      }
    }
  }

  steps.push({
    phase: 'preprocess',
    type: 'complete',
    i: m,
    j,
    comparing: false,
    match: null,
    failureTable: [...F],
    message: '✓ Função de falha calculada! Iniciando busca no texto...'
  });

  return { table: F, steps };
}

/**
 * Pure KMP search algorithm (without step generation).
 * 
 * @param text - The text to search in
 * @param pattern - The pattern to search for
 * @param failureTable - The precomputed failure function
 * @returns Index of match or -1 if not found
 */
export function kmpSearch(
  text: string,
  pattern: string,
  failureTable: number[]
): number {
  const n = text.length;
  const m = pattern.length;
  
  let i = 0;
  let j = 0;
  
  while (i < n && (i - j) <= n - m) {
    if (text[i] === pattern[j]) {
      if (j === m - 1) {
        // Pattern found
        return i - j;
      }
      i++;
      j++;
    } else {
      if (j > 0) {
        j = failureTable[j - 1];
      } else {
        i++;
      }
    }
  }
  
  return -1;
}
