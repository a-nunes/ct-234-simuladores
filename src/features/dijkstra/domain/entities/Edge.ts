export interface Edge {
  from: number;
  to: number;
  weight: number;
  highlighted?: boolean;
  isInPath?: boolean;
  isRelaxing?: boolean;
}

