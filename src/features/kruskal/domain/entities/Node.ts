export interface Node {
  id: number;
  label: string;
  x: number;
  y: number;
  componentId?: number; // Identificador da componente conexa (para Kruskal)
  isInMST?: boolean; // Se está incluído na MST
}

