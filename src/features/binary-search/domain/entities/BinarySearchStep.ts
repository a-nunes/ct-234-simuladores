export type BinarySearchStepType = 
  | 'init' 
  | 'focus' 
  | 'calculate_pivot' 
  | 'compare' 
  | 'go_left' 
  | 'go_right' 
  | 'found' 
  | 'not_found';

export interface BinarySearchStep {
  type: BinarySearchStepType;
  l: number;
  r: number;
  q?: number;
  value?: number;
  message: string;
  callStack: string[];
}

