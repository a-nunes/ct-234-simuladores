import { BoyerMooreStep, Comparison } from '@features/boyer-moore/domain/entities/BoyerMooreStep';
import { BadCharTable } from '@features/boyer-moore/domain/entities/BoyerMooreConfig';
import { calculateBadCharShift } from '@features/boyer-moore/data/algorithms/BoyerMooreAlgorithm';

/**
 * Generates step-by-step execution of the Boyer-Moore algorithm.
 * @param text - The text to search in
 * @param pattern - The pattern to search for
 * @param lastOcc - Last occurrence table
 * @returns Array of steps for visualization
 */
export function generateSteps(
  text: string,
  pattern: string,
  lastOcc: BadCharTable
): BoyerMooreStep[] {
  const n = text.length;
  const m = pattern.length;
  const steps: BoyerMooreStep[] = [];
  let comparisonCount = 0;

  let i = 0;
  let patternFound = false;

  while (i <= n - m) {
    let j = m - 1;
    const comparisons: Comparison[] = [];

    // Compare from right to left until mismatch or full match
    while (j >= 0 && pattern[j] === text[i + j]) {
      comparisonCount++;
      comparisons.push({
        index: j,
        absIndex: i + j,
        stepNumber: comparisonCount,
        match: true
      });
      j--;
    }

    // If there's a mismatch, record it
    if (j >= 0) {
      comparisonCount++;
      comparisons.push({
        index: j,
        absIndex: i + j,
        stepNumber: comparisonCount,
        match: false
      });
    }

    if (j < 0) {
      // Pattern found
      steps.push({
        type: 'found',
        position: i,
        comparisons,
        comparisonCount,
        mismatchChar: null,
        mismatchIndex: j,
        shift: 0,
        shiftReason: 'Padrão encontrado!',
        found: true
      });
      patternFound = true;
      break;
    } else {
      // Mismatch - calculate shift
      const mismatchChar = text[i + j];
      const occIndex = lastOcc[mismatchChar];
      const badCharShift = calculateBadCharShift(j, mismatchChar, lastOcc);
      
      const shiftReason = `Bad Character: L('${mismatchChar}') = ${occIndex !== undefined ? occIndex : -1}. Deslocamento = ${badCharShift}`;

      steps.push({
        type: 'mismatch',
        position: i,
        comparisons,
        comparisonCount,
        mismatchChar,
        mismatchIndex: j,
        shift: badCharShift,
        shiftReason,
        badCharShift,
        lastOccValue: occIndex,
        found: false
      });

      i += badCharShift;
    }
  }

  // Add end message if pattern not found
  if (!patternFound && steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    steps[steps.length - 1] = {
      ...lastStep,
      shiftReason: lastStep.shiftReason + ' → Fim do texto alcançado (padrão não encontrado)'
    };
  }

  return steps;
}
