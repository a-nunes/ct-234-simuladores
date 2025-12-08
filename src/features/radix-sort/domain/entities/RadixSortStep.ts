export type RadixSortStepType =
  | 'init'
  | 'select_digit'
  | 'distribute'
  | 'collect'
  | 'complete';

export interface Bucket {
  digit: number;
  elements: number[];
}

export interface ArrayPointer {
  index: number;
  label: string;
  type: 'current' | 'bucket' | 'collected';
}

export interface RadixSortStep {
  type: RadixSortStepType;
  array: number[];
  buckets: Bucket[];
  currentDigitPosition: number;
  currentDigitFactor: number;
  currentElementIndex?: number;
  currentElement?: number;
  currentDigit?: number;
  highlightedBucket?: number;
  pointers: ArrayPointer[];
  sortedIndices: number[];
  message: string;
  pseudocodeLine?: number;
  variables: Record<string, number | string>;
}

export interface RadixSortConfig {
  array: number[];
  base: number;
}
