import { Node } from './Node';
import { Edge } from './Edge';

export interface TopologicalSortConfig {
  nodes: Node[];
  edges: Edge[];
  dataStructure: 'queue' | 'stack'; // Fila ou pilha
}








