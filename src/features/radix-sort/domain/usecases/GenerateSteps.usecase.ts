import { RadixSortStep, RadixSortConfig } from '@features/radix-sort/domain/entities/RadixSortStep';
import { validateArray } from '@features/radix-sort/data/validators/ArrayValidator';
import { generateRadixSortSteps } from '@features/radix-sort/data/stepGenerators/RadixSortStepGenerator';

/**
 * Use case for generating Radix Sort visualization steps.
 * Orchestrates validation and step generation.
 */
export class GenerateStepsUseCase {
  execute(config: RadixSortConfig): RadixSortStep[] {
    // Validate input array
    validateArray(config.array);

    // Generate steps for radix sort
    return generateRadixSortSteps(config.array, config.base);
  }
}
