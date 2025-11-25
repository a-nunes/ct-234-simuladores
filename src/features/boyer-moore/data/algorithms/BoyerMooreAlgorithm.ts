import { BadCharTable } from '@features/boyer-moore/domain/entities/BoyerMooreConfig';

/**
 * Builds the Last Occurrence table (L(x)) for the Boyer-Moore algorithm.
 * For each character in the pattern, stores the index of its last occurrence.
 * @param pattern - The pattern string
 * @returns Table mapping characters to their last occurrence index
 */
export function buildLastOccurrence(pattern: string): BadCharTable {
  const table: BadCharTable = {};
  for (let i = 0; i < pattern.length; i++) {
    table[pattern[i]] = i;
  }
  return table;
}

/**
 * Calculates the shift amount using the Bad Character rule.
 * @param mismatchIndex - Index in pattern where mismatch occurred
 * @param mismatchChar - Character in text that caused mismatch
 * @param lastOcc - Last occurrence table
 * @returns The shift amount
 */
export function calculateBadCharShift(
  mismatchIndex: number,
  mismatchChar: string,
  lastOcc: BadCharTable
): number {
  const occIndex = lastOcc[mismatchChar];
  
  if (occIndex !== undefined) {
    return Math.max(1, mismatchIndex - occIndex);
  }
  
  return mismatchIndex + 1;
}

/**
 * Pure Boyer-Moore search algorithm.
 * @param text - The text to search in
 * @param pattern - The pattern to search for
 * @param lastOcc - Last occurrence table
 * @returns Index of match or -1 if not found
 */
export function boyerMooreSearch(
  text: string,
  pattern: string,
  lastOcc: BadCharTable
): number {
  const n = text.length;
  const m = pattern.length;
  
  let i = 0;
  
  while (i <= n - m) {
    let j = m - 1;
    
    // Compare from right to left
    while (j >= 0 && pattern[j] === text[i + j]) {
      j--;
    }
    
    if (j < 0) {
      // Pattern found
      return i;
    }
    
    // Calculate shift using bad character rule
    const shift = calculateBadCharShift(j, text[i + j], lastOcc);
    i += shift;
  }
  
  return -1;
}
