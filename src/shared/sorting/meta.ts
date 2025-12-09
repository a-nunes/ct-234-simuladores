import { SortingComplexity, SortingPseudocode } from './types';
import { BUBBLE_SORT_PSEUDOCODE } from '@features/elementary-sort/data/stepGenerators/BubbleSortStepGenerator';
import { SELECTION_SORT_PSEUDOCODE } from '@features/elementary-sort/data/stepGenerators/SelectionSortStepGenerator';
import { INSERTION_SORT_PSEUDOCODE } from '@features/elementary-sort/data/stepGenerators/InsertionSortStepGenerator';
import { HEAP_SORT_PSEUDOCODE } from '@features/heap-sort/data/stepGenerators/HeapSortStepGenerator';
import { RADIX_SORT_PSEUDOCODE } from '@features/radix-sort/data/stepGenerators/RadixSortStepGenerator';
import { MERGE_SORT_PSEUDOCODE } from '@features/divide-conquer-sort/data/stepGenerators/MergeSortStepGenerator';
import { QUICK_SORT_PSEUDOCODE } from '@features/divide-conquer-sort/data/stepGenerators/QuickSortStepGenerator';
import { SortingAlgorithmKind } from './types';

export const PSEUDOCODE_BY_ALGORITHM: Record<SortingAlgorithmKind, SortingPseudocode> = {
  bubble: { title: 'Bubble Sort', lines: BUBBLE_SORT_PSEUDOCODE },
  selection: { title: 'Selection Sort', lines: SELECTION_SORT_PSEUDOCODE },
  insertion: { title: 'Insertion Sort', lines: INSERTION_SORT_PSEUDOCODE },
  heap: { title: 'Heap Sort', lines: HEAP_SORT_PSEUDOCODE },
  radix: { title: 'Radix Sort (LSD)', lines: RADIX_SORT_PSEUDOCODE },
  merge: { title: 'Merge Sort', lines: MERGE_SORT_PSEUDOCODE },
  quick: { title: 'Quick Sort', lines: QUICK_SORT_PSEUDOCODE }
};

export const COMPLEXITY_BY_ALGORITHM: Record<SortingAlgorithmKind, SortingComplexity> = {
  bubble: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  selection: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  insertion: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  heap: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
  radix: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)', space: 'O(n + k)' },
  merge: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  quick: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' }
};

