import { SortingPointer, SortingStep } from '../types';
import { toSortingStep as toElementarySortingStep } from '@features/elementary-sort/presentation/mappers/toSortingStep';
import { HeapSortStep, HeapPointer } from '@features/heap-sort/domain/entities/HeapSortStep';
import { RadixSortStep, ArrayPointer as RadixPointer } from '@features/radix-sort/domain/entities/RadixSortStep';
import { DivideConquerSortStep, ArrayPointer as DividePointer } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';

export const mapElementaryStep = toElementarySortingStep;

const heapPointerTone: Record<HeapPointer['type'], SortingPointer['tone']> = {
  current: 'primary',
  left: 'secondary',
  right: 'secondary',
  larger: 'warn',
  swap: 'warn',
  compare: 'info'
};

export function mapHeapStep(step: HeapSortStep): SortingStep {
  const swapping = step.swapping ? [step.swapping[0], step.swapping[1]] : undefined;
  const inactive = step.heapSize >= 0 ? step.array.map((_, idx) => idx).filter(idx => idx >= step.heapSize) : undefined;

  return {
    array: step.array,
    message: step.message,
    pseudocodeLine: step.pseudocodeLine,
    sortedIndices: step.sortedIndices,
    comparing: step.highlightPath?.length ? step.highlightPath : undefined,
    swapping,
    secondary: step.largerChild !== undefined ? [step.largerChild] : undefined,
    pointers: step.pointers.map(pointer => ({
      index: pointer.index,
      label: pointer.label,
      tone: heapPointerTone[pointer.type]
    })),
    inactive: inactive && inactive.length ? inactive : undefined
  };
}

const radixPointerTone: Record<RadixPointer['type'], SortingPointer['tone']> = {
  current: 'primary',
  bucket: 'info',
  collected: 'secondary'
};

export function mapRadixStep(step: RadixSortStep): SortingStep {
  return {
    array: step.array,
    message: step.message,
    pseudocodeLine: step.pseudocodeLine,
    sortedIndices: step.sortedIndices,
    comparing: step.currentElementIndex !== undefined ? [step.currentElementIndex] : undefined,
    bucket: step.highlightedBucket !== undefined ? [step.highlightedBucket] : undefined,
    pointers: step.pointers.map(pointer => ({
      index: pointer.index,
      label: pointer.label,
      tone: radixPointerTone[pointer.type]
    })),
    auxiliary: step.buckets?.flatMap(b => b.elements)
  };
}

const dividePointerTone: Record<DividePointer['type'], SortingPointer['tone']> = {
  primary: 'primary',
  secondary: 'secondary',
  pivot: 'pivot',
  left: 'secondary',
  right: 'secondary',
  mid: 'info'
};

export function mapDivideConquerStep(step: DivideConquerSortStep): SortingStep {
  return {
    array: step.array,
    message: step.message,
    pseudocodeLine: step.pseudocodeLine,
    sortedIndices: step.sortedIndices,
    comparing: step.comparing ? [...step.comparing] : undefined,
    swapping: step.swapping ? [...step.swapping] : undefined,
    pivot: step.pivotIndex !== undefined ? [step.pivotIndex] : undefined,
    secondary: step.segments?.length ? step.segments.filter(s => s.type === 'current').map(s => s.start) : undefined,
    pointers: step.pointers.map(pointer => ({
      index: pointer.index,
      label: pointer.label,
      tone: dividePointerTone[pointer.type]
    })),
    auxiliary: step.auxiliaryArray
  };
}

