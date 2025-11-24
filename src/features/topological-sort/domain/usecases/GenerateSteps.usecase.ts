import { TopologicalSortConfig } from '@features/topological-sort/domain/entities/TopologicalSortConfig';
import { TopologicalSortStep } from '@features/topological-sort/domain/entities/TopologicalSortStep';
import { validateGraph } from '@features/topological-sort/data/validators/GraphValidator';
import { generateSteps } from '@features/topological-sort/data/stepGenerators/TopologicalSortStepGenerator';

/**
 * Use case for generating topological sort visualization steps.
 * Orchestrates validation and step generation.
 */
export class GenerateStepsUseCase {
  /**
   * Executes the use case: validates input and generates steps.
   * @param config - Configuration with nodes, edges, and data structure (queue/stack)
   * @returns Array of visualization steps
   * @throws InvalidGraphError if graph is invalid
   */
  execute(config: TopologicalSortConfig): TopologicalSortStep[] {
    // Validate inputs
    validateGraph(config.nodes, config.edges);

    // Generate steps
    return generateSteps(
      config.nodes,
      config.edges,
      config.dataStructure === 'stack'
    );
  }
}

