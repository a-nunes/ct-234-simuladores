import { Node } from './Node';
import { Edge } from './Edge';
import { UnionFindState } from './UnionFindState';

export type KruskalStepType = 
  | 'init' 
  | 'sort' 
  | 'evaluate' 
  | 'accept' 
  | 'reject' 
  | 'final';

export interface SortedEdge {
  from: number;
  to: number;
  weight: number;
}

export interface MSTEdge {
  from: number;
  to: number;
  weight: number;
}

export interface KruskalStep {
  type: KruskalStepType;
  nodes: Node[];
  edges: Edge[];
  message: string;
  highlightedEdge: { from: number; to: number } | null;
  action: string;
  sortedEdges: SortedEdge[];
  currentEdgeIndex: number;
  unionFind: UnionFindState;
  mstEdges: MSTEdge[];
  totalCost: number;
}

