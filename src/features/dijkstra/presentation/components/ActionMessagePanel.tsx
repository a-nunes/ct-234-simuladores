import { DijkstraStep } from '@features/dijkstra/domain/entities/DijkstraStep';

export interface ActionMessagePanelProps {
  currentStep: DijkstraStep | null;
}

export function ActionMessagePanel({ currentStep }: ActionMessagePanelProps) {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
      <h3 className="font-semibold text-blue-900 mb-2">Ação Atual:</h3>
      <p className="text-sm text-blue-800">
        {currentStep ? currentStep.message : 'Clique em "Iniciar" para começar.'}
      </p>
    </div>
  );
}

