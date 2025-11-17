import React, { useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  type: 'init' | 'call' | 'check_memo' | 'return_memo' | 'base_case' | 'try_coin' | 'save_memo' | 'complete';
  description: string;
  q: number;
  memo: number[];
  callStack: number[];
  tryingCoin?: number;
  result?: number;
}

const CoinChangeMemoSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [coins, setCoins] = useState<number[]>([1, 5, 10, 25]);
  const [targetAmount, setTargetAmount] = useState<number>(30);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const generateSteps = useCallback((): Step[] => {
    const stepList: Step[] = [];
    const memo: number[] = Array(targetAmount + 1).fill(-1);
    const callStack: number[] = [];

    stepList.push({
      type: 'init',
      description: `Inicializando Troco com Memoization (Top-Down). Moedas: [${coins.join(', ')}]. Alvo: ${targetAmount}. memo[] = -1 (não calculado).`,
      q: targetAmount,
      memo: [...memo],
      callStack: []
    });

    const trocoRecursivo = (q: number): number => {
      callStack.push(q);
      
      stepList.push({
        type: 'call',
        description: `Chamada troco_recursivo(${q}). Pilha: [${callStack.join(', ')}]`,
        q: q,
        memo: [...memo],
        callStack: [...callStack]
      });

      stepList.push({
        type: 'check_memo',
        description: `Verificando memo[${q}] = ${memo[q]}. ${memo[q] !== -1 ? '✓ Já calculado!' : '✗ Precisa calcular.'}`,
        q: q,
        memo: [...memo],
        callStack: [...callStack]
      });

      if (memo[q] !== -1) {
        stepList.push({
          type: 'return_memo',
          description: `Retornando memo[${q}] = ${memo[q]} direto (economia de tempo)!`,
          q: q,
          memo: [...memo],
          callStack: [...callStack],
          result: memo[q]
        });
        callStack.pop();
        return memo[q];
      }

      if (q === 0) {
        memo[q] = 0;
        stepList.push({
          type: 'base_case',
          description: `Caso base: troco de 0 = 0 moedas. memo[0] = 0`,
          q: q,
          memo: [...memo],
          callStack: [...callStack]
        });
        callStack.pop();
        return 0;
      }

      let minMoedas = Infinity;

      for (const moeda of coins) {
        stepList.push({
          type: 'try_coin',
          description: `Testando moeda ${moeda}...`,
          q: q,
          memo: [...memo],
          callStack: [...callStack],
          tryingCoin: moeda
        });

        if (q >= moeda) {
          const res = 1 + trocoRecursivo(q - moeda);
          
          stepList.push({
            type: 'try_coin',
            description: `Moeda ${moeda} cabe! Resultado: 1 + troco(${q - moeda}) = 1 + ${memo[q - moeda]} = ${res}. ${res < minMoedas ? 'É melhor!' : 'Não é melhor.'}`,
            q: q,
            memo: [...memo],
            callStack: [...callStack],
            tryingCoin: moeda,
            result: res
          });

          minMoedas = Math.min(minMoedas, res);
        } else {
          stepList.push({
            type: 'try_coin',
            description: `Moeda ${moeda} > ${q}. Não cabe, ignorando.`,
            q: q,
            memo: [...memo],
            callStack: [...callStack],
            tryingCoin: moeda
          });
        }
      }

      memo[q] = minMoedas;

      stepList.push({
        type: 'save_memo',
        description: `Salvando memo[${q}] = ${minMoedas}. Mínimo de moedas para ${q} centavos.`,
        q: q,
        memo: [...memo],
        callStack: [...callStack]
      });

      callStack.pop();
      return minMoedas;
    };

    const resultado = trocoRecursivo(targetAmount);

    stepList.push({
      type: 'complete',
      description: `Concluído! Para ${targetAmount} centavos: ${resultado} moedas. Memoization evitou recálculos!`,
      q: targetAmount,
      memo: [...memo],
      callStack: []
    });

    return stepList;
  }, [coins, targetAmount]);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={onBack} className="p-2 bg-white rounded-lg shadow hover:shadow-md">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Troco com Memoization</h1>
            <p className="text-gray-600">Top-Down recursivo com cache - Compare com PD</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button onClick={handleStart} disabled={isSimulating}
                className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-400">
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Valor do Troco</label>
              <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="w-32 px-3 py-2 border rounded-lg" min="1" max="50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Moedas: [{coins.join(', ')}]</label>
              <p className="text-sm text-gray-600">Padrão: moedas americanas (1, 5, 10, 25)</p>
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
              <h3 className="text-lg font-semibold mb-4">Array memo[] (Cache)</h3>
              <div className="overflow-x-auto">
                <div className="inline-grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(targetAmount + 1, 15)}, minmax(50px, 1fr))` }}>
                  {currentStep.memo.slice(0, Math.min(targetAmount + 1, 15)).map((value, index) => (
                    <div key={index} className={`flex flex-col items-center justify-center p-2 border-2 rounded transition-all ${
                      currentStep.q === index ? 'bg-pink-100 border-pink-500 scale-110' :
                      value !== -1 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                    }`}>
                      <div className="text-xs text-gray-600">{index}</div>
                      <div className={`text-lg font-bold ${
                        currentStep.q === index ? 'text-pink-700' :
                        value !== -1 ? 'text-green-700' : 'text-gray-400'
                      }`}>
                        {value === -1 ? '-1' : value === Infinity ? '∞' : value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Pilha de Chamadas</h3>
              <div className="flex flex-wrap gap-2">
                {currentStep.callStack.length === 0 ? (
                  <p className="text-gray-500 italic">(vazia)</p>
                ) : (
                  currentStep.callStack.map((q, idx) => (
                    <div key={idx} className="px-3 py-2 bg-purple-500 text-white rounded-lg font-mono font-bold">
                      troco({q})
                    </div>
                  ))
                )}
              </div>
            </div>

            {currentStep.tryingCoin !== undefined && (
              <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <p className="font-medium text-blue-800">
                  Testando moeda de {currentStep.tryingCoin} centavos...
                  {currentStep.result !== undefined && ` Resultado: ${currentStep.result}`}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Memoization vs PD</h3>
          <div className="text-gray-700 space-y-2 text-sm">
            <p><strong>Memoization (este):</strong> Top-Down, recursivo, calcula apenas subproblemas necessários.</p>
            <p><strong>PD (outro simulador):</strong> Bottom-Up, iterativo, preenche tabela completa.</p>
            <p><strong>Mesma complexidade:</strong> Ambos O(n × m), mas com estratégias diferentes!</p>
            <p><strong>Escolha:</strong> Memo = mais intuitivo. PD = mais eficiente em espaço (sem pilha de recursão).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinChangeMemoSimulator;
