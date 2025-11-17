import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, SkipBack, SkipForward, Grid3x3 } from 'lucide-react';

interface Tromino {
  id: number;
  cells: [number, number][];
  color: string;
}

interface Step {
  type: 'init' | 'divide' | 'place_center' | 'focus_quadrant' | 'base_case' | 'complete';
  n: number;
  offsetX: number;
  offsetY: number;
  emptyX: number;
  emptyY: number;
  message: string;
  callStack: string[];
  trominos: Tromino[];
  highlightQuadrant?: number;
  centerTromino?: Tromino;
}

const TrominoSimulator: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(3); // 2^3 = 8x8
  const [emptyCell, setEmptyCell] = useState<[number, number]>([1, 1]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#F67280',
    '#C06C84', '#6C5B7B', '#355C7D', '#2A363B', '#99B898'
  ];

  // Gera os passos do algoritmo
  const generateSteps = useCallback((n: number, emptyPos: [number, number]): Step[] => {
    const allSteps: Step[] = [];
    let trominoId = 0;
    const allTrominos: Tromino[] = [];

    const solveTromino = (
      size: number,
      offsetX: number,
      offsetY: number,
      emptyX: number,
      emptyY: number,
      depth: number = 0
    ) => {
      const indent = '  '.repeat(depth);
      const callStackEntry = `${indent}SolveTromino(n=${size}, pos=(${offsetX},${offsetY}), empty=(${emptyX},${emptyY}))`;

      // Caso base: tabuleiro 2x2
      if (size === 1) {
        const cells: [number, number][] = [];
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            const x = offsetX + i;
            const y = offsetY + j;
            if (x !== emptyX || y !== emptyY) {
              cells.push([x, y]);
            }
          }
        }

        const tromino: Tromino = {
          id: trominoId++,
          cells,
          color: colors[trominoId % colors.length]
        };

        allTrominos.push(tromino);

        allSteps.push({
          type: 'base_case',
          n: size,
          offsetX,
          offsetY,
          emptyX,
          emptyY,
          message: `Caso base: Tabuleiro 2×2. Colocando treminó nas células não vazias.`,
          callStack: [...(allSteps[allSteps.length - 1]?.callStack || []), callStackEntry],
          trominos: [...allTrominos]
        });

        return;
      }

      // Foco no sub-problema
      allSteps.push({
        type: 'focus_quadrant',
        n: size,
        offsetX,
        offsetY,
        emptyX,
        emptyY,
        message: `Focando em tabuleiro ${Math.pow(2, size)}×${Math.pow(2, size)} com vaga em (${emptyX}, ${emptyY})`,
        callStack: [...(allSteps[allSteps.length - 1]?.callStack || []), callStackEntry],
        trominos: [...allTrominos]
      });

      // Divisão em 4 quadrantes
      allSteps.push({
        type: 'divide',
        n: size,
        offsetX,
        offsetY,
        emptyX,
        emptyY,
        message: `Dividindo em 4 quadrantes de ${Math.pow(2, size - 1)}×${Math.pow(2, size - 1)}`,
        callStack: allSteps[allSteps.length - 1].callStack,
        trominos: [...allTrominos]
      });

      const half = Math.pow(2, size - 1);
      const centerX = offsetX + half;
      const centerY = offsetY + half;

      // Identifica qual quadrante tem a vaga
      let emptyQuadrant = 0;
      if (emptyX < centerX && emptyY < centerY) emptyQuadrant = 0; // Q1 (superior esquerdo)
      else if (emptyX >= centerX && emptyY < centerY) emptyQuadrant = 1; // Q2 (superior direito)
      else if (emptyX < centerX && emptyY >= centerY) emptyQuadrant = 2; // Q3 (inferior esquerdo)
      else emptyQuadrant = 3; // Q4 (inferior direito)

      // Cria treminó central
      const centerCells: [number, number][] = [];
      const newEmptyPositions: [number, number][] = [];

      // Q1 (superior esquerdo)
      if (emptyQuadrant !== 0) {
        centerCells.push([centerX - 1, centerY - 1]);
        newEmptyPositions[0] = [centerX - 1, centerY - 1];
      } else {
        newEmptyPositions[0] = [emptyX, emptyY];
      }

      // Q2 (superior direito)
      if (emptyQuadrant !== 1) {
        centerCells.push([centerX, centerY - 1]);
        newEmptyPositions[1] = [centerX, centerY - 1];
      } else {
        newEmptyPositions[1] = [emptyX, emptyY];
      }

      // Q3 (inferior esquerdo)
      if (emptyQuadrant !== 2) {
        centerCells.push([centerX - 1, centerY]);
        newEmptyPositions[2] = [centerX - 1, centerY];
      } else {
        newEmptyPositions[2] = [emptyX, emptyY];
      }

      // Q4 (inferior direito)
      if (emptyQuadrant !== 3) {
        centerCells.push([centerX, centerY]);
        newEmptyPositions[3] = [centerX, centerY];
      } else {
        newEmptyPositions[3] = [emptyX, emptyY];
      }

      const centerTromino: Tromino = {
        id: trominoId++,
        cells: centerCells,
        color: colors[trominoId % colors.length]
      };

      allTrominos.push(centerTromino);

      allSteps.push({
        type: 'place_center',
        n: size,
        offsetX,
        offsetY,
        emptyX,
        emptyY,
        message: `Treminó central colocado, criando "vagas" nos 3 quadrantes sem vaga original`,
        callStack: allSteps[allSteps.length - 1].callStack,
        trominos: [...allTrominos],
        centerTromino,
        highlightQuadrant: emptyQuadrant
      });

      // Resolve recursivamente cada quadrante
      const quadrants = [
        { offsetX: offsetX, offsetY: offsetY, label: 'Q1 (Superior Esquerdo)' },
        { offsetX: centerX, offsetY: offsetY, label: 'Q2 (Superior Direito)' },
        { offsetX: offsetX, offsetY: centerY, label: 'Q3 (Inferior Esquerdo)' },
        { offsetX: centerX, offsetY: centerY, label: 'Q4 (Inferior Direito)' }
      ];

      quadrants.forEach((quad, i) => {
        allSteps.push({
          type: 'focus_quadrant',
          n: size - 1,
          offsetX: quad.offsetX,
          offsetY: quad.offsetY,
          emptyX: newEmptyPositions[i][0],
          emptyY: newEmptyPositions[i][1],
          message: `Resolvendo ${quad.label} recursivamente`,
          callStack: allSteps[allSteps.length - 1].callStack,
          trominos: [...allTrominos],
          highlightQuadrant: i
        });

        solveTromino(
          size - 1,
          quad.offsetX,
          quad.offsetY,
          newEmptyPositions[i][0],
          newEmptyPositions[i][1],
          depth + 1
        );
      });
    };

    // Passo inicial
    allSteps.push({
      type: 'init',
      n,
      offsetX: 0,
      offsetY: 0,
      emptyX: emptyPos[0],
      emptyY: emptyPos[1],
      message: `Iniciando preenchimento de tabuleiro ${Math.pow(2, n)}×${Math.pow(2, n)} com vaga em (${emptyPos[0]}, ${emptyPos[1]})`,
      callStack: [],
      trominos: []
    });

    solveTromino(n, 0, 0, emptyPos[0], emptyPos[1]);

    allSteps.push({
      type: 'complete',
      n,
      offsetX: 0,
      offsetY: 0,
      emptyX: emptyPos[0],
      emptyY: emptyPos[1],
      message: `✓ Tabuleiro completamente preenchido com ${allTrominos.length} treminós!`,
      callStack: [],
      trominos: [...allTrominos]
    });

    return allSteps;
  }, [colors]);

  const handleStart = () => {
    const newSteps = generateSteps(boardSize, emptyCell);
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

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const size = Math.pow(2, boardSize);

  const getCellColor = (x: number, y: number): string => {
    if (!currentStep) return 'bg-gray-100';

    // Célula vazia
    if (x === emptyCell[0] && y === emptyCell[1]) {
      return 'bg-red-500 border-red-600';
    }

    // Verifica se a célula pertence a algum treminó
    for (const tromino of currentStep.trominos) {
      for (const [tx, ty] of tromino.cells) {
        if (tx === x && ty === y) {
          return '';
        }
      }
    }

    return 'bg-white border-gray-300';
  };

  const getCellStyle = (x: number, y: number): React.CSSProperties => {
    if (!currentStep) return {};

    for (const tromino of currentStep.trominos) {
      for (const [tx, ty] of tromino.cells) {
        if (tx === x && ty === y) {
          return {
            backgroundColor: tromino.color,
            borderColor: tromino.color
          };
        }
      }
    }

    return {};
  };

  const isInHighlightedQuadrant = (x: number, y: number): boolean => {
    if (!currentStep || currentStep.highlightQuadrant === undefined) return false;

    const { offsetX, offsetY, n } = currentStep;
    const half = Math.pow(2, n - 1);
    const centerX = offsetX + half;
    const centerY = offsetY + half;

    const quad = currentStep.highlightQuadrant;

    if (quad === 0) return x < centerX && y < centerY; // Q1
    if (quad === 1) return x >= centerX && y < centerY; // Q2
    if (quad === 2) return x < centerX && y >= centerY; // Q3
    if (quad === 3) return x >= centerX && y >= centerY; // Q4

    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Preenchimento com Treminós</h1>
              <p className="text-gray-600">Divisão-e-Conquista: Transformando em 4 subproblemas menores</p>
            </div>
          </div>

          {/* Configuração */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamanho do tabuleiro (2^n)
              </label>
              <select
                value={boardSize}
                onChange={(e) => setBoardSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isRunning}
              >
                <option value={1}>2×2 (2^1)</option>
                <option value={2}>4×4 (2^2)</option>
                <option value={3}>8×8 (2^3)</option>
                <option value={4}>16×16 (2^4)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posição da célula vazia (X)
              </label>
              <input
                type="number"
                min={0}
                max={size - 1}
                value={emptyCell[0]}
                onChange={(e) => setEmptyCell([Number(e.target.value), emptyCell[1]])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posição da célula vazia (Y)
              </label>
              <input
                type="number"
                min={0}
                max={size - 1}
                value={emptyCell[1]}
                onChange={(e) => setEmptyCell([emptyCell[0], Number(e.target.value)])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isRunning}
              />
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
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentStepIndex <= 0}
            >
              <SkipBack className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          {/* Visualização do Tabuleiro */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tabuleiro {size}×{size}</h2>

              <div className="flex justify-center mb-4">
                <div
                  className="inline-grid gap-0.5 bg-gray-400 p-1 rounded"
                  style={{
                    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
                  }}
                >
                  {Array.from({ length: size }, (_, y) =>
                    Array.from({ length: size }, (_, x) => (
                      <div
                        key={`${x}-${y}`}
                        className={`border-2 transition-all duration-300 ${getCellColor(x, y)} ${
                          isInHighlightedQuadrant(x, y) ? 'ring-2 ring-yellow-400' : ''
                        }`}
                        style={{
                          width: boardSize <= 2 ? '60px' : boardSize === 3 ? '40px' : '20px',
                          height: boardSize <= 2 ? '60px' : boardSize === 3 ? '40px' : '20px',
                          ...getCellStyle(x, y)
                        }}
                      >
                        {x === emptyCell[0] && y === emptyCell[1] && (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                            ✗
                          </div>
                        )}
                      </div>
                    ))
                  ).flat()}
                </div>
              </div>

              {/* Mensagem do passo atual */}
              {currentStep && (
                <div className={`p-4 rounded-lg ${
                  currentStep.type === 'complete' ? 'bg-green-100 border border-green-300' :
                  'bg-purple-100 border border-purple-300'
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
                    <span className="text-sm font-medium text-gray-600">Tamanho (n):</span>
                    <span className="text-sm font-bold text-purple-600">{currentStep.n}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Tabuleiro:</span>
                    <span className="text-sm font-bold text-purple-600">
                      {Math.pow(2, currentStep.n)}×{Math.pow(2, currentStep.n)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Vaga em:</span>
                    <span className="text-sm font-bold text-red-600">
                      ({currentStep.emptyX}, {currentStep.emptyY})
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-600">Treminós colocados:</span>
                    <span className="text-sm font-bold text-green-600">
                      {currentStep.trominos.length}
                    </span>
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
                      className="p-2 bg-gray-50 rounded border-l-4 border-purple-500 font-mono text-xs break-all"
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

export default TrominoSimulator;
