import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, SkipBack, SkipForward, Grid } from 'lucide-react';

type Matrix = number[][];

interface Step {
  type: 'init' | 'divide' | 'calc_p' | 'calc_q' | 'calc_r' | 'calc_s' | 'calc_t' | 'calc_u' | 'calc_v' | 'combine' | 'result';
  A: Matrix;
  B: Matrix;
  A11?: Matrix;
  A12?: Matrix;
  A21?: Matrix;
  A22?: Matrix;
  B11?: Matrix;
  B12?: Matrix;
  B21?: Matrix;
  B22?: Matrix;
  P?: Matrix;
  Q?: Matrix;
  R?: Matrix;
  S?: Matrix;
  T?: Matrix;
  U?: Matrix;
  V?: Matrix;
  C11?: Matrix;
  C12?: Matrix;
  C21?: Matrix;
  C22?: Matrix;
  result?: Matrix;
  message: string;
  callStack: string[];
}

const StrassenSimulator: React.FC = () => {
  const [matrixSize, setMatrixSize] = useState<number>(2);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Matrizes de exemplo
  const defaultA: Matrix = [
    [1, 2],
    [3, 4]
  ];

  const defaultB: Matrix = [
    [5, 6],
    [7, 8]
  ];

  const [matrixA, setMatrixA] = useState<Matrix>(defaultA);
  const [matrixB, setMatrixB] = useState<Matrix>(defaultB);

  // Funções auxiliares para operações com matrizes
  const addMatrices = (A: Matrix, B: Matrix): Matrix => {
    const n = A.length;
    const result: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        result[i][j] = A[i][j] + B[i][j];
      }
    }
    return result;
  };

  const subtractMatrices = (A: Matrix, B: Matrix): Matrix => {
    const n = A.length;
    const result: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        result[i][j] = A[i][j] - B[i][j];
      }
    }
    return result;
  };

  const multiplyMatricesNaive = (A: Matrix, B: Matrix): Matrix => {
    const n = A.length;
    const result: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return result;
  };

  const divideMatrix = (M: Matrix): [Matrix, Matrix, Matrix, Matrix] => {
    const n = M.length;
    const half = n / 2;

    const M11: Matrix = Array(half).fill(0).map(() => Array(half).fill(0));
    const M12: Matrix = Array(half).fill(0).map(() => Array(half).fill(0));
    const M21: Matrix = Array(half).fill(0).map(() => Array(half).fill(0));
    const M22: Matrix = Array(half).fill(0).map(() => Array(half).fill(0));

    for (let i = 0; i < half; i++) {
      for (let j = 0; j < half; j++) {
        M11[i][j] = M[i][j];
        M12[i][j] = M[i][j + half];
        M21[i][j] = M[i + half][j];
        M22[i][j] = M[i + half][j + half];
      }
    }

    return [M11, M12, M21, M22];
  };

  const combineMatrices = (M11: Matrix, M12: Matrix, M21: Matrix, M22: Matrix): Matrix => {
    const half = M11.length;
    const n = half * 2;
    const result: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < half; i++) {
      for (let j = 0; j < half; j++) {
        result[i][j] = M11[i][j];
        result[i][j + half] = M12[i][j];
        result[i + half][j] = M21[i][j];
        result[i + half][j + half] = M22[i][j];
      }
    }

    return result;
  };

  // Gera os passos do algoritmo
  const generateSteps = useCallback((A: Matrix, B: Matrix): Step[] => {
    const allSteps: Step[] = [];

    const strassen = (A: Matrix, B: Matrix, depth: number = 0): Matrix => {
      const n = A.length;
      const indent = '  '.repeat(depth);
      const callStackEntry = `${indent}Strassen(n=${n})`;

      // Caso base
      if (n === 1) {
        const result = [[A[0][0] * B[0][0]]];
        allSteps.push({
          type: 'result',
          A,
          B,
          result,
          message: `Caso base: ${A[0][0]} × ${B[0][0]} = ${result[0][0]}`,
          callStack: [...(allSteps[allSteps.length - 1]?.callStack || []), callStackEntry]
        });
        return result;
      }

      // Início
      allSteps.push({
        type: 'init',
        A,
        B,
        message: `Multiplicando matrizes ${n}×${n}`,
        callStack: [...(allSteps[allSteps.length - 1]?.callStack || []), callStackEntry]
      });

      // Divisão
      const [A11, A12, A21, A22] = divideMatrix(A);
      const [B11, B12, B21, B22] = divideMatrix(B);

      allSteps.push({
        type: 'divide',
        A,
        B,
        A11, A12, A21, A22,
        B11, B12, B21, B22,
        message: `Dividindo matrizes em 4 sub-matrizes ${n/2}×${n/2}`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // P = (A11 + A22)(B11 + B22)
      allSteps.push({
        type: 'calc_p',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22,
        message: `Calculando P = (A11 + A22) × (B11 + B22)...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      const P = strassen(addMatrices(A11, A22), addMatrices(B11, B22), depth + 1);
      allSteps.push({
        type: 'calc_p',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22,
        P,
        message: `P calculado`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // Q = (A21 + A22) × B11
      allSteps.push({
        type: 'calc_q',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P,
        message: `Calculando Q = (A21 + A22) × B11...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      const Q = strassen(addMatrices(A21, A22), B11, depth + 1);
      allSteps.push({
        type: 'calc_q',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q,
        message: `Q calculado`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // R = A11 × (B12 - B22)
      allSteps.push({
        type: 'calc_r',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q,
        message: `Calculando R = A11 × (B12 - B22)...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      const R = strassen(A11, subtractMatrices(B12, B22), depth + 1);
      allSteps.push({
        type: 'calc_r',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q, R,
        message: `R calculado`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // S = A22 × (B21 - B11)
      allSteps.push({
        type: 'calc_s',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q, R,
        message: `Calculando S = A22 × (B21 - B11)...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      const S = strassen(A22, subtractMatrices(B21, B11), depth + 1);
      allSteps.push({
        type: 'calc_s',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q, R, S,
        message: `S calculado`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // T = (A11 + A12) × B22
      allSteps.push({
        type: 'calc_t',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q, R, S,
        message: `Calculando T = (A11 + A12) × B22...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      const T = strassen(addMatrices(A11, A12), B22, depth + 1);
      allSteps.push({
        type: 'calc_t',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q, R, S, T,
        message: `T calculado`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // U = (A21 - A11) × (B11 + B12)
      allSteps.push({
        type: 'calc_u',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q, R, S, T,
        message: `Calculando U = (A21 - A11) × (B11 + B12)...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      const U = strassen(subtractMatrices(A21, A11), addMatrices(B11, B12), depth + 1);
      allSteps.push({
        type: 'calc_u',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q, R, S, T, U,
        message: `U calculado`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // V = (A12 - A22) × (B21 + B22)
      allSteps.push({
        type: 'calc_v',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q, R, S, T, U,
        message: `Calculando V = (A12 - A22) × (B21 + B22)...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      const V = strassen(subtractMatrices(A12, A22), addMatrices(B21, B22), depth + 1);
      allSteps.push({
        type: 'calc_v',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22, P, Q, R, S, T, U, V,
        message: `V calculado. Todas as 7 multiplicações concluídas!`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      // Combinação
      const C11 = addMatrices(subtractMatrices(addMatrices(P, S), T), V);
      const C12 = addMatrices(R, T);
      const C21 = addMatrices(Q, S);
      const C22 = addMatrices(subtractMatrices(addMatrices(P, R), Q), U);

      allSteps.push({
        type: 'combine',
        A, B, A11, A12, A21, A22, B11, B12, B21, B22,
        P, Q, R, S, T, U, V,
        C11, C12, C21, C22,
        message: `Combinando: C11 = P+S-T+V, C12 = R+T, C21 = Q+S, C22 = P+R-Q+U`,
        callStack: allSteps[allSteps.length - 1].callStack
      });

      const result = combineMatrices(C11, C12, C21, C22);

      return result;
    };

    allSteps.push({
      type: 'init',
      A,
      B,
      message: `Iniciando multiplicação de Strassen`,
      callStack: []
    });

    const result = strassen(A, B);

    allSteps.push({
      type: 'result',
      A,
      B,
      result,
      message: `✓ Resultado final calculado!`,
      callStack: []
    });

    return allSteps;
  }, []);

  const handleStart = () => {
    const newSteps = generateSteps(matrixA, matrixB);
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

  const handleRandomize = () => {
    const size = matrixSize;
    const newA: Matrix = Array(size).fill(0).map(() =>
      Array(size).fill(0).map(() => Math.floor(Math.random() * 10))
    );
    const newB: Matrix = Array(size).fill(0).map(() =>
      Array(size).fill(0).map(() => Math.floor(Math.random() * 10))
    );
    setMatrixA(newA);
    setMatrixB(newB);
    handleReset();
  };

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  const renderMatrix = (matrix: Matrix | undefined, label: string, color: string) => {
    if (!matrix) return null;

    return (
      <div className={`p-3 rounded-lg border-2 ${color}`}>
        <div className="text-xs font-bold mb-2 text-gray-700">{label}</div>
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix.length}, minmax(0, 1fr))` }}>
          {matrix.map((row, i) =>
            row.map((val, j) => (
              <div
                key={`${i}-${j}`}
                className="w-10 h-10 flex items-center justify-center bg-white rounded text-sm font-medium"
              >
                {val}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
              <Grid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Multiplicação de Strassen</h1>
              <p className="text-gray-600">Divisão-e-Conquista: 7 multiplicações recursivas</p>
            </div>
          </div>

          {/* Configuração */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamanho das matrizes
              </label>
              <select
                value={matrixSize}
                onChange={(e) => setMatrixSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isRunning}
              >
                <option value={2}>2×2</option>
                <option value={4}>4×4 (mais lento)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleRandomize}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRunning}
              >
                Gerar Matrizes Aleatórias
              </button>
            </div>
          </div>

          {/* Matrizes de entrada */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {renderMatrix(matrixA, 'Matriz A', 'border-blue-300 bg-blue-50')}
            {renderMatrix(matrixB, 'Matriz B', 'border-purple-300 bg-purple-50')}
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
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentStepIndex <= 0}
            >
              <SkipBack className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          {/* Área de Cálculo (P-V) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Área de Cálculo (P-V)</h2>

              {currentStep ? (
                <div className="space-y-4">
                  {/* As 7 matrizes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {renderMatrix(currentStep.P, 'P', 'border-red-300 bg-red-50')}
                    {renderMatrix(currentStep.Q, 'Q', 'border-orange-300 bg-orange-50')}
                    {renderMatrix(currentStep.R, 'R', 'border-yellow-300 bg-yellow-50')}
                    {renderMatrix(currentStep.S, 'S', 'border-green-300 bg-green-50')}
                    {renderMatrix(currentStep.T, 'T', 'border-blue-300 bg-blue-50')}
                    {renderMatrix(currentStep.U, 'U', 'border-indigo-300 bg-indigo-50')}
                    {renderMatrix(currentStep.V, 'V', 'border-purple-300 bg-purple-50')}
                  </div>

                  {/* Resultado combinado (C11, C12, C21, C22) */}
                  {currentStep.C11 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 mb-2">Combinação Final</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {renderMatrix(currentStep.C11, 'C11 = P+S-T+V', 'border-green-300 bg-green-50')}
                        {renderMatrix(currentStep.C12, 'C12 = R+T', 'border-green-300 bg-green-50')}
                        {renderMatrix(currentStep.C21, 'C21 = Q+S', 'border-green-300 bg-green-50')}
                        {renderMatrix(currentStep.C22, 'C22 = P+R-Q+U', 'border-green-300 bg-green-50')}
                      </div>
                    </div>
                  )}

                  {/* Resultado final */}
                  {currentStep.result && (
                    <div>
                      {renderMatrix(currentStep.result, '✓ Resultado Final (A × B)', 'border-green-500 bg-green-100')}
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
                  'bg-orange-100 border border-orange-300'
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
            {/* Call Stack */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pilha de Chamadas</h2>

              {currentStep && currentStep.callStack.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {currentStep.callStack.map((call, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded border-l-4 border-orange-500 font-mono text-xs break-all"
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
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border border-orange-200">
              <h3 className="text-sm font-bold text-gray-800 mb-2">💡 Algoritmo de Strassen</h3>
              <p className="text-xs text-gray-600 mb-3">
                O método tradicional usa 8 multiplicações de sub-matrizes.
                Strassen reduz para 7, melhorando a complexidade.
              </p>
              <div className="space-y-1 text-xs">
                <div className="font-mono bg-white p-2 rounded">P = (A11+A22)(B11+B22)</div>
                <div className="font-mono bg-white p-2 rounded">Q = (A21+A22)·B11</div>
                <div className="font-mono bg-white p-2 rounded">R = A11·(B12-B22)</div>
                <div className="font-mono bg-white p-2 rounded">S = A22·(B21-B11)</div>
                <div className="font-mono bg-white p-2 rounded">T = (A11+A12)·B22</div>
                <div className="font-mono bg-white p-2 rounded">U = (A21-A11)(B11+B12)</div>
                <div className="font-mono bg-white p-2 rounded">V = (A12-A22)(B21+B22)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrassenSimulator;
