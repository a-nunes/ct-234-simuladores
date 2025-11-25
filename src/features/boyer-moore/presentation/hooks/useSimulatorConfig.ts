import { useState, useCallback } from 'react';
import { BoyerMooreConfig } from '@features/boyer-moore/domain/entities/BoyerMooreConfig';

export interface UseSimulatorConfigProps {
  initialText?: string;
  initialPattern?: string;
}

export interface UseSimulatorConfigReturn {
  text: string;
  pattern: string;
  config: BoyerMooreConfig;
  setText: (text: string) => void;
  setPattern: (pattern: string) => void;
  applyConfig: (config: BoyerMooreConfig) => void;
  reset: () => void;
}

const DEFAULT_TEXT = 'vi na mata duas aranhas e duas araras';
const DEFAULT_PATTERN = 'araras';

/**
 * Hook for managing the simulator configuration (text and pattern).
 */
export function useSimulatorConfig({
  initialText = DEFAULT_TEXT,
  initialPattern = DEFAULT_PATTERN
}: UseSimulatorConfigProps = {}): UseSimulatorConfigReturn {
  const [text, setText] = useState<string>(initialText);
  const [pattern, setPattern] = useState<string>(initialPattern);

  const config: BoyerMooreConfig = {
    text,
    pattern
  };

  const applyConfig = useCallback((newConfig: BoyerMooreConfig) => {
    setText(newConfig.text);
    setPattern(newConfig.pattern);
  }, []);

  const reset = useCallback(() => {
    setText(initialText);
    setPattern(initialPattern);
  }, [initialText, initialPattern]);

  return {
    text,
    pattern,
    config,
    setText,
    setPattern,
    applyConfig,
    reset
  };
}
