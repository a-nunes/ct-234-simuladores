import React from 'react';

export interface InputPanelProps {
  text: string;
  pattern: string;
  textLabel?: string;
  patternLabel?: string;
  onTextChange: (text: string) => void;
  onPatternChange: (pattern: string) => void;
  onSimulate: () => void;
  onReset: () => void;
}

/**
 * Shared panel for inputting text and pattern, and controlling simulation start/reset.
 * Used by KMP, Boyer-Moore, and other pattern matching simulators.
 */
export const InputPanel: React.FC<InputPanelProps> = ({
  text,
  pattern,
  textLabel = 'Texto:',
  patternLabel = 'Padrão:',
  onTextChange,
  onPatternChange,
  onSimulate,
  onReset
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {textLabel}
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite o texto"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {patternLabel}
        </label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite o padrão"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onSimulate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Iniciar Simulação
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Limpar
        </button>
      </div>
    </div>
  );
};
