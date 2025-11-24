import React, { useState, useCallback } from 'react';
import { PrimStep } from '@features/prim/domain/entities/PrimStep';
import { PrimConfig } from '@features/prim/domain/entities/PrimConfig';
import { GenerateStepsUseCase } from '@features/prim/domain/usecases/GenerateSteps.usecase';
import { Node } from '@features/prim/domain/entities/Node';
import { Edge } from '@features/prim/domain/entities/Edge';

export interface UseStepGeneratorProps {
  nodes: Node[];
  edges: Edge[];
  rootNode: number;
}

export interface UseStepGeneratorReturn {
  steps: PrimStep[];
  setSteps: React.Dispatch<React.SetStateAction<PrimStep[]>>;
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
  rootNode
}: UseStepGeneratorProps): UseStepGeneratorReturn {
  const [steps, setSteps] = useState<PrimStep[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateSteps = useCallback(() => {
    try {
      setIsGenerating(true);
      setError(null);

      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes,
        edges,
        rootNode
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
  }, [nodes, edges, rootNode]);

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

