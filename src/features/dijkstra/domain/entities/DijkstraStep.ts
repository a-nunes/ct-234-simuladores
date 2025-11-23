import { Node } from './Node';
import { Edge } from './Edge';
import { PriorityQueueItem } from './PriorityQueueItem';

export type DijkstraStepType = 
  | 'init' 
  | 'extract-min' 
  | 'evaluate-edge' 
  | 'relax' 
  | 'no-relax' 
  | 'finish-node' 
  | 'unreachable' 
  | 'final';

export interface RelaxingEdge {
  from: number;
  to: number;
  oldDist: number;
  newDist: number;
}

export interface FinalDistance {
  nodeId: number;
  dist: number;
  path: number[];
}

export interface DijkstraStep {
  type: DijkstraStepType;
  nodes: Node[];
  edges: Edge[];
  priorityQueue: PriorityQueueItem[];
  message: string;
  highlightedNode: number | null;
  highlightedEdge: { from: number; to: number } | null;
  action: string;
  currentNode: number | null;
  relaxingEdge: RelaxingEdge | null;
  finalDistances?: FinalDistance[];
}

