/**
 * Interface for steps that have a message property
 */
export interface StepWithMessage {
  message: string;
}

export interface ActionMessagePanelProps {
  currentStep: StepWithMessage | null;
}

/**
 * Generic component for displaying action messages.
 * Works with any step type that has a message property.
 */
export function ActionMessagePanel({ currentStep }: ActionMessagePanelProps) {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4" data-testid="action-message-panel">
      <h3 className="font-semibold text-blue-900 mb-2">Ação Atual:</h3>
      <p className="text-sm text-blue-800">
        {currentStep ? currentStep.message : 'Clique em "Iniciar" para começar.'}
      </p>
    </div>
  );
}

