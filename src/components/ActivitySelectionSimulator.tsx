import React, { useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Activity {
  id: number;
  start: number;
  finish: number;
}

interface Step {
  type: 'init' | 'sort' | 'select_first' | 'check_activity' | 'select_activity' | 'reject_activity' | 'complete';
  description: string;
  activities: Activity[];
  currentIndex?: number;
  selectedIndices: number[];
  lastSelectedIndex?: number;
  rejectedIndex?: number;
  sortedActivities?: Activity[];
}

const ActivitySelectionSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Estados para as atividades
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, start: 1, finish: 4 },
    { id: 2, start: 3, finish: 5 },
    { id: 3, start: 0, finish: 6 },
    { id: 4, start: 5, finish: 7 },
    { id: 5, start: 3, finish: 9 },
    { id: 6, start: 5, finish: 9 },
    { id: 7, start: 6, finish: 10 },
    { id: 8, start: 8, finish: 11 },
    { id: 9, start: 8, finish: 12 },
    { id: 10, start: 2, finish: 14 },
    { id: 11, start: 12, finish: 16 }
  ]);

  // Estados do simulador
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Função para gerar os passos do algoritmo
  const generateSteps = useCallback((): Step[] => {
    const stepList: Step[] = [];
    const activitiesCopy = [...activities];

    // Passo 1: Inicialização
    stepList.push({
      type: 'init',
      description: 'Iniciando algoritmo de Seleção de Atividades. Temos ' + activitiesCopy.length + ' atividades.',
      activities: activitiesCopy,
      selectedIndices: []
    });

    // Passo 2: Ordenação por tempo de término
    const sortedActivities = [...activitiesCopy].sort((a, b) => a.finish - b.finish);
    
    stepList.push({
      type: 'sort',
      description: 'Ordenando atividades por tempo de término (f). A escolha gulosa é sempre selecionar a atividade que termina mais cedo.',
      activities: activitiesCopy,
      sortedActivities: sortedActivities,
      selectedIndices: []
    });

    // Passo 3: Selecionar primeira atividade
    const selected: number[] = [0];
    let j = 0; // Índice da última atividade selecionada

    stepList.push({
      type: 'select_first',
      description: `Selecionando primeira atividade s[${sortedActivities[0].id}] (início=${sortedActivities[0].start}, fim=${sortedActivities[0].finish}). Esta é a que termina mais cedo.`,
      activities: sortedActivities,
      selectedIndices: [...selected],
      lastSelectedIndex: j
    });

    // Passo 4: Iterar pelas atividades restantes
    for (let i = 1; i < sortedActivities.length; i++) {
      // Verificar atividade atual
      stepList.push({
        type: 'check_activity',
        description: `Verificando atividade s[${sortedActivities[i].id}] (início=${sortedActivities[i].start}, fim=${sortedActivities[i].finish}). É compatível? s[${sortedActivities[i].id}].início (${sortedActivities[i].start}) >= s[${sortedActivities[j].id}].fim (${sortedActivities[j].finish})?`,
        activities: sortedActivities,
        currentIndex: i,
        selectedIndices: [...selected],
        lastSelectedIndex: j
      });

      if (sortedActivities[i].start >= sortedActivities[j].finish) {
        // Atividade é compatível - selecionar
        selected.push(i);
        j = i;

        stepList.push({
          type: 'select_activity',
          description: `✓ SIM! ${sortedActivities[i].start} >= ${sortedActivities[j].finish}. Atividade s[${sortedActivities[i].id}] é compatível e foi SELECIONADA.`,
          activities: sortedActivities,
          currentIndex: i,
          selectedIndices: [...selected],
          lastSelectedIndex: j
        });
      } else {
        // Atividade não é compatível - rejeitar
        stepList.push({
          type: 'reject_activity',
          description: `✗ NÃO. ${sortedActivities[i].start} < ${sortedActivities[j].finish}. Atividade s[${sortedActivities[i].id}] conflita com s[${sortedActivities[j].id}] e foi REJEITADA.`,
          activities: sortedActivities,
          currentIndex: i,
          selectedIndices: [...selected],
          lastSelectedIndex: j,
          rejectedIndex: i
        });
      }
    }

    // Passo final: Conclusão
    stepList.push({
      type: 'complete',
      description: `Algoritmo concluído! ${selected.length} atividades foram selecionadas. Esta é a solução ótima (máximo de atividades compatíveis).`,
      activities: sortedActivities,
      selectedIndices: [...selected]
    });

    return stepList;
  }, [activities]);

  // Iniciar simulação
  const handleStart = () => {
    const generatedSteps = generateSteps();
    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsSimulating(true);
  };

  // Resetar simulação
  const handleReset = () => {
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsSimulating(false);
  };

  // Navegação
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // Atualizar atividade
  const handleActivityChange = (index: number, field: 'start' | 'finish', value: string) => {
    const newActivities = [...activities];
    const numValue = parseInt(value) || 0;
    newActivities[index] = { ...newActivities[index], [field]: numValue };
    setActivities(newActivities);
  };

  // Adicionar atividade
  const handleAddActivity = () => {
    const newId = Math.max(...activities.map(a => a.id), 0) + 1;
    setActivities([...activities, { id: newId, start: 0, finish: 5 }]);
  };

  // Remover atividade
  const handleRemoveActivity = (index: number) => {
    if (activities.length > 2) {
      setActivities(activities.filter((_, i) => i !== index));
    }
  };

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  // Função para obter cor da atividade
  const getActivityColor = (index: number): string => {
    if (!currentStep) return 'bg-gray-300';

    if (currentStep.selectedIndices.includes(index)) {
      return 'bg-green-500';
    }

    if (currentStep.currentIndex === index && currentStep.type === 'check_activity') {
      return 'bg-yellow-400';
    }

    if (currentStep.rejectedIndex === index) {
      return 'bg-red-400';
    }

    return 'bg-gray-300';
  };

  // Função para renderizar timeline
  const renderTimeline = () => {
    if (!currentStep) return null;

    const displayActivities = currentStep.sortedActivities || currentStep.activities;
    const maxFinish = Math.max(...displayActivities.map(a => a.finish), 20);

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Timeline de Atividades</h3>
        <div className="space-y-2">
          {displayActivities.map((activity, index) => {
            const color = getActivityColor(index);
            const width = ((activity.finish - activity.start) / maxFinish) * 100;
            const left = (activity.start / maxFinish) * 100;

            return (
              <div key={activity.id} className="relative h-10 bg-gray-100 rounded">
                <div className="absolute left-0 top-0 h-full flex items-center pl-2 text-xs font-medium">
                  s[{activity.id}]
                </div>
                <div
                  className={`absolute top-1 h-8 ${color} rounded flex items-center justify-center text-white text-xs font-bold transition-all duration-300`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  {activity.start}-{activity.finish}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-600">
          {Array.from({ length: Math.ceil(maxFinish / 2) + 1 }, (_, i) => i * 2).map(time => (
            <div key={time}>{time}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Seleção de Atividades</h1>
              <p className="text-gray-600">Método Guloso - Escolha sempre a que termina mais cedo</p>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={handleStart}
                disabled={isSimulating}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Iniciar</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Resetar</span>
              </button>
            </div>

            {isSimulating && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium">
                  Passo {currentStepIndex + 1} de {steps.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === steps.length - 1}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Entrada de Atividades */}
        {!isSimulating && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Configurar Atividades</h3>
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <span className="w-16 font-medium">s[{activity.id}]:</span>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Início:</label>
                    <input
                      type="number"
                      value={activity.start}
                      onChange={(e) => handleActivityChange(index, 'start', e.target.value)}
                      className="w-20 px-2 py-1 border rounded"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Fim:</label>
                    <input
                      type="number"
                      value={activity.finish}
                      onChange={(e) => handleActivityChange(index, 'finish', e.target.value)}
                      className="w-20 px-2 py-1 border rounded"
                      min="0"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveActivity(index)}
                    disabled={activities.length <= 2}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 text-sm"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddActivity}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Adicionar Atividade
            </button>
          </div>
        )}

        {/* Visualização */}
        {isSimulating && currentStep && (
          <div className="space-y-6">
            {/* Descrição do passo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Passo Atual</h3>
              <p className="text-gray-700">{currentStep.description}</p>
            </div>

            {/* Timeline */}
            {renderTimeline()}

            {/* Lista de Atividades */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                {currentStep.sortedActivities ? 'Atividades Ordenadas por Tempo de Término' : 'Lista de Atividades'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Início (s_i)</th>
                      <th className="px-4 py-2 text-left">Fim (f_i)</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentStep.sortedActivities || currentStep.activities).map((activity, index) => {
                      const isSelected = currentStep.selectedIndices.includes(index);
                      const isCurrent = currentStep.currentIndex === index;
                      const isRejected = currentStep.rejectedIndex === index;
                      const isLastSelected = currentStep.lastSelectedIndex === index;

                      return (
                        <tr
                          key={activity.id}
                          className={`border-b transition-colors ${
                            isSelected ? 'bg-green-100' :
                            isRejected ? 'bg-red-100' :
                            isCurrent ? 'bg-yellow-100' : ''
                          }`}
                        >
                          <td className="px-4 py-2 font-medium">s[{activity.id}]</td>
                          <td className="px-4 py-2">{activity.start}</td>
                          <td className="px-4 py-2">{activity.finish}</td>
                          <td className="px-4 py-2">
                            {isSelected && (
                              <span className="text-green-700 font-medium">
                                ✓ Selecionada {isLastSelected && '(última)'}
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-red-700 font-medium">✗ Rejeitada</span>
                            )}
                            {isCurrent && !isRejected && (
                              <span className="text-yellow-700 font-medium">⋯ Verificando</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Painel de Estado */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Estado do Algoritmo</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Atividades Selecionadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {currentStep.selectedIndices.length}
                  </p>
                </div>
                {currentStep.lastSelectedIndex !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Última Selecionada (j)</p>
                    <p className="text-2xl font-bold text-blue-600">
                      s[{(currentStep.sortedActivities || currentStep.activities)[currentStep.lastSelectedIndex].id}]
                    </p>
                  </div>
                )}
                {currentStep.currentIndex !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Testando Agora (i)</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      s[{(currentStep.sortedActivities || currentStep.activities)[currentStep.currentIndex].id}]
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Total de Atividades</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {currentStep.activities.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Explicação do Algoritmo */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Sobre o Algoritmo</h3>
          <div className="text-gray-700 space-y-2">
            <p>
              <strong>Método Guloso:</strong> O algoritmo de Seleção de Atividades usa a estratégia gulosa de sempre escolher a atividade que <strong>termina mais cedo</strong> entre as compatíveis.
            </p>
            <p>
              <strong>Por que funciona?</strong> Ao escolher a que termina mais cedo, deixamos o máximo de tempo disponível para as próximas atividades, maximizando as oportunidades futuras.
            </p>
            <p>
              <strong>Complexidade:</strong> O(n log n) devido à ordenação inicial. A seleção em si é O(n).
            </p>
            <p>
              <strong>Aplicações:</strong> Agendamento de tarefas, alocação de recursos, otimização de horários.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelectionSimulator;
