/**
 * Types of steps in the KMP algorithm execution.
 */
export type KMPStepType = 
  | 'init'
  | 'compare'
  | 'match'
  | 'mismatch'
  | 'use_failure'
  | 'base_case'
  | 'advance'
  | 'advance_i'
  | 'found'
  | 'not_found'
  | 'complete';

/**
 * Represents a single comparison during the search phase.
 */
export interface KMPComparison {
  index: number;      // Index in the pattern
  stepNumber: number; // Sequential comparison number
  match: boolean;     // Whether characters matched
}

/**
 * Step during the preprocessing phase (failure function calculation).
 */
export interface KMPPreprocessStep {
  phase: 'preprocess';
  type: KMPStepType;
  i: number;          // Suffix pointer
  j: number;          // Prefix pointer
  comparing: boolean;
  match: boolean | null;
  failureTable: number[];
  message: string;
}

/**
 * Step during the search phase.
 */
export interface KMPSearchStep {
  phase: 'search';
  type: KMPStepType;
  i: number;          // Text pointer
  j: number;          // Pattern pointer
  position: number;   // Pattern alignment position in text
  comparing: boolean;
  match: boolean | null;
  comparisonCount: number;
  message: string;
  found: boolean;
  usedFailure: boolean;
  failureValue?: number;
  comparisons: KMPComparison[];
}

/**
 * Union type for all KMP steps.
 */
export type KMPStep = KMPPreprocessStep | KMPSearchStep;

/**
 * Type guard to check if a step is a preprocess step.
 */
export function isPreprocessStep(step: KMPStep): step is KMPPreprocessStep {
  return step.phase === 'preprocess';
}

/**
 * Type guard to check if a step is a search step.
 */
export function isSearchStep(step: KMPStep): step is KMPSearchStep {
  return step.phase === 'search';
}
