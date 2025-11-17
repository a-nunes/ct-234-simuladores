import React, { useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

type Direction = 'DIAGONAL' | 'CIMA' | 'ESQUERDA' | null;

interface Step {
  type: 'init' | 'fill_borders' | 'process_cell' | 'match' | 'no_match_up' | 'no_match_left' | 'start_traceback' | 'traceback_step' | 'complete';
  description: string;
  i?: number;
  j?: number;
  c: number[][];
  trace: Direction[][];
  lcs?: string;
  tracebackI?: number;
  tracebackJ?: number;
}

const LCSSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Estados para configuração
  const [stringX, setStringX] = useState<string>('ABCBDAB');
  const [stringY, setStringY] = useState<string>('BDCABA');

  // Estados do simulador
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Função para gerar os passos do algoritmo
  const generateSteps = useCallback((): Step[] => {
    const stepList: Step[] = [];
    const m = stringX.length;
    const n = stringY.length;
    const c: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    const trace: Direction[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null));

    // Inicialização
    stepList.push({
      type: 'init',
      description: `Inicializando algoritmo LCS. X = "${stringX}" (${m} caracteres), Y = "${stringY}" (${n} caracteres).`,
      c: c.map(row => [...row]),
      trace: trace.map(row => [...row])
    });

    // Preencher bordas com 0
    stepList.push({
      type: 'fill_borders',
      description: `Preenchendo linha 0 e coluna 0 com 0 (LCS de string vazia é 0).`,
      c: c.map(row => [...row]),
      trace: trace.map(row => [...row])
    });

    // Loop principal
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const charX = stringX[i - 1];
        const charY = stringY[j - 1];

        stepList.push({
          type: 'process_cell',
          description: `Processando c[${i},${j}]. Comparando X[${i}]='${charX}' com Y[${j}]='${charY}'.`,
          i: i,
          j: j,
          c: c.map(row => [...row]),
          trace: trace.map(row => [...row])
        });

        if (charX === charY) {
          c[i][j] = c[i - 1][j - 1] + 1;
          trace[i][j] = 'DIAGONAL';

          stepList.push({
            type: 'match',
            description: `✓ '${charX}' == '${charY}'! c[${i},${j}] = c[${i-1},${j-1}] + 1 = ${c[i-1][j-1]} + 1 = ${c[i][j]}. Seta: DIAGONAL ↖`,
            i: i,
            j: j,
            c: c.map(row => [...row]),
            trace: trace.map(row => [...row])
          });
        } else {
          if (c[i - 1][j] >= c[i][j - 1]) {
            c[i][j] = c[i - 1][j];
            trace[i][j] = 'CIMA';

            stepList.push({
              type: 'no_match_up',
              description: `✗ '${charX}' ≠ '${charY}'. c[${i-1},${j}] (${c[i-1][j]}) >= c[${i},${j-1}] (${c[i][j-1]}). c[${i},${j}] = ${c[i][j]}. Seta: CIMA ↑`,
              i: i,
              j: j,
              c: c.map(row => [...row]),
              trace: trace.map(row => [...row])
            });
          } else {
            c[i][j] = c[i][j - 1];
            trace[i][j] = 'ESQUERDA';

            stepList.push({
              type: 'no_match_left',
              description: `✗ '${charX}' ≠ '${charY}'. c[${i},${j-1}] (${c[i][j-1]}) > c[${i-1},${j}] (${c[i-1][j]}). c[${i},${j}] = ${c[i][j]}. Seta: ESQUERDA ←`,
              i: i,
              j: j,
              c: c.map(row => [...row]),
              trace: trace.map(row => [...row])
            });
          }
        }
      }
    }

    // Traceback para construir LCS
    stepList.push({
      type: 'start_traceback',
      description: `Tabelas preenchidas! LCS tem comprimento ${c[m][n]}. Iniciando traceback de [${m},${n}] para reconstruir a LCS.`,
      c: c.map(row => [...row]),
      trace: trace.map(row => [...row]),
      tracebackI: m,
      tracebackJ: n
    });

    let lcsChars: string[] = [];
    let ti = m;
    let tj = n;

    while (ti > 0 && tj > 0) {
      const direction = trace[ti][tj];

      stepList.push({
        type: 'traceback_step',
        description: `Traceback em [${ti},${tj}]: trace = ${direction}. ${
          direction === 'DIAGONAL'
            ? `Adicionando '${stringX[ti - 1]}' à LCS.`
            : direction === 'CIMA'
            ? 'Subindo (i-1).'
            : 'Indo à esquerda (j-1).'
        }`,
        c: c.map(row => [...row]),
        trace: trace.map(row => [...row]),
        tracebackI: ti,
        tracebackJ: tj,
        lcs: lcsChars.reverse().join('')
      });

      if (direction === 'DIAGONAL') {
        lcsChars.unshift(stringX[ti - 1]);
        ti--;
        tj--;
      } else if (direction === 'CIMA') {
        ti--;
      } else {
        tj--;
      }
    }

    const finalLCS = lcsChars.reverse().join('');

    stepList.push({
      type: 'complete',
      description: `Traceback concluído! LCS = "${finalLCS}" (comprimento ${c[m][n]}).`,
      c: c.map(row => [...row]),
      trace: trace.map(row => [...row]),
      lcs: finalLCS
    });

    return stepList;
  }, [stringX, stringY]);

  // Iniciar simulação
  const handleStart = () => {
    const generatedSteps = generateSteps();
    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsSimulating(true);
  };

  // Resetar
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

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const m = stringX.length;
  const n = stringY.length;

  // Renderizar célula
  const renderCell = (i: number, j: number) => {
    if (!currentStep) return null;

    const value = currentStep.c[i][j];
    const arrow = currentStep.trace[i][j];
    const isCurrent = currentStep.i === i && currentStep.j === j;
    const isTraceback = currentStep.tracebackI === i && currentStep.tracebackJ === j;

    let bgColor = 'bg-gray-50';
    let borderColor = 'border-gray-300';

    if (isTraceback) {
      bgColor = 'bg-purple-100';
      borderColor = 'border-purple-500';
    } else if (isCurrent) {
      bgColor = 'bg-yellow-100';
      borderColor = 'border-yellow-500';
    } else if (value > 0 && !isCurrent) {
      bgColor = 'bg-green-50';
      borderColor = 'border-green-300';
    }

    const arrowSymbol = arrow === 'DIAGONAL' ? '↖' : arrow === 'CIMA' ? '↑' : arrow === 'ESQUERDA' ? '←' : '';

    return (
      <div
        className={`flex flex-col items-center justify-center w-14 h-14 border-2 ${bgColor} ${borderColor} transition-all duration-300 ${
          isCurrent || isTraceback ? 'scale-110' : ''
        }`}
      >
        <span className="text-xs text-gray-500">{arrowSymbol}</span>
        <span className="text-lg font-bold text-gray-700">{value}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
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
              <h1 className="text-3xl font-bold text-gray-800">Maior Subsequência Comum (LCS)</h1>
              <p className="text-gray-600">Programação Dinâmica - Tabelas c e trace</p>
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
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 transition-colors"
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
            <h3 className="text-lg font-semibold mb-4">Configurar Strings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">String X</label>
                <input
                  type="text"
                  value={stringX}
                  onChange={(e) => setStringX(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                  placeholder="ABCBDAB"
                  maxLength={15}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">String Y</label>
                <input
                  type="text"
                  value={stringY}
                  onChange={(e) => setStringY(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                  placeholder="BDCABA"
                  maxLength={15}
                />
              </div>
            </div>
          </div>
        )}

        {/* Visualização */}
        {isSimulating && currentStep && (
          <div className="space-y-6">
            {/* Descrição */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Passo Atual</h3>
              <p className="text-gray-700">{currentStep.description}</p>
            </div>

            {/* Tabela c com trace */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Tabela c (comprimento) e trace (setas)</h3>
              <div className="overflow-x-auto">
                <div className="inline-block">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `60px 56px repeat(${n}, 56px)` }}>
                    {/* Header */}
                    <div></div>
                    <div className="flex items-center justify-center text-sm font-medium">∅</div>
                    {stringY.split('').map((char, j) => (
                      <div key={j} className="flex items-center justify-center text-sm font-bold text-blue-600">
                        {char}
                      </div>
                    ))}
                    
                    {/* Linha 0 */}
                    <div className="flex items-center justify-center text-sm font-medium">∅</div>
                    {Array.from({ length: n + 1 }, (_, j) => (
                      <div key={j}>{renderCell(0, j)}</div>
                    ))}

                    {/* Linhas 1 a m */}
                    {Array.from({ length: m }, (_, i) => (
                      <React.Fragment key={i}>
                        <div className="flex items-center justify-center text-sm font-bold text-blue-600">
                          {stringX[i]}
                        </div>
                        {Array.from({ length: n + 1 }, (_, j) => (
                          <div key={j}>{renderCell(i + 1, j)}</div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>↖ DIAGONAL: caracteres iguais, adiciona à LCS</p>
                <p>↑ CIMA: vem de c[i-1, j]</p>
                <p>← ESQUERDA: vem de c[i, j-1]</p>
              </div>
            </div>

            {/* LCS em construção */}
            {currentStep.lcs !== undefined && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">LCS em Construção</h3>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-2xl font-mono font-bold text-purple-700 text-center">
                    {currentStep.lcs || '(vazia)'}
                  </p>
                </div>
              </div>
            )}

            {/* Estado */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Estado Atual</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentStep.i !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Linha i</p>
                    <p className="text-2xl font-bold text-cyan-600">{currentStep.i}</p>
                  </div>
                )}
                {currentStep.j !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Coluna j</p>
                    <p className="text-2xl font-bold text-blue-600">{currentStep.j}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Comprimento LCS</p>
                  <p className="text-2xl font-bold text-green-600">{currentStep.c[m][n]}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Explicação */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Sobre o Algoritmo</h3>
          <div className="text-gray-700 space-y-2 text-sm">
            <p>
              <strong>Objetivo:</strong> Encontrar a maior subsequência comum entre duas strings (caracteres não precisam ser consecutivos).
            </p>
            <p>
              <strong>Recorrência:</strong> Se X[i] == Y[j]: c[i,j] = c[i-1,j-1] + 1. Senão: c[i,j] = max(c[i-1,j], c[i,j-1])
            </p>
            <p>
              <strong>Traceback:</strong> Usa a matriz trace para reconstruir a LCS seguindo as setas.
            </p>
            <p>
              <strong>Aplicações:</strong> Diff de arquivos, bioinformática (comparação de DNA), detecção de plágio.
            </p>
            <p>
              <strong>Complexidade:</strong> O(m × n) tempo e espaço.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCSSimulator;
