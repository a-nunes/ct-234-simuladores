import { ElementarySortStep, ElementarySortConfig } from '@features/elementary-sort/domain/entities/ElementarySortStep';
import { validateArray } from '@features/elementary-sort/data/validators/ArrayValidator';
import { generateBubbleSortSteps } from '@features/elementary-sort/data/stepGenerators/BubbleSortStepGenerator';
import { generateSelectionSortSteps } from '@features/elementary-sort/data/stepGenerators/SelectionSortStepGenerator';
import { generateInsertionSortSteps } from '@features/elementary-sort/data/stepGenerators/InsertionSortStepGenerator';

/**
 * Use case for generating sorting visualization steps.
 * Orchestrates validation and step generation based on algorithm.
 */
export class GenerateStepsUseCase {
  execute(config: ElementarySortConfig): ElementarySortStep[] {
    // Validate input array
    validateArray(config.array);

    // Generate steps based on selected algorithm
    switch (config.algorithm) {
      case 'bubble':
        return generateBubbleSortSteps(config.array);
      case 'selection':
        return generateSelectionSortSteps(config.array);
      case 'insertion':
        return generateInsertionSortSteps(config.array);
      default:
        throw new Error(`Unknown algorithm: ${config.algorithm}`);
    }
  }
}
