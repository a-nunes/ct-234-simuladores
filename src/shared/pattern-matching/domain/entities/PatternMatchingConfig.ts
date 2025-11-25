/**
 * Base configuration interface for pattern matching algorithms.
 * Used by KMP, Boyer-Moore, and other string matching algorithms.
 */
export interface PatternMatchingConfig {
  text: string;
  pattern: string;
}
