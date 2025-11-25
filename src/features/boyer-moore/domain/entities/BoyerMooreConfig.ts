import { PatternMatchingConfig } from '@shared/pattern-matching';

/**
 * Configuration for Boyer-Moore algorithm.
 * Extends the base pattern matching config.
 */
export interface BoyerMooreConfig extends PatternMatchingConfig {}

export interface BadCharTable {
  [char: string]: number;
}
