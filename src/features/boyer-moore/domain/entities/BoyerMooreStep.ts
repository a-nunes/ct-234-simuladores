export type BoyerMooreStepType = 
  | 'init'
  | 'comparing'
  | 'match'
  | 'mismatch'
  | 'shift'
  | 'found'
  | 'not_found';

export interface Comparison {
  index: number;        // Index in the pattern
  absIndex: number;     // Absolute index in the text
  stepNumber: number;   // Sequential comparison number
  match: boolean;       // Whether characters matched
}

export interface BoyerMooreStep {
  type: BoyerMooreStepType;
  position: number;     // Pattern position in text
  comparisons: Comparison[];
  comparisonCount: number;
  mismatchChar: string | null;
  mismatchIndex: number;
  shift: number;
  shiftReason: string;
  badCharShift?: number;
  lastOccValue?: number;
  found: boolean;
}
