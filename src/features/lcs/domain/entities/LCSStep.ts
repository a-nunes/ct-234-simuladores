export type LCSDirection = 'DIAGONAL' | 'CIMA' | 'ESQUERDA' | null;

export type LCSStepType =
  | 'init'
  | 'fill_borders'
  | 'process_cell'
  | 'match'
  | 'no_match_up'
  | 'no_match_left'
  | 'start_traceback'
  | 'traceback_step'
  | 'complete';

export interface LCSStep {
  type: LCSStepType;
  description: string;
  i?: number;
  j?: number;
  c: number[][];
  trace: LCSDirection[][];
  lcs?: string;
  tracebackI?: number;
  tracebackJ?: number;
}


