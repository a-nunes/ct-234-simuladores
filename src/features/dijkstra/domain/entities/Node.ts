export type NodeState = 'unvisited' | 'visiting' | 'visited';

export interface Node {
  id: number;
  label: string;
  state: NodeState;
  dist: number; // Distância da origem
  pred: number | null; // Predecessor no caminho
  x: number;
  y: number;
  isSource?: boolean;
  isInQueue?: boolean;
}

