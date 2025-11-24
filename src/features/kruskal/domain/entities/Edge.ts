export interface Edge {
  from: number;
  to: number;
  weight: number;
  highlighted?: boolean;
  isInMST?: boolean;
  isEvaluating?: boolean;
  isRejected?: boolean;
}

