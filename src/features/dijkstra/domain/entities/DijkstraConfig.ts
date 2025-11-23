import { Node } from './Node';
import { Edge } from './Edge';

export interface DijkstraConfig {
  nodes: Node[];
  edges: Edge[];
  sourceNode: number;
}

