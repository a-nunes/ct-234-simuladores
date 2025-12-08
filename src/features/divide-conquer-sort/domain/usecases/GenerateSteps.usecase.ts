import { DivideConquerSortStep, DivideConquerSortConfig } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';
import { validateArray } from '@features/divide-conquer-sort/data/validators/ArrayValidator';
import { generateMergeSortSteps } from '@features/divide-conquer-sort/data/stepGenerators/MergeSortStepGenerator';
import { generateQuickSortSteps } from '@features/divide-conquer-sort/data/stepGenerators/QuickSortStepGenerator';

/**
 * Use case for generating divide and conquer sorting visualization steps.
 * Orchestrates validation and step generation based on algorithm.
 */
export class GenerateStepsUseCase {
  execute(config: DivideConquerSortConfig): DivideConquerSortStep[] {
    // Validate input array
    validateArray(config.array);

    // Generate steps based on selected algorithm
    switch (config.algorithm) {
      case 'merge':
        return generateMergeSortSteps(config.array);
      case 'quick':
        return generateQuickSortSteps(config.array);
      default:
        throw new Error(`Unknown algorithm: ${config.algorithm}`);
    }
  }
}
