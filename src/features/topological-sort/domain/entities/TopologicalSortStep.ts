import { Node } from './Node';
import { Edge } from './Edge';

export type TopologicalSortStepType = 
  | 'init' 
  | 'calculate-indegree' 
  | 'enqueue-zero-indegree' 
  | 'dequeue' 
  | 'process-vertex' 
  | 'decrement-indegree' 
  | 'enqueue-new-zero' 
  | 'cycle-detected' 
  | 'final';

export interface TopologicalSortStep {
  type: TopologicalSortStepType;
  nodes: Node[];
  edges: Edge[];
  queue: number[]; // IDs dos vértices na fila/pilha
  indegree: Record<number, number>; // indegree por vértice
  topologicalOrder: number[]; // Ordem parcial
  counter: number;
  message: string;
  highlightedNode: number | null;
  highlightedEdge: { from: number; to: number } | null;
  dataStructure: 'queue' | 'stack'; // Qual estrutura está sendo usada
}








