import React, { useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  type: 'init' | 'call' | 'check_memo' | 'return_memo' | 'calculate' | 'save_memo' | 'complete';
  description: string;
  n: number;
  m: number[];
  callStack: number[];
  calculated?: boolean;
}

const FibonacciMemoSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetN, setTargetN] = useState<number>(6);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const generateSteps = useCallback((): Step[] => {
    const stepList: Step[] = [];
    const m: number[] = Array(targetN + 1).fill(-1);
    m[0] = 1;
    m[1] = 1;

    stepList.push({
      type: 'init',
      description: `Inicializando Fibonacci com Memoization. m[0]=1, m[1]=1, resto = -1 (não calculado).`,
      n: targetN,
      m: [...m],
      callStack: []
    });

    const callStack: number[] = [];

    const fibMemo = (n: number) => {
      callStack.push(n);
      stepList.push({
        type: 'call',
        description: `Chamada fib(${n}). Pilha: [${callStack.join(', ')}]`,
        n: n,
        m: [...m],
        callStack: [...callStack]
      });

      stepList.push({
        type: 'check_memo',
        description: `Verificando m[${n}] = ${m[n]}. ${m[n] < 0 ? 'Não calculado ainda!' : 'Já calculado!'}`,
        n: n,
        m: [...m],
        callStack: [...callStack],
        calculated: m[n] >= 0
      });

      if (m[n] < 0) {
        stepList.push({
          type: 'calculate',
          description: `m[${n}] = -1. Precisa calcular fib(${n-1}) + fib(${n-2})...`,
          n: n,
          m: [...m],
          callStack: [...callStack]
        });

        fibMemo(n - 1);
        fibMemo(n - 2);

        m[n] = m[n - 1] + m[n - 2];

        stepList.push({
          type: 'save_memo',
          description: `Calculado! m[${n}] = m[${n-1}] + m[${n-2}] = ${m[n-1]} + ${m[n-2]} = ${m[n]}. Salvando no cache.`,
          n: n,
          m: [...m],
          callStack: [...callStack]
        });
      } else {
        stepList.push({
          type: 'return_memo',
          description: `✓ m[${n}] já tem valor ${m[n]}! Retornando direto (sem recalcular). Economia!`,
          n: n,
          m: [...m],
          callStack: [...callStack]
        });
      }

      callStack.pop();
      return m[n];
    };

    fibMemo(targetN);

    stepList.push({
      type: 'complete',
      description: `Fibonacci(${targetN}) = ${m[targetN]}. Memoization evitou recálculos repetidos!`,
      n: targetN,
      m: [...m],
      callStack: []
    });

    return stepList;
  }, [targetN]);

  const handleStart = () => {
    setSteps(generateSteps());
    setCurrentStepIndex(0);
    setIsSimulating(true);
  };

  const handleReset = () => {
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsSimulating(false);
  };

  const handlePrevious = () => currentStepIndex > 0 && setCurrentStepIndex(currentStepIndex - 1);
  const handleNext = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(currentStepIndex + 1);

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={onBack} className="p-2 bg-white rounded-lg shadow hover:shadow-md">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fibonacci com Memoization</h1>
            <p className="text-gray-600">Top-Down com Cache - Evita recálculos</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button onClick={handleStart} disabled={isSimulating}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400">
                <Play className="w-5 h-5" />
                <span>Iniciar</span>
              </button>
              <button onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                <RotateCcw className="w-5 h-5" />
                <span>Resetar</span>
              </button>
            </div>
            {isSimulating && (
              <div className="flex items-center space-x-2">
                <button onClick={handlePrevious} disabled={currentStepIndex === 0}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium">Passo {currentStepIndex + 1} de {steps.length}</span>
                <button onClick={handleNext} disabled={currentStepIndex === steps.length - 1}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {!isSimulating && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Configuração</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Calcular Fibonacci(n)</label>
              <input type="number" value={targetN} onChange={(e) => setTargetN(Math.max(2, Math.min(15, parseInt(e.target.value) || 2)))}
                className="w-32 px-3 py-2 border rounded-lg" min="2" max="15" />
              <p className="text-sm text-gray-600 mt-2">Recomendado: 6-10 (para visualização clara)</p>
            </div>
          </div>
        )}

        {isSimulating && currentStep && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Passo Atual</h3>
              <p className="text-gray-700">{currentStep.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Array m[] (Cache de Memoization)</h3>
              <div className="overflow-x-auto">
                <div className="inline-grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(targetN + 1, 16)}, minmax(60px, 1fr))` }}>
                  {currentStep.m.slice(0, Math.min(targetN + 1, 16)).map((value, index) => (
                    <div key={index} className={`flex flex-col items-center justify-center p-3 border-2 rounded transition-all ${
                      currentStep.n === index ? 'bg-orange-100 border-orange-500 scale-110' :
                      value >= 0 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                    }`}>
                      <div className="text-xs text-gray-600 mb-1">m[{index}]</div>
                      <div className={`text-lg font-bold ${
                        currentStep.n === index ? 'text-orange-700' :
                        value >= 0 ? 'text-green-700' : 'text-gray-400'
                      }`}>
                        {value < 0 ? '-1' : value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Pilha de Chamadas Recursivas</h3>
              <div className="flex flex-wrap gap-2">
                {currentStep.callStack.length === 0 ? (
                  <p className="text-gray-500 italic">(vazia)</p>
                ) : (
                  currentStep.callStack.map((n, idx) => (
                    <div key={idx} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold">
                      fib({n})
                    </div>
                  ))
                )}
              </div>
            </div>

            {currentStep.calculated !== undefined && (
              <div className={`p-4 rounded-lg border-2 ${
                currentStep.calculated ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'
              }`}>
                <p className={`font-medium ${currentStep.calculated ? 'text-green-800' : 'text-yellow-800'}`}>
                  {currentStep.calculated ? '✓ Valor já no cache! Retorno instantâneo.' : '⋯ Precisa calcular recursivamente.'}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Sobre Memoization</h3>
          <div className="text-gray-700 space-y-2 text-sm">
            <p><strong>Top-Down:</strong> Abordagem recursiva com cache. Diferente de PD (bottom-up).</p>
            <p><strong>Cache (m[]):</strong> Armazena resultados já calculados. -1 = não calculado.</p>
            <p><strong>Vantagem:</strong> Calcula apenas subproblemas necessários. PD calcula todos.</p>
            <p><strong>Fibonacci sem memo:</strong> O(2ⁿ) - exponencial. <strong>Com memo:</strong> O(n) - linear!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FibonacciMemoSimulator;
