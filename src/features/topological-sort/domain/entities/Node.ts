export type NodeState = 'unvisited' | 'processing' | 'processed';

export interface Node {
  id: number;
  label: string;
  state: NodeState;
  x: number;
  y: number;
  indegree?: number; // Grau de entrada atual
  topologicalOrder?: number; // Ordem topológica (f[v])
}








