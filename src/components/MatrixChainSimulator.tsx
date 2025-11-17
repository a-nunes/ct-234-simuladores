import React, { useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  type: 'init' | 'fill_diagonal' | 'start_band' | 'process_cell' | 'test_k' | 'update_cell' | 'complete';
  description: string;
  b?: number; // Tamanho do subproblema (distância da diagonal)
  i?: number;
  j?: number;
  k?: number;
  x?: number;
  N: (number | null)[][];
  T: (number | null)[][];
}

const MatrixChainSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Estados para configuração
  const [dimensions, setDimensions] = useState<number[]>([5, 4, 1, 3, 7, 2]);

  // Estados do simulador
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Função para gerar os passos do algoritmo
  const generateSteps = useCallback((): Step[] => {
    const stepList: Step[] = [];
    const n = dimensions.length - 1; // Número de matrizes
    const N: (number | null)[][] = Array(n).fill(null).map(() => Array(n).fill(null));
    const T: (number | null)[][] = Array(n).fill(null).map(() => Array(n).fill(null));

    // Passo 0: Inicialização
    stepList.push({
      type: 'init',
      description: `Iniciando algoritmo de Encadeamento de Matrizes. Temos ${n} matrizes. Criando tabelas N (custo) e T (divisão).`,
      N: N.map(row => [...row]),
      T: T.map(row => [...row])
    });

    // Preencher diagonal principal com 0
    for (let i = 0; i < n; i++) {
      N[i][i] = 0;
    }

    stepList.push({
      type: 'fill_diagonal',
      description: `Preenchendo diagonal principal: N[i,i] = 0 (custo de multiplicar uma matriz sozinha é 0).`,
      N: N.map(row => [...row]),
      T: T.map(row => [...row])
    });

    // Loop por tamanho de subproblema (b = distância da diagonal)
    for (let b = 1; b < n; b++) {
      stepList.push({
        type: 'start_band',
        description: `Iniciando banda b = ${b} (subproblemas de tamanho ${b + 1}).`,
        b: b,
        N: N.map(row => [...row]),
        T: T.map(row => [...row])
      });

      for (let i = 0; i < n - b; i++) {
        const j = i + b;

        stepList.push({
          type: 'process_cell',
          description: `Processando célula N[${i},${j}] (multiplicar matrizes A${i} até A${j}).`,
          b: b,
          i: i,
          j: j,
          N: N.map(row => [...row]),
          T: T.map(row => [...row])
        });

        N[i][j] = Infinity;
        let bestK = i;

        // Testar todas as divisões k
        for (let k = i; k < j; k++) {
          const x = (N[i][k] || 0) + (N[k + 1][j] || 0) + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];

          stepList.push({
            type: 'test_k',
            description: `Testando k = ${k}: N[${i},${k}] + N[${k+1},${j}] + d[${i}]×d[${k+1}]×d[${j+1}] = ${N[i][k]} + ${N[k+1][j]} + ${dimensions[i]}×${dimensions[k+1]}×${dimensions[j+1]} = ${x}`,
            b: b,
            i: i,
            j: j,
            k: k,
            x: x,
            N: N.map(row => [...row]),
            T: T.map(row => [...row])
          });

          if (x < (N[i][j] || Infinity)) {
            N[i][j] = x;
            T[i][j] = k;
            bestK = k;

            stepList.push({
              type: 'update_cell',
              description: `✓ ${x} é melhor! Atualizando: N[${i},${j}] = ${x}, T[${i},${j}] = ${k}`,
              b: b,
              i: i,
              j: j,
              k: k,
              x: x,
              N: N.map(row => [...row]),
              T: T.map(row => [...row])
            });
          }
        }

        stepList.push({
          type: 'update_cell',
          description: `Célula N[${i},${j}] = ${N[i][j]} finalizada. Melhor divisão em k = ${bestK}.`,
          b: b,
          i: i,
          j: j,
          k: bestK,
          N: N.map(row => [...row]),
          T: T.map(row => [...row])
        });
      }
    }

    stepList.push({
      type: 'complete',
      description: `Algoritmo concluído! Custo mínimo: N[0,${n-1}] = ${N[0][n-1]} operações. Use T para reconstruir o parentesamento ótimo.`,
      N: N.map(row => [...row]),
      T: T.map(row => [...row])
    });

    return stepList;
  }, [dimensions]);

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

  // Atualizar dimensões
  const handleDimensionChange = (index: number, value: string) => {
    const newDimensions = [...dimensions];
    newDimensions[index] = parseInt(value) || 1;
    setDimensions(newDimensions);
  };

  const handleAddMatrix = () => {
    setDimensions([...dimensions, 2]);
  };

  const handleRemoveMatrix = () => {
    if (dimensions.length > 3) {
      setDimensions(dimensions.slice(0, -1));
    }
  };

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const n = dimensions.length - 1;

  // Renderizar célula da matriz
  const renderMatrixCell = (i: number, j: number, value: number | null, isN: boolean) => {
    if (!currentStep) return null;

    const isCurrent = currentStep.i === i && currentStep.j === j;
    const isPast = (currentStep.b !== undefined) && (j - i < currentStep.b);
    const isDiagonal = i === j;

    let bgColor = 'bg-gray-50';
    let borderColor = 'border-gray-300';
    let textColor = 'text-gray-400';

    if (isDiagonal && isN) {
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-300';
      textColor = 'text-blue-700';
    } else if (isCurrent) {
      bgColor = 'bg-yellow-100';
      borderColor = 'border-yellow-500';
      textColor = 'text-yellow-700';
    } else if (isPast && value !== null) {
      bgColor = 'bg-green-50';
      borderColor = 'border-green-300';
      textColor = 'text-green-700';
    } else if (value !== null) {
      textColor = 'text-gray-700';
    }

    return (
      <div
        className={`flex items-center justify-center w-16 h-16 border-2 ${bgColor} ${borderColor} transition-all duration-300 ${
          isCurrent ? 'scale-110' : ''
        }`}
      >
        <span className={`text-sm font-bold ${textColor}`}>
          {value === null ? '-' : value === Infinity ? '∞' : value}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
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
              <h1 className="text-3xl font-bold text-gray-800">Encadeamento do Produto de Matrizes</h1>
              <p className="text-gray-600">Programação Dinâmica - Preenchimento por diagonais</p>
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
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
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

        {/* Configuração */}
        {!isSimulating && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Configuração das Matrizes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Defina o vetor de dimensões. Matriz A<sub>i</sub> tem dimensão d[i] × d[i+1].
              <br />
              Exemplo: d = [5, 4, 1, 3] → A<sub>0</sub> é 5×4, A<sub>1</sub> é 4×1, A<sub>2</sub> é 1×3
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-medium">d = [</span>
                {dimensions.map((dim, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={dim}
                      onChange={(e) => handleDimensionChange(index, e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                      min="1"
                      max="99"
                    />
                    {index < dimensions.length - 1 && <span>,</span>}
                  </div>
                ))}
                <span className="font-medium">]</span>
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleAddMatrix}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Adicionar Matriz
                </button>
                <button
                  onClick={handleRemoveMatrix}
                  disabled={dimensions.length <= 3}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300"
                >
                  - Remover Última
                </button>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Matrizes geradas:</p>
                {Array.from({ length: n }, (_, i) => (
                  <p key={i} className="text-sm text-blue-700">
                    A<sub>{i}</sub>: {dimensions[i]} × {dimensions[i + 1]}
                  </p>
                ))}
              </div>
            </div>
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

            {/* Matriz N (Custo) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Matriz N - Custo Mínimo</h3>
              <div className="overflow-x-auto">
                <div className="inline-block">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `40px repeat(${n}, 64px)` }}>
                    <div></div>
                    {Array.from({ length: n }, (_, j) => (
                      <div key={j} className="flex items-center justify-center text-sm font-medium text-gray-600">
                        {j}
                      </div>
                    ))}
                    {Array.from({ length: n }, (_, i) => (
                      <React.Fragment key={i}>
                        <div className="flex items-center justify-center text-sm font-medium text-gray-600">
                          {i}
                        </div>
                        {Array.from({ length: n }, (_, j) => (
                          <div key={j}>
                            {i <= j ? renderMatrixCell(i, j, currentStep.N[i][j], true) : (
                              <div className="w-16 h-16 bg-gray-100"></div>
                            )}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Matriz T (Divisão) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Matriz T - Índice k da Melhor Divisão</h3>
              <div className="overflow-x-auto">
                <div className="inline-block">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `40px repeat(${n}, 64px)` }}>
                    <div></div>
                    {Array.from({ length: n }, (_, j) => (
                      <div key={j} className="flex items-center justify-center text-sm font-medium text-gray-600">
                        {j}
                      </div>
                    ))}
                    {Array.from({ length: n }, (_, i) => (
                      <React.Fragment key={i}>
                        <div className="flex items-center justify-center text-sm font-medium text-gray-600">
                          {i}
                        </div>
                        {Array.from({ length: n }, (_, j) => (
                          <div key={j}>
                            {i <= j ? renderMatrixCell(i, j, currentStep.T[i][j], false) : (
                              <div className="w-16 h-16 bg-gray-100"></div>
                            )}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Painel de Estado */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Estado Atual</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {currentStep.b !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Banda b</p>
                    <p className="text-2xl font-bold text-indigo-600">{currentStep.b}</p>
                  </div>
                )}
                {currentStep.i !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Linha i</p>
                    <p className="text-2xl font-bold text-blue-600">{currentStep.i}</p>
                  </div>
                )}
                {currentStep.j !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Coluna j</p>
                    <p className="text-2xl font-bold text-green-600">{currentStep.j}</p>
                  </div>
                )}
                {currentStep.k !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Divisão k</p>
                    <p className="text-2xl font-bold text-yellow-600">{currentStep.k}</p>
                  </div>
                )}
                {currentStep.x !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Custo x</p>
                    <p className="text-2xl font-bold text-purple-600">{currentStep.x}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Explicação */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Sobre o Algoritmo</h3>
          <div className="text-gray-700 space-y-2 text-sm">
            <p>
              <strong>Objetivo:</strong> Encontrar a ordem ótima para multiplicar n matrizes, minimizando o número total de operações escalares.
            </p>
            <p>
              <strong>Subestrutura Ótima:</strong> A solução ótima para multiplicar A<sub>i</sub>...A<sub>j</sub> contém soluções ótimas para subproblemas menores.
            </p>
            <p>
              <strong>Preenchimento:</strong> Por diagonais (banda b), começando com subproblemas pequenos (diagonal principal) até o problema completo.
            </p>
            <p>
              <strong>Fórmula:</strong> N[i,j] = min<sub>k</sub>(N[i,k] + N[k+1,j] + d[i]×d[k+1]×d[j+1])
            </p>
            <p>
              <strong>Complexidade:</strong> O(n³) - Três loops aninhados (b, i, k).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixChainSimulator;
