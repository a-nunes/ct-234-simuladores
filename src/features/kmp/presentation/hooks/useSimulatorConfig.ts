import { useState, useCallback } from 'react';
import { KMPConfig } from '@features/kmp/domain/entities/KMPConfig';

export interface UseSimulatorConfigProps {
  initialText?: string;
  initialPattern?: string;
}

export interface UseSimulatorConfigReturn {
  text: string;
  pattern: string;
  config: KMPConfig;
  setText: (text: string) => void;
  setPattern: (pattern: string) => void;
  applyConfig: (config: KMPConfig) => void;
  reset: () => void;
}

const DEFAULT_TEXT = 'abacaabaccabacabaabb';
const DEFAULT_PATTERN = 'abacab';

/**
 * Hook for managing the simulator configuration (text and pattern).
 */
export function useSimulatorConfig({
  initialText = DEFAULT_TEXT,
  initialPattern = DEFAULT_PATTERN
}: UseSimulatorConfigProps = {}): UseSimulatorConfigReturn {
  const [text, setText] = useState<string>(initialText);
  const [pattern, setPattern] = useState<string>(initialPattern);

  const config: KMPConfig = {
    text,
    pattern
  };

  const applyConfig = useCallback((newConfig: KMPConfig) => {
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
