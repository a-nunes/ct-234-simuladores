export type SortingAlgorithmKind =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'heap'
  | 'radix'
  | 'merge'
  | 'quick';

export interface SortingPseudocode {
  title: string;
  lines: string[];
}

export interface SortingComplexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface SortingPointer {
  index: number;
  label: string;
  tone?: 'primary' | 'secondary' | 'info' | 'warn' | 'pivot';
}

export interface SortingStep {
  array: number[];
  message?: string;
  pseudocodeLine?: number;
  sortedIndices?: number[];
  comparing?: number[];
  swapping?: number[];
  pivot?: number[];
  secondary?: number[];
  bucket?: number[];
  inactive?: number[];
  pointers?: SortingPointer[];
  auxiliary?: number[];
}

export interface SortingRun {
  algorithm: SortingAlgorithmKind;
  steps: SortingStep[];
  pseudocode: SortingPseudocode;
  complexity: SortingComplexity;
}

