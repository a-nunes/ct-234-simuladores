export type SortAlgorithm = 'bubble' | 'selection' | 'insertion';

export type ElementarySortStepType =
  | 'init'
  | 'compare'
  | 'swap'
  | 'shift'
  | 'insert'
  | 'update_min'
  | 'mark_sorted'
  | 'complete';

export interface ArrayPointer {
  index: number;
  label: string;
  type: 'primary' | 'secondary' | 'pivot' | 'min';
}

export interface ElementarySortStep {
  type: ElementarySortStepType;
  array: number[];
  comparing?: [number, number];
  swapping?: [number, number];
  shifting?: number;
  insertValue?: number;
  insertPosition?: number;
  pointers: ArrayPointer[];
  sortedIndices: number[];
  message: string;
  pseudocodeLine?: number;
  variables: Record<string, number | string>;
}

export interface ElementarySortConfig {
  algorithm: SortAlgorithm;
  array: number[];
}
