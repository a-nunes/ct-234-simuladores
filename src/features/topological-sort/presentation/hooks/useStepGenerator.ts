import React, { useState, useCallback } from 'react';
import { TopologicalSortStep } from '@features/topological-sort/domain/entities/TopologicalSortStep';
import { TopologicalSortConfig } from '@features/topological-sort/domain/entities/TopologicalSortConfig';
import { GenerateStepsUseCase } from '@features/topological-sort/domain/usecases/GenerateSteps.usecase';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';

export interface UseStepGeneratorProps {
  nodes: Node[];
  edges: Edge[];
  dataStructure: 'queue' | 'stack';
}

export interface UseStepGeneratorReturn {
  steps: TopologicalSortStep[];
  setSteps: React.Dispatch<React.SetStateAction<TopologicalSortStep[]>>;
  generateSteps: () => void;
  clearSteps: () => void;
  updateNodePositions: (newNodes: Node[]) => void;
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
  dataStructure
}: UseStepGeneratorProps): UseStepGeneratorReturn {
  const [steps, setSteps] = useState<TopologicalSortStep[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateSteps = useCallback(() => {
    try {
      setIsGenerating(true);
      setError(null);

      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes,
        edges,
        dataStructure
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
  }, [nodes, edges, dataStructure]);

  const clearSteps = useCallback(() => {
    setSteps([]);
    setError(null);
  }, []);

  const updateNodePositions = useCallback((newNodes: Node[]) => {
    setSteps(prevSteps =>
      prevSteps.map(step => ({
        ...step,
        nodes: step.nodes.map(node => {
          const updatedNode = newNodes.find(n => n.id === node.id);
          return updatedNode ? { ...node, x: updatedNode.x, y: updatedNode.y } : node;
        })
      }))
    );
  }, []);

  return {
    steps,
    setSteps,
    generateSteps,
    clearSteps,
    updateNodePositions,
    error,
    isGenerating
  };
}

