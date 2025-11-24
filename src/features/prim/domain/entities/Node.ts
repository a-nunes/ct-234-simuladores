export interface Node {
  id: number;
  label: string;
  x: number;
  y: number;
  isInTree?: boolean; // Para Prim - se está na árvore
  isRoot?: boolean; // Para Prim - se é a raiz
}

