import { Node } from './Node';
import { Edge } from './Edge';

export interface PrimConfig {
  nodes: Node[];
  edges: Edge[];
  rootNode: number;
}

