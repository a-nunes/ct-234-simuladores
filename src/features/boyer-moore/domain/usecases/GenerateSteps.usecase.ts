import { BoyerMooreConfig, BadCharTable } from '@features/boyer-moore/domain/entities/BoyerMooreConfig';
import { BoyerMooreStep } from '@features/boyer-moore/domain/entities/BoyerMooreStep';
import { validateInput } from '@features/boyer-moore/data/validators/InputValidator';
import { generateSteps } from '@features/boyer-moore/data/stepGenerators/BoyerMooreStepGenerator';
import { buildLastOccurrence } from '@features/boyer-moore/data/algorithms/BoyerMooreAlgorithm';

export interface GenerateStepsResult {
  steps: BoyerMooreStep[];
  badCharTable: BadCharTable;
}

export class GenerateStepsUseCase {
  execute(config: BoyerMooreConfig): GenerateStepsResult {
    // Validate input
    validateInput(config);
    
    // Build the bad character table
    const badCharTable = buildLastOccurrence(config.pattern);
    
    // Generate steps
    const steps = generateSteps(config.text, config.pattern, badCharTable);
    
    return {
      steps,
      badCharTable
    };
  }
}
