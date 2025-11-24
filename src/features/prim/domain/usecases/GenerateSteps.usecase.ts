import { PrimConfig } from '@features/prim/domain/entities/PrimConfig';
import { PrimStep } from '@features/prim/domain/entities/PrimStep';
import { validateGraph } from '@features/prim/data/validators/GraphValidator';
import { validateRootNode } from '@features/prim/data/validators/RootNodeValidator';
import { generateSteps } from '@features/prim/data/stepGenerators/PrimStepGenerator';

/**
 * Use case for generating Prim visualization steps.
 * Orchestrates validation and step generation.
 */
export class GenerateStepsUseCase {
  /**
   * Executes the use case: validates input and generates steps.
   * @param config - Configuration with nodes, edges, and root node
   * @returns Array of visualization steps
   * @throws InvalidGraphError if graph is invalid
   * @throws InvalidRootNodeError if root node is invalid
   */
  execute(config: PrimConfig): PrimStep[] {
    // Validate inputs
    validateGraph(config.nodes, config.edges);
    validateRootNode(config.rootNode, config.nodes);

    // Generate steps
    return generateSteps(config.nodes, config.edges, config.rootNode);
  }
}

