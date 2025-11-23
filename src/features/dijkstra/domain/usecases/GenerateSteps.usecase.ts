import { DijkstraConfig } from '@features/dijkstra/domain/entities/DijkstraConfig';
import { DijkstraStep } from '@features/dijkstra/domain/entities/DijkstraStep';
import { validateGraph } from '@features/dijkstra/data/validators/GraphValidator';
import { validateSourceNode } from '@features/dijkstra/data/validators/SourceNodeValidator';
import { generateSteps } from '@features/dijkstra/data/stepGenerators/DijkstraStepGenerator';

/**
 * Use case for generating Dijkstra visualization steps.
 * Orchestrates validation and step generation.
 */
export class GenerateStepsUseCase {
  /**
   * Executes the use case: validates input and generates steps.
   * @param config - Configuration with nodes, edges, and source node
   * @returns Array of visualization steps
   * @throws InvalidGraphError if graph is invalid
   * @throws InvalidSourceNodeError if source node is invalid
   */
  execute(config: DijkstraConfig): DijkstraStep[] {
    // Validate inputs
    validateGraph(config.nodes, config.edges);
    validateSourceNode(config.sourceNode, config.nodes);

    // Generate steps
    return generateSteps(config.nodes, config.edges, config.sourceNode);
  }
}

