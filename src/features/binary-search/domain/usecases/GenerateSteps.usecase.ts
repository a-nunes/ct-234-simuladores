import { BinarySearchConfig } from '@features/binary-search/domain/entities/BinarySearchConfig';
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';
import { validateArray, validateSearchValue } from '@features/binary-search/data/validators/ArrayValidator';
import { generateSteps } from '@features/binary-search/data/stepGenerators/BinarySearchStepGenerator';

/**
 * Use case for generating binary search visualization steps.
 * Orchestrates validation and step generation.
 */
export class GenerateStepsUseCase {
  /**
   * Executes the use case: validates input and generates steps.
   * @param config - Configuration with array and search value
   * @returns Array of visualization steps
   * @throws InvalidArrayError if array is invalid
   * @throws InvalidSearchValueError if search value is invalid
   */
  execute(config: BinarySearchConfig): BinarySearchStep[] {
    // Validate inputs
    validateArray(config.array);
    validateSearchValue(config.searchValue);

    // Generate steps
    return generateSteps(config.array, config.searchValue);
  }
}

