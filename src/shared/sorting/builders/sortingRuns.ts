import { SortingAlgorithmKind, SortingRun, SortingStep } from '../types';
import { GenerateStepsUseCase } from '@features/elementary-sort/domain/usecases/GenerateSteps.usecase';
import { generateHeapSortSteps } from '@features/heap-sort/data/stepGenerators/HeapSortStepGenerator';
import { generateRadixSortSteps } from '@features/radix-sort/data/stepGenerators/RadixSortStepGenerator';
import { generateMergeSortSteps } from '@features/divide-conquer-sort/data/stepGenerators/MergeSortStepGenerator';
import { generateQuickSortSteps } from '@features/divide-conquer-sort/data/stepGenerators/QuickSortStepGenerator';
import { mapDivideConquerStep, mapElementaryStep, mapHeapStep, mapRadixStep } from '../mappers/toSortingSteps';
import { PSEUDOCODE_BY_ALGORITHM, COMPLEXITY_BY_ALGORITHM } from '../meta';

const elementaryUseCase = new GenerateStepsUseCase();

export interface BuildSortingRunParams {
  kind: SortingAlgorithmKind;
  array: number[];
  radixBase?: number;
}

export function buildSortingRun({ kind, array, radixBase = 10 }: BuildSortingRunParams): SortingRun {
  let steps: SortingStep[] = [];

  switch (kind) {
    case 'bubble':
    case 'selection':
    case 'insertion': {
      const elementarySteps = elementaryUseCase.execute({ array, algorithm: kind });
      steps = elementarySteps.map(mapElementaryStep);
      break;
    }
    case 'heap': {
      const heapSteps = generateHeapSortSteps(array);
      steps = heapSteps.map(mapHeapStep);
      break;
    }
    case 'radix': {
      const radixSteps = generateRadixSortSteps(array, radixBase);
      steps = radixSteps.map(mapRadixStep);
      break;
    }
    case 'merge': {
      const mergeSteps = generateMergeSortSteps(array);
      steps = mergeSteps.map(mapDivideConquerStep);
      break;
    }
    case 'quick': {
      const quickSteps = generateQuickSortSteps(array);
      steps = quickSteps.map(mapDivideConquerStep);
      break;
    }
    default:
      steps = [];
  }

  return {
    algorithm: kind,
    steps,
    pseudocode: PSEUDOCODE_BY_ALGORITHM[kind],
    complexity: COMPLEXITY_BY_ALGORITHM[kind]
  };
}

