import React from 'react';
import { sortingColors } from './theme';

interface NarrationBannerProps {
  message?: string;
}

export const NarrationBanner: React.FC<NarrationBannerProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div
      data-testid="sorting-narration-banner"
      className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm"
      style={{ borderColor: sortingColors.border, background: sortingColors.accentMuted, color: sortingColors.text }}
    >
      <span className="font-semibold">Comparando</span>
      <span className="text-slate-700" data-testid="sorting-narration-message">
        {message}
      </span>
    </div>
  );
};

