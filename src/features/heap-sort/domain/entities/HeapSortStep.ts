export type HeapSortPhase = 'build' | 'extract';

export type HeapSortStepType =
  | 'init'
  | 'start_build'
  | 'start_sift'
  | 'compare_children'
  | 'select_larger'
  | 'swap'
  | 'sift_complete'
  | 'build_complete'
  | 'start_extract'
  | 'extract_max'
  | 'reduce_heap'
  | 'complete';

export interface HeapNode {
  index: number;
  value: number;
  left?: number;
  right?: number;
  parent?: number;
}

export interface HeapPointer {
  index: number;
  label: string;
  type: 'current' | 'left' | 'right' | 'larger' | 'swap' | 'compare';
}

export interface HeapSortStep {
  type: HeapSortStepType;
  phase: HeapSortPhase;
  array: number[];
  heapSize: number;
  currentIndex?: number;
  leftChild?: number;
  rightChild?: number;
  largerChild?: number;
  swapping?: [number, number];
  pointers: HeapPointer[];
  sortedIndices: number[];
  highlightPath: number[];
  message: string;
  pseudocodeLine?: number;
  variables: Record<string, number | string>;
}

export interface HeapSortConfig {
  array: number[];
}
