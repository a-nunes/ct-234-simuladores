export const sortingColors = {
  background: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  subtext: '#475569',
  accent: '#2563eb',
  accentMuted: '#e9f1ff',
  compare: '#fbbf24',
  swap: '#f87171',
  pivot: '#a855f7',
  secondary: '#38bdf8',
  warning: '#f97316',
  danger: '#ef4444',
  success: '#22c55e',
  muted: '#cbd5e1'
};

export type SortingBarState =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'pivot'
  | 'secondary'
  | 'bucket'
  | 'inactive';

export const barStateStyles: Record<SortingBarState, { bg: string; text: string; border?: string }> = {
  default: { bg: '#e9f1ff', text: '#2563eb', border: '#2563eb' },
  comparing: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  swapping: { bg: '#fee2e2', text: '#b91c1c', border: '#ef4444' },
  sorted: { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
  pivot: { bg: '#f3e8ff', text: '#6b21a8', border: '#a855f7' },
  secondary: { bg: '#e0f2fe', text: '#075985', border: '#38bdf8' },
  bucket: { bg: '#e0f2fe', text: '#075985', border: '#0ea5e9' },
  inactive: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' }
};

