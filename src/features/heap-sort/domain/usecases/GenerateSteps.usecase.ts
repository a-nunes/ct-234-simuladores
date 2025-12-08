import { HeapSortStep, HeapSortConfig } from '@features/heap-sort/domain/entities/HeapSortStep';
import { validateArray } from '@features/heap-sort/data/validators/ArrayValidator';
import { generateHeapSortSteps } from '@features/heap-sort/data/stepGenerators/HeapSortStepGenerator';

/**
 * Use case for generating Heap Sort visualization steps.
 * Orchestrates validation and step generation.
 */
export class GenerateStepsUseCase {
  execute(config: HeapSortConfig): HeapSortStep[] {
    // Validate input array
    validateArray(config.array);

    // Generate steps
    return generateHeapSortSteps(config.array);
  }
}
