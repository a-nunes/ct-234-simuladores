import React, { useState, useCallback } from 'react';
import { DijkstraStep } from '@features/dijkstra/domain/entities/DijkstraStep';
import { DijkstraConfig } from '@features/dijkstra/domain/entities/DijkstraConfig';
import { GenerateStepsUseCase } from '@features/dijkstra/domain/usecases/GenerateSteps.usecase';
import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';

export interface UseStepGeneratorProps {
  nodes: Node[];
  edges: Edge[];
  sourceNode: number;
}

export interface UseStepGeneratorReturn {
  steps: DijkstraStep[];
  setSteps: React.Dispatch<React.SetStateAction<DijkstraStep[]>>;
  generateSteps: () => void;
  clearSteps: () => void;
  error: Error | null;
  isGenerating: boolean;
}

/**
 * Hook for generating steps using the use case.
 * Handles step generation and error handling.
 */
export function useStepGenerator({
  nodes,
  edges,
  sourceNode
}: UseStepGeneratorProps): UseStepGeneratorReturn {
  const [steps, setSteps] = useState<DijkstraStep[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateSteps = useCallback(() => {
    try {
      setIsGenerating(true);
      setError(null);

      const useCase = new GenerateStepsUseCase();
      const config: DijkstraConfig = {
        nodes,
        edges,
        sourceNode
      };

      const generatedSteps = useCase.execute(config);
      setSteps(generatedSteps);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao gerar steps');
      setError(error);
      setSteps([]);
    } finally {
      setIsGenerating(false);
    }
  }, [nodes, edges, sourceNode]);

  const clearSteps = useCallback(() => {
    setSteps([]);
    setError(null);
  }, []);

  return {
    steps,
    setSteps,
    generateSteps,
    clearSteps,
    error,
    isGenerating
  };
}

