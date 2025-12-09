import { ElementarySortStep } from '@features/elementary-sort/domain/entities/ElementarySortStep';
import { SortingStep } from '@shared/sorting/types';

const toneByPointerType: Record<string, NonNullable<SortingStep['pointers']>[number]['tone']> = {
  primary: 'primary',
  secondary: 'secondary',
  pivot: 'pivot',
  min: 'warn'
};

export function toSortingStep(step: ElementarySortStep): SortingStep {
  return {
    array: step.array,
    message: step.message,
    pseudocodeLine: step.pseudocodeLine,
    sortedIndices: step.sortedIndices,
    comparing: step.comparing ? [...step.comparing] : undefined,
    swapping: step.swapping ? [...step.swapping] : undefined,
    secondary: step.insertPosition !== undefined ? [step.insertPosition] : undefined,
    pivot: step.shifting !== undefined ? [step.shifting] : undefined,
    pointers: step.pointers.map(pointer => ({
      index: pointer.index,
      label: pointer.label,
      tone: toneByPointerType[pointer.type]
    }))
  };
}

