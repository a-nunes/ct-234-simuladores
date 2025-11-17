import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, SkipBack, SkipForward, Calculator } from 'lucide-react';

interface Step {
  type: 'init' | 'divide' | 'calc_x' | 'calc_y' | 'calc_z_temp' | 'calc_z' | 'combine' | 'result';
  I: number;
  J: number;
  n: number;
  Ih?: number;
  Il?: number;
  Jh?: number;
  Jl?: number;
  X?: number;
  Y?: number;
  Z_temp?: number;
  Z?: number;
  result?: number;
  message: string;
  callStack: string[];
}

const KaratsubaSimulator: React.FC = () => {
  const [num1, setNum1] = useState<number>(5678);
  const [num2, setNum2] = useState<number>(1234);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customNum1, setCustomNum1] = useState<string>('5678');
  const [customNum2, setCustomNum2] = useState<string>('1234');

  // Gera os passos do algoritmo
  const generateSteps = useCallback((I: number, J: number): Step[] => {
    const allSteps: Step[] = [];

    const karatsuba = (I: number, J: number, n: number, depth: number = 0): number => {
      const indent = '  '.repeat(depth);
      const callStackEntry = `${indent}Karatsuba(I=${I}, J=${J}, n=${n})`;

      // Caso base
      if (n === 1 || I < 10 || J < 10) {
        const result = I * J;
        allSteps.push({
          type: 'result',
          I,
          J,
          n,
          result,
          message: `Caso base: ${I} × ${J} = ${result}`,
          callStack: [...(allSteps[allSteps.length - 1]?.callStack || []), callStackEntry]
        });
        return result;
      }

      // Foco no problema atual
      allSteps.push({
        type: 'init',
        I,
        J,
        n,
        message: `Multiplicando ${I} × ${J} (${n} dígitos)`,
        callStack: [...(allSteps[allSteps.length - 1]?.callStack || []), callStackEntry]
      });

      // Divisão
      const half = Math.floor(n / 2);
      const divisor = Math.pow(10, half);

      const Ih = Math.floor(I / divisor);
      const Il = I % divisor;
      const Jh = Math.floor(J / divisor);
      const Jl = J % divisor;

      allSteps.push({
        type: 'divide',
        I,
        J,
        n,
        Ih,
        Il,
        Jh,
        Jl,
        message: `Divisão: Ih=${Ih}, Il=${Il}, Jh=${Jh}, Jl=${Jl}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // Calcula X = Ih * Jh
      allSteps.push({
        type: 'calc_x',
        I,
        J,
        n,
        Ih,
        Il,
        Jh,
        Jl,
        message: `Calculando X = Ih × Jh = ${Ih} × ${Jh}...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      const X = karatsuba(Ih, Jh, Math.ceil(n / 2), depth + 1);

      allSteps.push({
        type: 'calc_x',
        I,
        J,
        n,
        Ih,
        Il,
        Jh,
        Jl,
        X,
        message: `X = ${X}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // Calcula Y = Il * Jl
      allSteps.push({
        type: 'calc_y',
        I,
        J,
        n,
        Ih,
        Il,
        Jh,
        Jl,
        X,
        message: `Calculando Y = Il × Jl = ${Il} × ${Jl}...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      const Y = karatsuba(Il, Jl, Math.ceil(n / 2), depth + 1);

      allSteps.push({
        type: 'calc_y',
        I,
        J,
        n,
        Ih,
        Il,
        Jh,
        Jl,
        X,
        Y,
        message: `Y = ${Y}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // Calcula Z_temp = (Ih + Il) * (Jh + Jl)
      const sumI = Ih + Il;
      const sumJ = Jh + Jl;

      allSteps.push({
        type: 'calc_z_temp',
        I,
        J,
        n,
        Ih,
        Il,
        Jh,
        Jl,
        X,
        Y,
        message: `Calculando Z_temp = (Ih+Il) × (Jh+Jl) = (${Ih}+${Il}) × (${Jh}+${Jl}) = ${sumI} × ${sumJ}...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      const Z_temp = karatsuba(sumI, sumJ, Math.ceil(n / 2), depth + 1);

      allSteps.push({
        type: 'calc_z_temp',
        I,
        J,
        n,
        Ih,
        Il,
        Jh,
        Jl,
        X,
        Y,
        Z_temp,
        message: `Z_temp = ${Z_temp}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // Calcula Z = Z_temp - X - Y
      const Z = Z_temp - X - Y;

      allSteps.push({
        type: 'calc_z',
        I,
        J,
        n,
        Ih,
        Il,
        Jh,
        Jl,
        X,
        Y,
        Z_temp,
        Z,
        message: `Z = Z_temp - X - Y = ${Z_temp} - ${X} - ${Y} = ${Z}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // Combinação
      const result = X * Math.pow(10, 2 * half) + Z * Math.pow(10, half) + Y;

      allSteps.push({
        type: 'combine',
        I,
        J,
        n,
        Ih,
        Il,
        Jh,
        Jl,
        X,
        Y,
        Z,
        result,
        message: `Combinação: X×10^${2 * half} + Z×10^${half} + Y = ${X}×${Math.pow(10, 2 * half)} + ${Z}×${Math.pow(10, half)} + ${Y} = ${result}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      return result;
    };

    // Passo inicial
    const digits = Math.max(num1.toString().length, num2.toString().length);

    allSteps.push({
      type: 'init',
      I: num1,
      J: num2,
      n: digits,
      message: `Iniciando multiplicação de Karatsuba: ${num1} × ${num2}`,
      callStack: []
    });

    const result = karatsuba(I, J, digits);

    allSteps.push({
      type: 'result',
      I,
      J,
      n: digits,
      result,
      message: `✓ Resultado final: ${I} × ${J} = ${result}`,
      callStack: []
    });

    return allSteps;
  }, []);

  const handleStart = () => {
    const newSteps = generateSteps(num1, num2);
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
      const n1 = parseInt(customNum1.trim());
      const n2 = parseInt(customNum2.trim());

      if (isNaN(n1) || isNaN(n2)) {
        alert('Números inválidos!');
        return;
      }

      if (n1 < 0 || n2 < 0) {
        alert('Use apenas números não-negativos!');
        return;
      }

      setNum1(n1);
      setNum2(n2);
      handleReset();
    } catch (error) {
      alert('Erro ao processar entrada!');
    }
  };

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Multiplicação de Karatsuba</h1>
              <p className="text-gray-600">Divisão-e-Conquista: 3 multiplicações em vez de 4</p>
            </div>
          </div>

          {/* Configuração */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primeiro número (I)
              </label>
              <input
                type="number"
                value={customNum1}
                onChange={(e) => setCustomNum1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="5678"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segundo número (J)
              </label>
              <input
                type="number"
                value={customNum2}
                onChange={(e) => setCustomNum2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1234"
                disabled={isRunning}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleApplyCustom}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentStepIndex <= 0}
            >
              <SkipBack className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          {/* Área de Cálculo */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Área de Cálculo</h2>

              {currentStep ? (
                <div className="space-y-4">
                  {/* Problema atual */}
                  <div className="p-4 bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-500 rounded">
                    <div className="text-sm text-gray-600 mb-1">Problema Atual</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {currentStep.I} × {currentStep.J}
                    </div>
                  </div>

                  {/* Divisão */}
                  {currentStep.Ih !== undefined && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-xs text-gray-600 mb-2">Número I dividido</div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Ih (alto):</span>
                            <span className="text-sm font-bold text-blue-600">{currentStep.Ih}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Il (baixo):</span>
                            <span className="text-sm font-bold text-blue-600">{currentStep.Il}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-xs text-gray-600 mb-2">Número J dividido</div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Jh (alto):</span>
                            <span className="text-sm font-bold text-purple-600">{currentStep.Jh}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Jl (baixo):</span>
                            <span className="text-sm font-bold text-purple-600">{currentStep.Jl}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* As 3 multiplicações */}
                  <div className="grid grid-cols-3 gap-4">
                    {currentStep.X !== undefined && (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-xs text-gray-600 mb-1">X</div>
                        <div className="text-sm font-medium mb-1">Ih × Jh</div>
                        <div className="text-2xl font-bold text-yellow-600">{currentStep.X}</div>
                      </div>
                    )}

                    {currentStep.Y !== undefined && (
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-xs text-gray-600 mb-1">Y</div>
                        <div className="text-sm font-medium mb-1">Il × Jl</div>
                        <div className="text-2xl font-bold text-orange-600">{currentStep.Y}</div>
                      </div>
                    )}

                    {currentStep.Z_temp !== undefined && (
                      <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                        <div className="text-xs text-gray-600 mb-1">Z_temp</div>
                        <div className="text-sm font-medium mb-1">(Ih+Il)×(Jh+Jl)</div>
                        <div className="text-2xl font-bold text-pink-600">{currentStep.Z_temp}</div>
                      </div>
                    )}
                  </div>

                  {/* Z calculado */}
                  {currentStep.Z !== undefined && (
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="text-xs text-gray-600 mb-1">Z (Z_temp - X - Y)</div>
                      <div className="text-2xl font-bold text-indigo-600">{currentStep.Z}</div>
                    </div>
                  )}

                  {/* Resultado */}
                  {currentStep.result !== undefined && currentStep.type === 'combine' && (
                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-500">
                      <div className="text-xs text-gray-600 mb-1">Resultado Parcial</div>
                      <div className="text-3xl font-bold text-green-600">{currentStep.result}</div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-8">
                  Clique em "Iniciar" para começar a simulação
                </p>
              )}

              {/* Mensagem do passo atual */}
              {currentStep && (
                <div className={`mt-4 p-4 rounded-lg ${
                  currentStep.type === 'result' ? 'bg-green-100 border border-green-300' :
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
                    <span className="text-sm font-medium text-gray-600">I:</span>
                    <span className="text-sm font-bold text-blue-600">{currentStep.I}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">J:</span>
                    <span className="text-sm font-bold text-purple-600">{currentStep.J}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Dígitos (n):</span>
                    <span className="text-sm font-bold text-gray-600">{currentStep.n}</span>
                  </div>
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
                      className="p-2 bg-gray-50 rounded border-l-4 border-green-500 font-mono text-xs break-all"
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
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-lg p-6 border border-green-200">
              <h3 className="text-sm font-bold text-gray-800 mb-2">💡 Por que Karatsuba é eficiente?</h3>
              <p className="text-xs text-gray-600">
                O algoritmo tradicional usa 4 multiplicações. Karatsuba reduz para 3 multiplicações,
                melhorando a complexidade de O(n²) para O(n^1.585).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaratsubaSimulator;
