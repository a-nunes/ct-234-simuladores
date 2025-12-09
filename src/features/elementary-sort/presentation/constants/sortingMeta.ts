import { SortingComplexity, SortingPseudocode } from '@shared/sorting/types';
import { BUBBLE_SORT_PSEUDOCODE } from '@features/elementary-sort/data/stepGenerators/BubbleSortStepGenerator';
import { SELECTION_SORT_PSEUDOCODE } from '@features/elementary-sort/data/stepGenerators/SelectionSortStepGenerator';
import { INSERTION_SORT_PSEUDOCODE } from '@features/elementary-sort/data/stepGenerators/InsertionSortStepGenerator';
import { SortAlgorithm } from '@features/elementary-sort/domain/entities/ElementarySortStep';

export const PSEUDOCODE_BY_ALGORITHM: Record<SortAlgorithm, SortingPseudocode> = {
  bubble: { title: 'Pseudocódigo: Bubble Sort', lines: BUBBLE_SORT_PSEUDOCODE },
  selection: { title: 'Pseudocódigo: Selection Sort', lines: SELECTION_SORT_PSEUDOCODE },
  insertion: { title: 'Pseudocódigo: Insertion Sort', lines: INSERTION_SORT_PSEUDOCODE }
};

export const COMPLEXITY_BY_ALGORITHM: Record<SortAlgorithm, SortingComplexity> = {
  bubble: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  selection: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  insertion: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
};

