import { KruskalConfig } from '@features/kruskal/domain/entities/KruskalConfig';
import { KruskalStep } from '@features/kruskal/domain/entities/KruskalStep';
import { validateGraph } from '@features/kruskal/data/validators/GraphValidator';
import { generateSteps } from '@features/kruskal/data/stepGenerators/KruskalStepGenerator';

/**
 * Use case for generating Kruskal visualization steps.
 * Orchestrates validation and step generation.
 */
export class GenerateStepsUseCase {
  /**
   * Executes the use case: validates input and generates steps.
   * @param config - Configuration with nodes and edges
   * @returns Array of visualization steps
   * @throws InvalidGraphError if graph is invalid
   */
  execute(config: KruskalConfig): KruskalStep[] {
    // Validate inputs
    validateGraph(config.nodes, config.edges);

    // Generate steps
    return generateSteps(config.nodes, config.edges);
  }
}

