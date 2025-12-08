import { AFTable } from '@features/automaton/domain/entities/AFTable';

/**
 * Gets the prefix of the pattern with the specified length.
 * 
 * @param pattern - The pattern string
 * @param length - The length of the prefix (0 to pattern.length)
 * @returns The prefix string, or empty string if length is 0
 * 
 * @example
 * getPrefix("ababaca", 3) // returns "aba"
 * getPrefix("ababaca", 0) // returns ""
 */
export function getPrefix(pattern: string, length: number): string {
  if (length <= 0) return '';
  return pattern.substring(0, length);
}

/**
 * Checks if a prefix is a suffix of the given string.
 * Empty string is considered a suffix of any string.
 * 
 * @param prefix - The prefix to check (can be empty string)
 * @param str - The string to check against
 * @returns true if prefix is a suffix of str
 * 
 * @example
 * isSuffix("ab", "abab")  // returns true ("ab" ends with "ab")
 * isSuffix("ba", "abab")  // returns false
 * isSuffix("", "anything") // returns true (empty is always suffix)
 */
export function isSuffix(prefix: string, str: string): boolean {
  if (prefix === '') return true;
  if (prefix.length > str.length) return false;
  return str.endsWith(prefix);
}

/**
 * Calculates the transition value for a single cell AF[state, character].
 * 
 * This finds the largest k (0 ≤ k ≤ min(state+1, m)) such that
 * P_k (prefix of length k) is a suffix of (P_state + character).
 * 
 * @param pattern - The pattern string
 * @param state - Current state (0 to m)
 * @param character - The input character
 * @returns The next state value
 * 
 * @example
 * // For pattern "aba" at state 2 with character 'b':
 * // Test string is "ab" + "b" = "abb"
 * // Check k=3: "aba" suffix of "abb"? No
 * // Check k=2: "ab" suffix of "abb"? No
 * // Check k=1: "a" suffix of "abb"? No
 * // Check k=0: "" suffix of "abb"? Yes → returns 0
 * calculateTransition("aba", 2, 'b') // returns 0
 */
export function calculateTransition(
  pattern: string,
  state: number,
  character: string
): number {
  const m = pattern.length;
  const prefix = getPrefix(pattern, state);
  const testString = prefix + character;
  
  // Start from the maximum possible k and decrement until we find a suffix match
  let k = Math.min(state + 1, m);
  
  while (k >= 0) {
    const candidatePrefix = getPrefix(pattern, k);
    if (isSuffix(candidatePrefix, testString)) {
      return k;
    }
    k--;
  }
  
  // Should never reach here since empty prefix is always a suffix
  return 0;
}

/**
 * Builds the complete automaton transition table for a pattern and alphabet.
 * 
 * The table has (m + 1) rows (states 0 to m) and |Σ| columns (one per character).
 * Each cell AF[s][x] contains the next state when reading character x in state s.
 * 
 * @param pattern - The pattern to build the automaton for
 * @param alphabet - The alphabet of valid characters
 * @returns The complete transition table
 * 
 * @example
 * const af = buildAutomaton("ab", ['a', 'b']);
 * // Returns:
 * // [
 * //   { 'a': 1, 'b': 0 },  // state 0
 * //   { 'a': 1, 'b': 2 },  // state 1
 * //   { 'a': 1, 'b': 0 },  // state 2 (accepting)
 * // ]
 */
export function buildAutomaton(pattern: string, alphabet: string[]): AFTable {
  const m = pattern.length;
  const af: AFTable = [];
  
  for (let state = 0; state <= m; state++) {
    af[state] = {};
    for (const char of alphabet) {
      af[state][char] = calculateTransition(pattern, state, char);
    }
  }
  
  return af;
}

/**
 * Creates an empty (uninitialized) automaton transition table.
 * All cells are set to null, indicating they haven't been calculated yet.
 * 
 * @param patternLength - Length of the pattern (m)
 * @param alphabet - The alphabet of valid characters
 * @returns Empty transition table with null values
 */
export function createEmptyAutomaton(
  patternLength: number,
  alphabet: string[]
): AFTable {
  const af: AFTable = [];
  
  for (let state = 0; state <= patternLength; state++) {
    af[state] = {};
    for (const char of alphabet) {
      af[state][char] = null;
    }
  }
  
  return af;
}
