export type DivideConquerAlgorithm = 'merge' | 'quick';

export type DivideConquerStepType =
  | 'init'
  | 'divide'
  | 'recursive_call'
  | 'compare'
  | 'copy_to_aux'
  | 'merge_back'
  | 'partition_start'
  | 'pivot_select'
  | 'pointer_move'
  | 'swap'
  | 'pivot_place'
  | 'mark_sorted'
  | 'complete';

export interface ArrayPointer {
  index: number;
  label: string;
  type: 'primary' | 'secondary' | 'pivot' | 'left' | 'right' | 'mid';
}

export interface RecursionLevel {
  depth: number;
  left: number;
  right: number;
  description: string;
}

export interface ArraySegment {
  start: number;
  end: number;
  type: 'left' | 'right' | 'merged' | 'current';
}

export interface DivideConquerSortStep {
  type: DivideConquerStepType;
  array: number[];
  auxiliaryArray?: number[];
  comparing?: [number, number];
  swapping?: [number, number];
  pointers: ArrayPointer[];
  sortedIndices: number[];
  segments: ArraySegment[];
  recursionStack: RecursionLevel[];
  currentRecursionDepth: number;
  pivotIndex?: number;
  pivotValue?: number;
  message: string;
  pseudocodeLine?: number;
  variables: Record<string, number | string>;
}

export interface DivideConquerSortConfig {
  algorithm: DivideConquerAlgorithm;
  array: number[];
}
