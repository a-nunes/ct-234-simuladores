// @ts-nocheck
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, SkipForward, RotateCcw } from 'lucide-react';

interface PreprocessStep {
  phase: 'preprocess';
  i: number;
  j: number;
  comparing: boolean;
  match: boolean | null;
  action: string;
  failureTable: number[];
  message: string;
}

interface SearchStep {
  phase: 'search';
  i: number;
  j: number;
  position: number;
  comparing: boolean;
  match: boolean | null;
  action: string;
  comparisonCount: number;
  message: string;
  found: boolean;
  usedFailure: boolean;
  failureValue?: number;
}

type Step = PreprocessStep | SearchStep;

const App = () => {
  const [text, setText] = useState('abacaabaccabacabaabb');
  const [pattern, setPattern] = useState('abacab');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [failureFunction, setFailureFunction] = useState<number[]>([]);

  const buildFailureFunction = (pattern: string): { table: number[], steps: PreprocessStep[] } => {
    const m = pattern.length;
    const F: number[] = new Array(m).fill(-1);
    F[0] = 0;
    const steps: PreprocessStep[] = [];
    
    // Passo inicial
    steps.push({
      phase: 'preprocess',
      i: 1,
      j: 0,
      comparing: false,
      match: null,
      action: 'init',
      failureTable: [...F],
      message: 'Inicializando: F[0] = 0. Começando com i=1 e j=0'
    });

    let j = 0;
    let i = 1;

    while (i < m) {
      // Comparação
      steps.push({
        phase: 'preprocess',
        i,
        j,
        comparing: true,
        match: null,
        action: 'compare',
        failureTable: [...F],
        message: `Comparando P[${i}]='${pattern[i]}' com P[${j}]='${pattern[j]}'`
      });

      if (pattern[i] === pattern[j]) {
        // Match
        F[i] = j + 1;
        steps.push({
          phase: 'preprocess',
          i,
          j,
          comparing: true,
          match: true,
          action: 'match',
          failureTable: [...F],
          message: `Match! F[${i}] = ${j + 1}. Incrementando i e j`
        });
        i++;
        j++;
      } else {
        // Mismatch
        steps.push({
          phase: 'preprocess',
          i,
          j,
          comparing: true,
          match: false,
          action: 'mismatch',
          failureTable: [...F],
          message: `Falha. P[${i}] ≠ P[${j}]`
        });

        if (j > 0) {
          const oldJ = j;
          j = F[j - 1];
          steps.push({
            phase: 'preprocess',
            i,
            j,
            comparing: false,
            match: false,
            action: 'use_failure',
            failureTable: [...F],
            message: `Usando F[${oldJ - 1}] = ${j}. j agora é ${j}`
          });
        } else {
          F[i] = 0;
          steps.push({
            phase: 'preprocess',
            i,
            j,
            comparing: false,
            match: false,
            action: 'base_case',
            failureTable: [...F],
            message: `j=0. F[${i}] = 0. Incrementando i`
          });
          i++;
        }
      }
    }

    steps.push({
      phase: 'preprocess',
      i: m,
      j,
      comparing: false,
      match: null,
      action: 'complete',
      failureTable: [...F],
      message: '✓ Função de falha calculada! Iniciando busca no texto...'
    });

    return { table: F, steps };
  };

  const kmpSearch = (text: string, pattern: string, F: number[]): SearchStep[] => {
    const n = text.length;
    const m = pattern.length;
    const steps: SearchStep[] = [];
    let comparisonCount = 0;
    let i = 0;
    let j = 0;

    // Passo inicial
    steps.push({
      phase: 'search',
      i: 0,
      j: 0,
      position: 0,
      comparing: false,
      match: null,
      action: 'init',
      comparisonCount: 0,
      message: 'Iniciando busca. i=0, j=0',
      found: false,
      usedFailure: false
    });

    while (i < n) {
      // Comparação
      comparisonCount++;
      const isMatch = text[i] === pattern[j];
      
      steps.push({
        phase: 'search',
        i,
        j,
        position: i - j,
        comparing: true,
        match: isMatch,
        action: 'compare',
        comparisonCount,
        message: `Passo ${comparisonCount}: Comparando T[${i}]='${text[i]}' com P[${j}]='${pattern[j]}'`,
        found: false,
        usedFailure: false
      });

      if (isMatch) {
        if (j === m - 1) {
          // Padrão encontrado!
          steps.push({
            phase: 'search',
            i,
            j,
            position: i - j,
            comparing: true,
            match: true,
            action: 'found',
            comparisonCount,
            message: `✓ PADRÃO ENCONTRADO na posição ${i - j + 1}! Total de comparações: ${comparisonCount}`,
            found: true,
            usedFailure: false
          });
          break;
        } else {
          // Match, continua
          i++;
          j++;
          steps.push({
            phase: 'search',
            i,
            j,
            position: i - j,
            comparing: false,
            match: true,
            action: 'advance',
            comparisonCount,
            message: `Match! Avançando: i=${i}, j=${j}`,
            found: false,
            usedFailure: false
          });
        }
      } else {
        // Mismatch
        if (j > 0) {
          const failureValue = F[j - 1];
          const oldJ = j;
          j = failureValue;
          steps.push({
            phase: 'search',
            i,
            j,
            position: i - j,
            comparing: false,
            match: false,
            action: 'use_failure',
            comparisonCount,
            message: `Falha. Usando F[${oldJ - 1}] = ${failureValue}. Deslocando padrão, j=${j}`,
            found: false,
            usedFailure: true,
            failureValue
          });
        } else {
          // j = 0, avança só o i
          i++;
          steps.push({
            phase: 'search',
            i,
            j,
            position: i - j,
            comparing: false,
            match: false,
            action: 'advance_i',
            comparisonCount,
            message: `Falha em j=0. Avançando texto: i=${i}`,
            found: false,
            usedFailure: false
          });
        }
      }
    }

    if (i >= n && !steps[steps.length - 1].found) {
      steps.push({
        phase: 'search',
        i,
        j,
        position: i - j,
        comparing: false,
        match: null,
        action: 'not_found',
        comparisonCount,
        message: `Fim do texto alcançado. Padrão não encontrado. Total de comparações: ${comparisonCount}`,
        found: false,
        usedFailure: false
      });
    }

    return steps;
  };

  const simulate = () => {
    if (text && pattern) {
      const { table, steps: preprocessSteps } = buildFailureFunction(pattern);
      setFailureFunction(table);
      
      const searchSteps = kmpSearch(text, pattern, table);
      const allSteps = [...preprocessSteps, ...searchSteps];
      
      setSteps(allSteps);
      setCurrentStep(0);
      setShowSteps(true);
    }
  };

  const reset = () => {
    setShowSteps(false);
    setSteps([]);
    setCurrentStep(0);
    setFailureFunction([]);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jumpToEnd = () => {
    setCurrentStep(steps.length - 1);
  };

  const stepData = steps[currentStep];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Simulador KMP (Knuth-Morris-Pratt) - Passo a Passo</h1>
      
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto (T):
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o texto"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Padrão (P):
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o padrão"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={simulate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Iniciar Simulação
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Limpar
          </button>
        </div>
      </div>

      {showSteps && steps.length > 0 && (
        <div className="space-y-6">
          {/* Controles de navegação */}
          <div className={`${stepData?.phase === 'preprocess' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'} border rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Passo {currentStep + 1} de {steps.length}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span className={`font-semibold ${stepData?.phase === 'preprocess' ? 'text-purple-700' : 'text-blue-700'}`}>
                    {stepData?.phase === 'preprocess' ? '📋 FASE 1: Pré-processamento (Função de Falha)' : '🔍 FASE 2: Busca no Texto'}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentStep(0)}
                  disabled={currentStep === 0}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Primeiro passo"
                >
                  <RotateCcw size={20} />
                </button>
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Passo anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Próximo passo"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={jumpToEnd}
                  disabled={currentStep === steps.length - 1}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Último passo"
                >
                  <SkipForward size={20} />
                </button>
              </div>
            </div>
            
            {/* Informações do passo atual */}
            <div className="bg-white rounded-lg p-4 space-y-2">
              {stepData?.phase === 'preprocess' ? (
                <>
                  <p className="text-sm">
                    <span className="font-semibold">Ponteiro i (sufixos):</span> {stepData.i < pattern.length ? stepData.i : 'fim'}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Ponteiro j (prefixos):</span> {stepData.j}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm">
                    <span className="font-semibold">Ponteiro i (texto):</span> {(stepData as SearchStep).i}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Ponteiro j (padrão):</span> {(stepData as SearchStep).j}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Posição de alinhamento:</span> {(stepData as SearchStep).position + 1}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Comparações realizadas:</span> {(stepData as SearchStep).comparisonCount}
                  </p>
                  {(stepData as SearchStep).usedFailure && (
                    <p className="text-sm text-purple-700">
                      <span className="font-semibold">→ Usou F[{(stepData as SearchStep).j}] = {(stepData as SearchStep).failureValue}</span>
                    </p>
                  )}
                </>
              )}
              <p className={`text-sm font-semibold mt-2 ${stepData?.phase === 'preprocess' ? 'text-purple-700' : 'text-blue-700'}`}>
                {stepData?.message}
              </p>
              {stepData?.phase === 'search' && (stepData as SearchStep).found && (
                <p className="text-sm font-bold text-green-600 mt-2">
                  ✓ Padrão encontrado na posição {(stepData as SearchStep).position + 1}!
                </p>
              )}
            </div>
          </div>

          {/* Visualização */}
          {stepData?.phase === 'preprocess' ? (
            // FASE 1: Pré-processamento
            <div className="border border-purple-300 rounded-lg p-6 bg-purple-50">
              <h3 className="font-semibold text-gray-800 mb-4">Cálculo da Função de Falha F[]</h3>
              
              {/* Padrão com índices */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Padrão P:</p>
                <div className="flex gap-1 mb-1">
                  {pattern.split('').map((_, idx) => (
                    <div key={idx} className="w-12 text-center text-xs text-gray-500">
                      j={idx}
                    </div>
                  ))}
                </div>
                <div className="flex gap-1 mb-2">
                  {pattern.split('').map((char, idx) => {
                    let bgColor = 'bg-white';
                    let textColor = 'text-gray-800';
                    let borderColor = 'border-gray-300';
                    
                    if (stepData.comparing) {
                      if (idx === stepData.i) {
                        bgColor = stepData.match === true ? 'bg-green-100' : stepData.match === false ? 'bg-red-100' : 'bg-yellow-100';
                        borderColor = 'border-blue-500';
                        textColor = 'font-bold';
                      } else if (idx === stepData.j) {
                        bgColor = stepData.match === true ? 'bg-green-100' : stepData.match === false ? 'bg-red-100' : 'bg-yellow-100';
                        borderColor = 'border-purple-500';
                        textColor = 'font-bold';
                      }
                    }
                    
                    return (
                      <div
                        key={idx}
                        className={`w-12 h-12 flex items-center justify-center border-2 ${borderColor} ${bgColor} ${textColor} font-mono text-lg`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                
                {/* Ponteiros */}
                <div className="flex gap-1">
                  {pattern.split('').map((_, idx) => (
                    <div key={idx} className="w-12 text-center text-xs font-semibold">
                      {idx === stepData.j && <span className="text-purple-600">↑ j</span>}
                      {idx === stepData.i && stepData.i < pattern.length && <span className="text-blue-600">↑ i</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela F[] */}
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Tabela F[] (Função de Falha):</p>
                <div className="flex gap-1 mb-1">
                  {(stepData as PreprocessStep).failureTable.map((_, idx) => (
                    <div key={idx} className="w-12 text-center text-xs text-gray-500">
                      F[{idx}]
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {(stepData as PreprocessStep).failureTable.map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-12 flex items-center justify-center border-2 font-mono text-lg font-semibold ${
                        val >= 0 ? 'bg-green-50 border-green-400 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}
                    >
                      {val >= 0 ? val : '-'}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">Legenda:</p>
                <p>• <span className="text-purple-600 font-semibold">j</span>: ponteiro que percorre os prefixos</p>
                <p>• <span className="text-blue-600 font-semibold">i</span>: ponteiro que percorre os sufixos</p>
                <p>• F[k]: tamanho do maior prefixo de P[0..k] que é sufixo de P[1..k]</p>
              </div>
            </div>
          ) : (
            // FASE 2: Busca
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 overflow-x-auto">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">P = {pattern}</p>
              </div>
              
              {/* Texto principal */}
              <div className="mb-8" style={{ minWidth: `${text.length * 40}px` }}>
                <div className="flex mb-1">
                  {text.split('').map((_, idx) => (
                    <div key={idx} style={{ width: '40px', minWidth: '40px' }} className="text-center text-xs text-gray-500 flex-shrink-0">
                      {idx}
                    </div>
                  ))}
                </div>

                <div className="flex border-2 border-gray-400">
                  {text.split('').map((char, idx) => {
                    const searchStep = stepData as SearchStep;
                    let bgColor = 'bg-white';
                    
                    if (searchStep.comparing && idx === searchStep.i) {
                      bgColor = searchStep.match ? 'bg-green-100' : 'bg-red-100';
                    }
                    
                    return (
                      <div
                        key={idx}
                        style={{ width: '40px', height: '40px', minWidth: '40px' }}
                        className={`flex items-center justify-center border border-gray-300 ${bgColor} font-mono flex-shrink-0`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>

                {/* Ponteiro i */}
                <div className="flex mt-1">
                  {text.split('').map((_, idx) => (
                    <div key={idx} style={{ width: '40px', minWidth: '40px' }} className="text-center text-xs font-semibold flex-shrink-0">
                      {idx === (stepData as SearchStep).i && <span className="text-blue-600">↑ i</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Padrão alinhado */}
              <div className="relative" style={{ minWidth: `${text.length * 40}px` }}>
                <div 
                  className="flex absolute"
                  style={{ left: `${(stepData as SearchStep).position * 40}px` }}
                >
                  {pattern.split('').map((char, idx) => {
                    const searchStep = stepData as SearchStep;
                    let bgColor = 'bg-gray-100';
                    let textColor = 'text-gray-600';
                    let borderColor = 'border-gray-400';
                    
                    if (idx < searchStep.j) {
                      bgColor = 'bg-green-100';
                      textColor = 'text-green-800 font-semibold';
                      borderColor = 'border-green-400';
                    } else if (searchStep.comparing && idx === searchStep.j) {
                      if (searchStep.match) {
                        bgColor = 'bg-green-100';
                        textColor = 'text-green-800 font-bold';
                        borderColor = 'border-green-500';
                      } else {
                        bgColor = 'bg-red-100';
                        textColor = 'text-red-600 font-bold';
                        borderColor = 'border-red-500';
                      }
                    }
                    
                    if (searchStep.found) {
                      bgColor = 'bg-green-200';
                      textColor = 'text-green-900 font-bold';
                      borderColor = 'border-green-600';
                    }
                    
                    return (
                      <div
                        key={idx}
                        style={{ width: '40px', height: '40px', minWidth: '40px' }}
                        className={`flex items-center justify-center border-2 ${borderColor} ${bgColor} ${textColor} font-mono flex-shrink-0`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                
                {/* Ponteiro j */}
                <div 
                  className="flex absolute"
                  style={{ left: `${(stepData as SearchStep).position * 40}px`, top: '44px' }}
                >
                  {pattern.split('').map((_, idx) => (
                    <div key={idx} style={{ width: '40px', minWidth: '40px' }} className="text-center text-xs font-semibold flex-shrink-0">
                      {idx === (stepData as SearchStep).j && <span className="text-purple-600">↑ j</span>}
                    </div>
                  ))}
                </div>
                
                <div className="h-16"></div>
              </div>
            </div>
          )}

          {/* Tabela F[] sempre visível após calculada */}
          {failureFunction.length > 0 && (
            <div className="border border-purple-300 rounded-lg p-4 bg-purple-50">
              <h3 className="font-semibold text-gray-800 mb-3">Tabela F[] - Função de Falha</h3>
              <div className="bg-white rounded-lg p-3">
                <div className="flex gap-1 mb-1">
                  {failureFunction.map((_, idx) => (
                    <div key={idx} className="w-12 text-center text-xs text-gray-500">
                      j={idx}
                    </div>
                  ))}
                </div>
                <div className="flex gap-1 mb-1">
                  {pattern.split('').map((char, idx) => (
                    <div key={idx} className="w-12 h-10 flex items-center justify-center border border-gray-300 bg-gray-50 font-mono text-sm">
                      {char}
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {failureFunction.map((val, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-10 flex items-center justify-center border-2 border-purple-400 bg-purple-100 font-mono text-sm font-semibold text-purple-700"
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">Como usar F[]:</p>
                <p>• Se P[j] ≠ T[i] e j > 0: j = F[j-1] (usa a função de falha)</p>
                <p>• Se P[j] ≠ T[i] e j = 0: i++ (avança só o texto)</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KMPSimulator;