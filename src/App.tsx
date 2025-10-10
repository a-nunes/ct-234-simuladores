import './index.css';
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, SkipForward, RotateCcw } from 'lucide-react';

interface Step {
  position: number;
  comparisons: { index: number; absIndex: number; stepNumber: number; match: boolean }[];
  comparisonCount: number;
  mismatchChar: string | null;
  mismatchIndex: number;
  shift: number;
  shiftReason: string;
  badCharShift?: number;
  lastOccValue?: number;
  found: boolean;
}

const App = () => {
  const [text, setText] = useState('vi na mata duas aranhas e duas araras');
  const [pattern, setPattern] = useState('araras');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [badCharTable, setBadCharTable] = useState<{ [char: string]: number }>({});
  const [goodSuffixTable, setGoodSuffixTable] = useState([]);
  const stepData = steps[currentStep];

  const buildLastOccurrence = (pattern: string) => {
    const table: { [char: string]: number } = {};
    for (let i = 0; i < pattern.length; i++) {
      table[pattern[i]] = i; // última ocorrência do caractere no padrão
    }
    return table;
  };

  const boyerMoore = (text: string, pattern: string) => {
    const n = text.length;
    const m = pattern.length;
    const lastOcc = buildLastOccurrence(pattern);
    const stepList = [];
    let comparisonCount = 0;
    
    let i = 0;
    let patternFound = false;
    
    while (i <= n - m)  {
      let j = m - 1;
      const comparisons = [];
      
      while (j >= 0 && pattern[j] === text[i + j]) {
        comparisonCount++;
        comparisons.push({
          index: j,
          absIndex: i + j,
          stepNumber: comparisonCount,
          match: pattern[j] === text[i+j]
        });
        j--;
      }
      
      if (j >= 0) {
        comparisonCount++;
        comparisons.push({
          index: j,
          absIndex: i + j,
          stepNumber: comparisonCount,
          match: pattern[j] === text[i+j]
        });
      }
      
      let shift = 1;
      let shiftReason = '';
      
      if (j < 0) {
        stepList.push({
          position: i,
          comparisons: comparisons,
          comparisonCount: comparisonCount,
          mismatchChar: null,
          mismatchIndex: j,
          shift: 0,
          shiftReason: 'Padrão encontrado!',
          found: true
        });
        patternFound = true;
        break;
      } else {
        // pega índice da última ocorrência L(x) (ou undefined se não existir)
        const occIndex = lastOcc[text[i + j]]; 

        // regra conforme slides: deslocamento = max(1, j - L(x)), ou j+1 se L(x) não existe
        const badCharShift = occIndex !== undefined
          ? Math.max(1, j - occIndex)
          : j + 1;

        shift = badCharShift;
        shiftReason = `Bad Character: L('${text[i + j]}') = ${occIndex !== undefined ? occIndex : -1}. Deslocamento = ${shift}`;


        
        stepList.push({
          position: i,
          comparisons: comparisons,
          comparisonCount: comparisonCount,
          mismatchChar: text[i + j],
          mismatchIndex: j,
          shift: shift,
          shiftReason: shiftReason,
          badCharShift: badCharShift,
          found: false
        });
        
        i += shift;
      }
    }
    
    // Adiciona mensagem apenas se não encontrou o padrão
    if (!patternFound && stepList.length > 0) {
      stepList[stepList.length - 1].shiftReason += ' → Fim do texto alcançado (padrão não encontrado)';
    }
    
    return stepList;
  };

  const simulate = () => {
    if (text && pattern) {
      const L = buildLastOccurrence(pattern);
      setBadCharTable(L);
      
      const result = boyerMoore(text, pattern);
      setSteps(result);
      setCurrentStep(0);
      setShowSteps(true);
    }
  };

  const reset = () => {
    setShowSteps(false);
    setSteps([]);
    setCurrentStep(0);
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

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Simulador Boyer-Moore - Passo a Passo</h1>
      
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto:
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
            Padrão:
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Passo {currentStep + 1} de {steps.length}
              </h3>
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
              <p className="text-sm">
                <span className="font-semibold">Posição no texto:</span> {stepData ? stepData.position + 1 : '-'}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Comparações até agora:</span> {stepData ? stepData.comparisonCount : 0}
              </p>
              {stepData && stepData.mismatchChar && (
                <>
                  <p className="text-sm">
                    <span className="font-semibold">Caractere incompatível:</span> '{stepData.mismatchChar}' na posição {stepData.mismatchIndex} do padrão
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">L('{stepData.mismatchChar}'):</span> {stepData.lastOccValue !== undefined && stepData.lastOccValue >= 0 ? stepData.lastOccValue : 'não existe'}
                  </p>
                </>
              )}
              <p className="text-sm font-semibold text-blue-700 mt-2">
                {stepData ? stepData.shiftReason : ''}
              </p>
              {stepData && stepData.found && (
                <p className="text-sm font-bold text-green-600 mt-2">
                  ✓ Padrão encontrado na posição {stepData.position + 1}!
                </p>
              )}
            </div>
          </div>

          {/* Visualização */}
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 overflow-x-auto">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">P = {pattern}</p>
            </div>
            
            {/* Texto principal */}
            <div className="mb-8" style={{ minWidth: `${text.length * 40}px` }}>
              {/* Linha com os índices */}
              <div className="flex mb-1">
                {text.split('').map((_, idx) => (
                  <div
                    key={idx}
                    style={{ width: '40px', minWidth: '40px' }}
                    className="text-center text-xs text-gray-500 flex-shrink-0"
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>

              {/* Linha com os caracteres do texto */}
              <div className="flex border-2 border-gray-400">
                {text.split('').map((char, idx) => (
                  <div
                    key={idx}
                    style={{ width: '40px', height: '40px', minWidth: '40px' }}
                    className="flex items-center justify-center border border-gray-300 bg-white font-mono flex-shrink-0"
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>


            {/* Passos até o atual */}
            <div className="space-y-4" style={{ minWidth: `${text.length * 40}px` }}>
              {steps.slice(0, currentStep + 1).map((step, stepIdx) => (
                <div key={stepIdx} className="relative">
                  {/* Linha com os números dos passos (apenas para o passo atual) */}
                  {stepIdx === currentStep && (
                    <div 
                      className="flex absolute"
                      style={{ left: `${step.position * 40}px`, top: '-20px' }}
                    >
                      {pattern.split('').map((_, idx) => {
                        const comparison = step.comparisons.find(c => c.index === idx);
                        return (
                          <div
                            key={idx}
                            style={{ width: '40px', minWidth: '40px' }}
                            className="text-center text-xs text-blue-600 font-semibold flex-shrink-0"
                          >
                            {comparison ? comparison.stepNumber : ""}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div 
                    className={`flex absolute ${stepIdx === currentStep ? 'ring-2 ring-blue-500' : ''}`}
                    style={{ left: `${step.position * 40}px` }}
                  >
                    {pattern.split('').map((char, idx) => {
                      const comparison = step.comparisons.find(c => c.index === idx);
                      let bgColor = 'bg-gray-100';
                      let textColor = 'text-gray-400';
                      
                      if (comparison) {
                        if (comparison.match) {
                          bgColor = 'bg-green-100';
                          textColor = 'text-green-800 font-semibold';
                        } else {
                          bgColor = 'bg-red-100';
                          textColor = 'text-red-600 font-bold';
                        }
                      }
                      
                      return (
                        <div
                          key={idx}
                          style={{ width: '40px', height: '40px', minWidth: '40px' }}
                          className={`flex items-center justify-center border-2 flex-shrink-0 ${
                            stepIdx === currentStep ? 'border-blue-500' : 'border-gray-400'
                          } ${bgColor} ${textColor} font-mono`}
                        >
                          {char}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="h-10 mb-1"></div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                    <span className={`font-medium ${stepIdx === currentStep ? 'text-blue-600 font-bold' : ''}`}>
                      {stepIdx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabelas de heurística */}
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-gray-800 mb-3">Tabela L(x) - Função de Última Ocorrência</h3>
              <div className="space-y-1 text-sm font-mono">
                {Object.keys(badCharTable).length > 0 ? (
                  Array.from(new Set(text.split('').concat(pattern.split('')))).map((char) => {
                    const pos = badCharTable[char] !== undefined ? badCharTable[char] : -1;
                    return (
                      <div key={char} className="flex justify-between">
                        <span>L('{char}'):</span>
                        <span className="font-semibold">{pos}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">Execute a simulação para ver a tabela</p>
                )}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">Como usar L(x):</p>
                <p>• Se L(x) existe: deslocamento = max(1, j - L(x))</p>
                <p>• Se L(x) não existe: deslocamento = j + 1</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;