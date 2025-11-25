import { KMPSearchStep, KMPComparison, KMPPreprocessStep } from '@features/kmp/domain/entities/KMPStep';

interface ComparisonRecord {
  position: number;
  index: number;
  stepNumber: number;
  match: boolean;
}

/**
 * Generates preprocessing steps for the failure function calculation.
 * Note: This is handled by buildFailureFunction in KMPAlgorithm.ts
 * This function is here for interface compatibility.
 * 
 * @param pattern - The pattern string
 * @returns Array of preprocessing steps
 */
export function generatePreprocessSteps(pattern: string): KMPPreprocessStep[] {
  // This is handled by buildFailureFunction in KMPAlgorithm.ts
  // which returns both the table and steps
  throw new Error('Use buildFailureFunction from KMPAlgorithm.ts instead');
}

/**
 * Generates step-by-step execution of the KMP search phase.
 * 
 * @param text - The text to search in
 * @param pattern - The pattern to search for
 * @param failureTable - The precomputed failure function
 * @returns Array of search steps for visualization
 */
export function generateSearchSteps(
  text: string,
  pattern: string,
  failureTable: number[]
): KMPSearchStep[] {
  const n = text.length;
  const m = pattern.length;
  const steps: KMPSearchStep[] = [];
  let comparisonCount = 0;
  let i = 0;
  let j = 0;
  
  // Track ALL comparisons globally (accumulates and never clears)
  const allComparisons: ComparisonRecord[] = [];

  // Initial step
  steps.push({
    phase: 'search',
    type: 'init',
    i: 0,
    j: 0,
    position: 0,
    comparing: false,
    match: null,
    comparisonCount: 0,
    message: 'Iniciando busca. i=0, j=0',
    found: false,
    usedFailure: false,
    comparisons: []
  });

  while (i < n && (i - j) <= n - m) {
    // Comparison
    comparisonCount++;
    const isMatch = text[i] === pattern[j];
    const currentPosition = i - j;
    
    // Add this comparison to GLOBAL history (never clears)
    allComparisons.push({
      position: currentPosition,
      index: j,
      stepNumber: comparisonCount,
      match: isMatch
    });
    
    // Filter only comparisons from current position for display
    const currentPositionComparisons: KMPComparison[] = allComparisons
      .filter(c => c.position === currentPosition)
      .map(c => ({ index: c.index, stepNumber: c.stepNumber, match: c.match }));
    
    steps.push({
      phase: 'search',
      type: 'compare',
      i,
      j,
      position: currentPosition,
      comparing: true,
      match: isMatch,
      comparisonCount,
      message: `Passo ${comparisonCount}: Comparando T[${i}]='${text[i]}' com P[${j}]='${pattern[j]}'`,
      found: false,
      usedFailure: false,
      comparisons: [...currentPositionComparisons]
    });

    if (isMatch) {
      if (j === m - 1) {
        // Pattern found!
        steps.push({
          phase: 'search',
          type: 'found',
          i,
          j,
          position: currentPosition,
          comparing: true,
          match: true,
          comparisonCount,
          message: `✓ PADRÃO ENCONTRADO na posição ${currentPosition + 1}! Total de comparações: ${comparisonCount}`,
          found: true,
          usedFailure: false,
          comparisons: [...currentPositionComparisons]
        });
        break;
      } else {
        // Match, continue
        i++;
        j++;
        const nextPositionComparisons: KMPComparison[] = allComparisons
          .filter(c => c.position === i - j)
          .map(c => ({ index: c.index, stepNumber: c.stepNumber, match: c.match }));
        steps.push({
          phase: 'search',
          type: 'advance',
          i,
          j,
          position: i - j,
          comparing: false,
          match: true,
          comparisonCount,
          message: `Match! Avançando: i=${i}, j=${j}`,
          found: false,
          usedFailure: false,
          comparisons: [...nextPositionComparisons]
        });
      }
    } else {
      // Mismatch
      if (j > 0) {
        const failureValue = failureTable[j - 1];
        const oldJ = j;
        j = failureValue;
        const newPositionComparisons: KMPComparison[] = allComparisons
          .filter(c => c.position === i - j)
          .map(c => ({ index: c.index, stepNumber: c.stepNumber, match: c.match }));
        steps.push({
          phase: 'search',
          type: 'use_failure',
          i,
          j,
          position: i - j,
          comparing: false,
          match: false,
          comparisonCount,
          message: `Falha. Usando F[${oldJ - 1}] = ${failureValue}. Deslocando padrão, j=${j}`,
          found: false,
          usedFailure: true,
          failureValue,
          comparisons: [...newPositionComparisons]
        });
      } else {
        // j = 0, advance only i
        i++;
        const nextPositionComparisons: KMPComparison[] = allComparisons
          .filter(c => c.position === i - j)
          .map(c => ({ index: c.index, stepNumber: c.stepNumber, match: c.match }));
        steps.push({
          phase: 'search',
          type: 'advance_i',
          i,
          j,
          position: i - j,
          comparing: false,
          match: false,
          comparisonCount,
          message: `Falha em j=0. Avançando texto: i=${i}`,
          found: false,
          usedFailure: false,
          comparisons: [...nextPositionComparisons]
        });
      }
    }
  }

  // Check if we reached end of text without finding
  const lastStep = steps[steps.length - 1];
  if (i >= n && !lastStep.found) {
    steps.push({
      phase: 'search',
      type: 'not_found',
      i,
      j,
      position: i - j,
      comparing: false,
      match: null,
      comparisonCount,
      message: `Fim do texto alcançado. Padrão não encontrado. Total de comparações: ${comparisonCount}`,
      found: false,
      usedFailure: false,
      comparisons: []
    });
  }

  return steps;
}
