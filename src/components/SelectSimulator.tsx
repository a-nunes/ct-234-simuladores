import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, SkipBack, SkipForward, Target } from 'lucide-react';

interface Step {
  type: 'init' | 'divide_groups' | 'find_medians' | 'find_pivot' | 'partition' | 'count_smaller' | 'recurse_left' | 'recurse_right' | 'found' | 'result';
  V: number[];
  k: number;
  groups?: number[][];
  medians?: number[];
  pivot?: number;
  V_smaller?: number[];
  V_greater?: number[];
  m?: number;
  message: string;
  callStack: string[];
}

const SelectSimulator: React.FC = () => {
  const [array, setArray] = useState<number[]>([3, 7, 1, 9, 4, 12, 8, 15, 2, 11, 6, 14, 5, 10, 13]);
  const [k, setK] = useState<number>(7);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customArray, setCustomArray] = useState<string>('3,7,1,9,4,12,8,15,2,11,6,14,5,10,13');
  const [customK, setCustomK] = useState<string>('7');

  // Função para encontrar a mediana de um pequeno array
  const findMedian = (arr: number[]): number => {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };

  // Gera os passos do algoritmo
  const generateSteps = useCallback((V: number[], k: number): Step[] => {
    const allSteps: Step[] = [];

    const select = (V: number[], k: number, depth: number = 0): number => {
      const indent = '  '.repeat(depth);
      const callStackEntry = `${indent}Select(V=[${V.length} elementos], k=${k})`;

      // Caso base: poucos elementos
      if (V.length <= 5) {
        const sorted = [...V].sort((a, b) => a - b);
        const result = sorted[k - 1];
        allSteps.push({
          type: 'result',
          V,
          k,
          message: `Caso base (${V.length} elementos). Ordenando e retornando o ${k}º elemento: ${result}`,
          callStack: [...(allSteps[allSteps.length - 1]?.callStack || []), callStackEntry]
        });
        return result;
      }

      // Foco no problema atual
      allSteps.push({
        type: 'init',
        V,
        k,
        message: `Buscando o ${k}º menor elemento em um vetor de ${V.length} elementos`,
        callStack: [...(allSteps[allSteps.length - 1]?.callStack || []), callStackEntry]
      });

      // 1. Dividir em grupos de 5
      const groups: number[][] = [];
      for (let i = 0; i < V.length; i += 5) {
        groups.push(V.slice(i, Math.min(i + 5, V.length)));
      }

      allSteps.push({
        type: 'divide_groups',
        V,
        k,
        groups,
        message: `Dividindo em ${groups.length} grupos de até 5 elementos`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // 2. Encontrar medianas de cada grupo
      const medians = groups.map(group => findMedian(group));

      allSteps.push({
        type: 'find_medians',
        V,
        k,
        groups,
        medians,
        message: `Medianas encontradas: [${medians.join(', ')}]`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // 3. Encontrar a mediana das medianas (pivô X)
      allSteps.push({
        type: 'find_pivot',
        V,
        k,
        groups,
        medians,
        message: `Encontrando a mediana das medianas (pivô X)...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      const pivot = select(medians, Math.ceil(medians.length / 2), depth + 1);

      allSteps.push({
        type: 'find_pivot',
        V,
        k,
        groups,
        medians,
        pivot,
        message: `Pivô X encontrado: ${pivot}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // 4. Particionar
      const V_smaller = V.filter(x => x < pivot);
      const V_greater = V.filter(x => x > pivot);

      allSteps.push({
        type: 'partition',
        V,
        k,
        pivot,
        V_smaller,
        V_greater,
        message: `Particionando: ${V_smaller.length} menores, pivô=${pivot}, ${V_greater.length} maiores`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // 5. Contar elementos menores
      const m = V_smaller.length;

      allSteps.push({
        type: 'count_smaller',
        V,
        k,
        pivot,
        V_smaller,
        V_greater,
        m,
        message: `${m} elementos são menores que o pivô`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // 6. Decidir partição
      if (k === m + 1) {
        allSteps.push({
          type: 'found',
          V,
          k,
          pivot,
          V_smaller,
          V_greater,
          m,
          message: `✓ k = m+1. O pivô ${pivot} é o ${k}º elemento!`,
          callStack: allSteps[allSteps.length - 1].callStack
        });
        return pivot;
      } else if (k <= m) {
        allSteps.push({
          type: 'recurse_left',
          V,
          k,
          pivot,
          V_smaller,
          V_greater,
          m,
          message: `k ≤ m. O ${k}º está entre os menores. Recursão...`,
          callStack: allSteps[allSteps.length - 1].callStack
        });
        return select(V_smaller, k, depth + 1);
      } else {
        const newK = k - m - 1;
        allSteps.push({
          type: 'recurse_right',
          V,
          k,
          pivot,
          V_smaller,
          V_greater,
          m,
          message: `k > m+1. O ${k}º está entre os maiores. Buscando o ${newK}º entre eles...`,
          callStack: allSteps[allSteps.length - 1].callStack
        });
        return select(V_greater, newK, depth + 1);
      }
    };

    // Passo inicial
    allSteps.push({
      type: 'init',
      V,
      k,
      message: `Iniciando algoritmo de seleção para encontrar o ${k}º menor elemento`,
      callStack: []
    });

    const result = select(V, k);

    allSteps.push({
      type: 'result',
      V,
      k,
      pivot: result,
      message: `✓ O ${k}º menor elemento é: ${result}`,
      callStack: []
    });

    return allSteps;
  }, []);

  const handleStart = () => {
    const newSteps = generateSteps(array, k);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsRunning(false);
  };

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

  const handleApplyCustom = () => {
    try {
      const newArray = customArray.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const newK = parseInt(customK.trim());

      if (newArray.length === 0) {
        alert('Array inválido! Use números separados por vírgula.');
        return;
      }

      if (isNaN(newK) || newK < 1 || newK > newArray.length) {
        alert(`k deve estar entre 1 e ${newArray.length}!`);
        return;
      }

      setArray(newArray);
      setK(newK);
      handleReset();
    } catch (error) {
      alert('Erro ao processar entrada!');
    }
  };

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  const getCellStyle = (value: number): string => {
    if (!currentStep) return 'bg-white border-gray-300';

    // Pivô
    if (currentStep.pivot === value) {
      return 'bg-yellow-400 border-yellow-600 ring-2 ring-yellow-500 text-white';
    }

    // Menores que o pivô
    if (currentStep.V_smaller?.includes(value)) {
      return 'bg-blue-200 border-blue-400';
    }

    // Maiores que o pivô
    if (currentStep.V_greater?.includes(value)) {
      return 'bg-red-200 border-red-400';
    }

    return 'bg-white border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Seleção do k-ésimo Elemento</h1>
              <p className="text-gray-600">Divisão-e-Conquista: Mediana das Medianas garante desempenho linear</p>
            </div>
          </div>

          {/* Configuração */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Array (separado por vírgulas)
              </label>
              <input
                type="text"
                value={customArray}
                onChange={(e) => setCustomArray(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="3,7,1,9,4,12..."
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                k-ésimo elemento (k)
              </label>
              <input
                type="number"
                value={customK}
                onChange={(e) => setCustomK(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="7"
                min={1}
                max={array.length}
                disabled={isRunning}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleApplyCustom}
                className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRunning}
              >
                Aplicar
              </button>
            </div>
          </div>

          {/* Controles */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isRunning}
            >
              <Play className="w-4 h-4" />
              Iniciar
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar
            </button>
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentStepIndex <= 0}
            >
              <SkipBack className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentStepIndex >= steps.length - 1}
            >
              Próximo
              <SkipForward className="w-4 h-4" />
            </button>
            {currentStep && (
              <div className="ml-auto text-sm text-gray-600 flex items-center">
                Passo {currentStepIndex + 1} de {steps.length}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualização */}
          <div className="lg:col-span-2 space-y-6">
            {/* Array Original */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Array V</h2>

              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {currentStep?.V.map((value, index) => (
                  <div
                    key={index}
                    className={`w-14 h-14 flex items-center justify-center border-2 rounded-lg transition-all duration-300 ${getCellStyle(value)}`}
                  >
                    <div className="text-lg font-bold">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grupos de 5 */}
            {currentStep?.groups && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Grupos de 5 Elementos</h2>

                <div className="space-y-3">
                  {currentStep.groups.map((group, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 mb-2">Grupo {i + 1}</div>
                      <div className="flex gap-2">
                        {group.map((val, j) => (
                          <div
                            key={j}
                            className="w-12 h-12 flex items-center justify-center bg-blue-100 border-2 border-blue-300 rounded font-bold"
                          >
                            {val}
                          </div>
                        ))}
                        {currentStep.medians && currentStep.medians[i] !== undefined && (
                          <div className="flex items-center ml-2">
                            <span className="text-sm text-gray-600">→ Mediana:</span>
                            <div className="ml-2 w-12 h-12 flex items-center justify-center bg-yellow-200 border-2 border-yellow-400 rounded font-bold">
                              {currentStep.medians[i]}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Array de Medianas */}
            {currentStep?.medians && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Array de Medianas</h2>

                <div className="flex gap-2 justify-center">
                  {currentStep.medians.map((median, i) => (
                    <div
                      key={i}
                      className={`w-14 h-14 flex items-center justify-center border-2 rounded-lg ${
                        median === currentStep.pivot
                          ? 'bg-yellow-400 border-yellow-600 ring-2 ring-yellow-500 text-white'
                          : 'bg-yellow-100 border-yellow-300'
                      }`}
                    >
                      <div className="text-lg font-bold">{median}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Particionamento */}
            {currentStep?.V_smaller && currentStep?.V_greater && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Particionamento</h2>

                <div className="grid grid-cols-3 gap-4">
                  {/* Menores */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-gray-600 mb-2">
                      Menores ({currentStep.V_smaller.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentStep.V_smaller.map((val, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 flex items-center justify-center bg-blue-200 border border-blue-400 rounded text-sm font-bold"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pivô */}
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-xs text-gray-600 mb-2">Pivô X</div>
                    <div className="flex justify-center">
                      <div className="w-16 h-16 flex items-center justify-center bg-yellow-400 border-2 border-yellow-600 rounded-lg text-2xl font-bold text-white">
                        {currentStep.pivot}
                      </div>
                    </div>
                  </div>

                  {/* Maiores */}
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xs text-gray-600 mb-2">
                      Maiores ({currentStep.V_greater.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentStep.V_greater.map((val, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 flex items-center justify-center bg-red-200 border border-red-400 rounded text-sm font-bold"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensagem do passo atual */}
            {currentStep && (
              <div className={`p-4 rounded-lg ${
                currentStep.type === 'found' || currentStep.type === 'result'
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-indigo-100 border border-indigo-300'
              }`}>
                <p className="text-sm font-medium text-gray-800">
                  {currentStep.message}
                </p>
              </div>
            )}
          </div>

          {/* Painel de Estado */}
          <div className="space-y-6">
            {/* Estado Atual */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Estado Atual</h2>

              {currentStep ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">k-ésimo buscado:</span>
                    <span className="text-sm font-bold text-indigo-600">{currentStep.k}º</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Tamanho do array:</span>
                    <span className="text-sm font-bold text-gray-600">{currentStep.V.length}</span>
                  </div>
                  {currentStep.pivot !== undefined && (
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span className="text-sm font-medium text-gray-600">Pivô X:</span>
                      <span className="text-sm font-bold text-yellow-600">{currentStep.pivot}</span>
                    </div>
                  )}
                  {currentStep.m !== undefined && (
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium text-gray-600">Menores (m):</span>
                      <span className="text-sm font-bold text-blue-600">{currentStep.m}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Clique em "Iniciar" para começar a simulação
                </p>
              )}
            </div>

            {/* Call Stack */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pilha de Chamadas</h2>

              {currentStep && currentStep.callStack.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {currentStep.callStack.map((call, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded border-l-4 border-indigo-500 font-mono text-xs break-all"
                    >
                      {call}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  A pilha de chamadas aparecerá aqui
                </p>
              )}
            </div>

            {/* Informação Educacional */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200">
              <h3 className="text-sm font-bold text-gray-800 mb-2">💡 Por que Mediana das Medianas?</h3>
              <p className="text-xs text-gray-600">
                A escolha de um "bom" pivô (mediana das medianas) garante que o algoritmo
                tenha desempenho linear O(n), mesmo no pior caso, pois elimina pelo menos
                30% dos elementos a cada recursão.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectSimulator;
