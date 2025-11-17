import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, SkipBack, SkipForward, Search } from 'lucide-react';

interface Step {
  type: 'init' | 'focus' | 'calculate_pivot' | 'compare' | 'go_left' | 'go_right' | 'found' | 'not_found';
  l: number;
  r: number;
  q?: number;
  value?: number;
  message: string;
  callStack: string[];
}

const BinarySearchSimulator: React.FC = () => {
  const [array, setArray] = useState<number[]>([2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78]);
  const [searchValue, setSearchValue] = useState<number>(23);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customArray, setCustomArray] = useState<string>('2,5,8,12,16,23,38,45,56,67,78');
  const [customSearch, setCustomSearch] = useState<string>('23');

  // Gera os passos do algoritmo
  const generateSteps = useCallback((arr: number[], x: number): Step[] => {
    const allSteps: Step[] = [];
    
    const binarySearch = (l: number, r: number, depth: number = 0): boolean => {
      const indent = '  '.repeat(depth);
      const callStackEntry = `${indent}BinarySearch(l=${l}, r=${r}, x=${x})`;
      
      // Adiciona o passo de foco no sub-vetor
      allSteps.push({
        type: 'focus',
        l,
        r,
        message: `Focando no sub-vetor v[${l}...${r}]`,
        callStack: [...allSteps[allSteps.length - 1]?.callStack || [], callStackEntry]
      });

      // Verifica se r < l (não encontrado)
      if (r < l) {
        allSteps.push({
          type: 'not_found',
          l,
          r,
          message: `r (${r}) < l (${l}). Valor não encontrado!`,
          callStack: allSteps[allSteps.length - 1].callStack
        });
        return false;
      }

      // Calcula o pivô q
      const q = Math.floor((l + r) / 2);
      allSteps.push({
        type: 'calculate_pivot',
        l,
        r,
        q,
        value: arr[q],
        message: `Pivô calculado: q = ⌊(${l}+${r})/2⌋ = ${q}, v[${q}] = ${arr[q]}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // Compara v[q] com x
      allSteps.push({
        type: 'compare',
        l,
        r,
        q,
        value: arr[q],
        message: `Comparando: v[${q}] = ${arr[q]} com x = ${x}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      if (arr[q] === x) {
        allSteps.push({
          type: 'found',
          l,
          r,
          q,
          value: arr[q],
          message: `✓ Valor ${x} encontrado no índice ${q}!`,
          callStack: allSteps[allSteps.length - 1].callStack
        });
        return true;
      }

      if (arr[q] > x) {
        allSteps.push({
          type: 'go_left',
          l,
          r,
          q,
          value: arr[q],
          message: `v[${q}] = ${arr[q]} > ${x}. Buscando na metade esquerda...`,
          callStack: allSteps[allSteps.length - 1].callStack
        });
        return binarySearch(l, q - 1, depth + 1);
      } else {
        allSteps.push({
          type: 'go_right',
          l,
          r,
          q,
          value: arr[q],
          message: `v[${q}] = ${arr[q]} < ${x}. Buscando na metade direita...`,
          callStack: allSteps[allSteps.length - 1].callStack
        });
        return binarySearch(q + 1, r, depth + 1);
      }
    };

    // Passo inicial
    allSteps.push({
      type: 'init',
      l: 0,
      r: arr.length - 1,
      message: `Iniciando busca binária por ${x} no vetor ordenado`,
      callStack: []
    });

    binarySearch(0, arr.length - 1);
    
    return allSteps;
  }, []);

  const handleStart = () => {
    const newSteps = generateSteps(array, searchValue);
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
      const newSearch = parseInt(customSearch.trim());
      
      if (newArray.length === 0) {
        alert('Array inválido! Use números separados por vírgula.');
        return;
      }
      
      if (isNaN(newSearch)) {
        alert('Valor de busca inválido!');
        return;
      }
      
      // Ordena o array
      newArray.sort((a, b) => a - b);
      
      setArray(newArray);
      setSearchValue(newSearch);
      handleReset();
    } catch (error) {
      alert('Erro ao processar entrada!');
    }
  };

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  const getCellStyle = (index: number): string => {
    if (!currentStep) return 'bg-white border-gray-300';
    
    const { l, r, q, type } = currentStep;
    
    // Valor encontrado
    if (type === 'found' && q === index) {
      return 'bg-green-500 border-green-600 text-white scale-110 shadow-lg';
    }
    
    // Pivô atual
    if (q === index && (type === 'calculate_pivot' || type === 'compare' || type === 'go_left' || type === 'go_right')) {
      return 'bg-yellow-300 border-yellow-500 ring-2 ring-yellow-400';
    }
    
    // Dentro do intervalo ativo
    if (index >= l && index <= r && type !== 'not_found') {
      return 'bg-blue-100 border-blue-400';
    }
    
    // Fora do intervalo (esmaecido)
    return 'bg-gray-100 border-gray-300 opacity-40';
  };

  const getPointerLabel = (index: number): string[] => {
    if (!currentStep) return [];
    
    const labels: string[] = [];
    const { l, r, q } = currentStep;
    
    if (l === index) labels.push('L');
    if (r === index) labels.push('R');
    if (q === index) labels.push('Q');
    
    return labels;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Busca Binária</h1>
              <p className="text-gray-600">Divisão-e-Conquista: Reduzindo o espaço de busca pela metade</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2,5,8,12,16,23..."
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor a buscar
              </label>
              <input
                type="number"
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="23"
                disabled={isRunning}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleApplyCustom}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentStepIndex <= 0}
            >
              <SkipBack className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          {/* Visualização do Array */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Visualização do Array</h2>
              
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {array.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {/* Ponteiros */}
                    <div className="h-6 flex gap-1 mb-1">
                      {getPointerLabel(index).map((label, i) => (
                        <span
                          key={i}
                          className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                            label === 'Q' ? 'bg-yellow-500 text-white' : 
                            label === 'L' ? 'bg-blue-500 text-white' : 
                            'bg-red-500 text-white'
                          }`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    
                    {/* Célula do array */}
                    <div
                      className={`w-16 h-16 flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-300 ${getCellStyle(index)}`}
                    >
                      <div className="text-lg font-bold">{value}</div>
                      <div className="text-xs text-gray-500 mt-1">[{index}]</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensagem do passo atual */}
              {currentStep && (
                <div className={`p-4 rounded-lg ${
                  currentStep.type === 'found' ? 'bg-green-100 border border-green-300' :
                  currentStep.type === 'not_found' ? 'bg-red-100 border border-red-300' :
                  'bg-blue-100 border border-blue-300'
                }`}>
                  <p className="text-sm font-medium text-gray-800">
                    {currentStep.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Painel de Estado */}
          <div className="space-y-6">
            {/* Estado Atual */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Estado Atual</h2>
              
              {currentStep ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Valor buscado (x):</span>
                    <span className="text-sm font-bold text-blue-600">{searchValue}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Limite esquerdo (l):</span>
                    <span className="text-sm font-bold text-blue-600">{currentStep.l}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Limite direito (r):</span>
                    <span className="text-sm font-bold text-red-600">{currentStep.r}</span>
                  </div>
                  {currentStep.q !== undefined && (
                    <>
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="text-sm font-medium text-gray-600">Pivô (q):</span>
                        <span className="text-sm font-bold text-yellow-600">{currentStep.q}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="text-sm font-medium text-gray-600">v[q]:</span>
                        <span className="text-sm font-bold text-yellow-600">{currentStep.value}</span>
                      </div>
                    </>
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
                <div className="space-y-2">
                  {currentStep.callStack.map((call, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded border-l-4 border-blue-500 font-mono text-xs"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchSimulator;
