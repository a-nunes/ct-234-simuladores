import { Node } from './Node';
import { Edge } from './Edge';

export type PrimStepType = 
  | 'init' 
  | 'search' 
  | 'select-min' 
  | 'add-to-tree' 
  | 'final';

export interface CandidateEdge {
  from: number;
  to: number;
  weight: number;
}

export interface MSTEdge {
  from: number;
  to: number;
  weight: number;
}

export interface PrimStep {
  type: PrimStepType;
  nodes: Node[];
  edges: Edge[];
  message: string;
  highlightedEdge: { from: number; to: number } | null;
  action: string;
  inTree: Set<number>;
  outTree: Set<number>;
  candidateEdges: CandidateEdge[];
  mstEdges: MSTEdge[];
  totalCost: number;
}

