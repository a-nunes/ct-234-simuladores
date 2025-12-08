import { AFTable } from './AFTable';
import { AutomatonStepType } from './AutomatonStepType';

/**
 * Represents the current position in the AF table being calculated.
 */
export interface AFCellPosition {
  /** Current state (row in AF table), range: 0 to m */
  s: number;
  /** Current alphabet index (column in AF table), range: 0 to |Σ|-1 */
  x: number;
}

/**
 * Represents a single step during the finite automaton construction.
 *
 * Each step captures the state of the algorithm as it calculates
 * the transition function AF[s, x] using the suffix matching approach.
 *
 * The algorithm for each cell:
 * 1. Compute test string: P_s + x (prefix of length s concatenated with character x)
 * 2. Find largest k where P_k is suffix of test string
 * 3. Set AF[s, x] = k
 */
export interface AutomatonStep {
  /** Current position in the AF table */
  position: AFCellPosition;

  /** Current candidate k value being tested (0 to min(s+1, m)) */
  k: number;

  /** Type of the current step in the algorithm */
  type: AutomatonStepType;

  /**
   * Test string being analyzed: P_s + character
   * Example: For s=2 with pattern "aba" and char 'b', testString = "ab" + "b" = "abb"
   */
  testString: string;

  /**
   * Current candidate prefix P_k being checked as suffix
   * Example: For k=2 with pattern "aba", candidatePrefix = "ab"
   * Empty string (ε) when k=0
   */
  candidatePrefix: string;

  /**
   * Result of suffix match test:
   * - true: candidatePrefix is a suffix of testString
   * - false: candidatePrefix is not a suffix of testString
   * - null: not yet tested
   */
  isMatch: boolean | null;

  /** Current state of the AF table (snapshot) */
  af: AFTable;

  /** Explanatory message for this step */
  message: string;
}
