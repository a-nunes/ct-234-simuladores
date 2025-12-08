import { LCSConfig } from '@features/lcs/domain/entities/LCSConfig';
import { LCSStep } from '@features/lcs/domain/entities/LCSStep';
import { validateLCSConfig } from '@features/lcs/data/validators/LCSValidator';
import { generateSteps } from '@features/lcs/data/stepGenerators/LCSStepGenerator';

/**
 * Use case for generating LCS visualization steps.
 * Orchestrates validation and step generation.
 */
export class GenerateStepsUseCase {
  /**
   * Executes the use case: validates input and generates steps.
   * @param config - Configuration with strings X and Y
   * @returns Array of visualization steps
   * @throws InvalidLCSStringError if input is invalid
   */
  execute(config: LCSConfig): LCSStep[] {
    // Validate inputs
    validateLCSConfig(config);

    // Generate steps
    return generateSteps(config);
  }
}


