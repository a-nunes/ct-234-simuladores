import { KMPConfig } from '@features/kmp/domain/entities/KMPConfig';
import { KMPStep } from '@features/kmp/domain/entities/KMPStep';
import { validateInput } from '@shared/pattern-matching';
import { buildFailureFunction } from '@features/kmp/data/algorithms/KMPAlgorithm';
import { generateSearchSteps } from '@features/kmp/data/stepGenerators/KMPStepGenerator';

export interface GenerateStepsResult {
  steps: KMPStep[];
  failureTable: number[];
}

/**
 * Use case for generating KMP algorithm steps.
 * Orchestrates validation, failure function building, and step generation.
 */
export class GenerateStepsUseCase {
  execute(config: KMPConfig): GenerateStepsResult {
    // Validate input using shared validator
    validateInput(config);
    
    // Generate preprocessing steps and get failure table
    const { table: failureTable, steps: preprocessSteps } = buildFailureFunction(config.pattern);
    
    // Generate search steps
    const searchSteps = generateSearchSteps(config.text, config.pattern, failureTable);
    
    // Combine all steps
    const steps: KMPStep[] = [...preprocessSteps, ...searchSteps];
    
    return {
      steps,
      failureTable
    };
  }
}
