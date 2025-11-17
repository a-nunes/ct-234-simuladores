import React, { useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Item {
  id: number;
  weight: number;
  profit: number;
}

interface Step {
  type: 'init' | 'process_cell' | 'item_fits' | 'item_not_fits' | 'traceback' | 'complete';
  description: string;
  k?: number;
  i?: number;
  B: number[][];
  selectedItems?: number[];
}

const KnapsackSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, weight: 2, profit: 12 },
    { id: 2, weight: 1, profit: 10 },
    { id: 3, weight: 3, profit: 20 },
    { id: 4, weight: 2, profit: 15 }
  ]);
  const [capacity, setCapacity] = useState<number>(5);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const generateSteps = useCallback((): Step[] => {
    const stepList: Step[] = [];
    const n = items.length;
    const B: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

    stepList.push({
      type: 'init',
      description: `Inicializando Mochila 0/1. ${n} itens, capacidade = ${capacity}. Linha 0 = 0 (sem itens).`,
      B: B.map(row => [...row])
    });

    for (let k = 1; k <= n; k++) {
      const item = items[k - 1];
      for (let i = 0; i <= capacity; i++) {
        stepList.push({
          type: 'process_cell',
          description: `Processando B[${k},${i}]. Item ${item.id} (peso=${item.weight}, lucro=${item.profit}), capacidade=${i}.`,
          k: k,
          i: i,
          B: B.map(row => [...row])
        });

        if (item.weight > i) {
          B[k][i] = B[k - 1][i];
          stepList.push({
            type: 'item_not_fits',
            description: `✗ Item ${item.id} não cabe (peso ${item.weight} > ${i}). B[${k},${i}] = B[${k-1},${i}] = ${B[k][i]}`,
            k: k,
            i: i,
            B: B.map(row => [...row])
          });
        } else {
          const semPegar = B[k - 1][i];
          const pegando = B[k - 1][i - item.weight] + item.profit;
          B[k][i] = Math.max(semPegar, pegando);
          
          stepList.push({
            type: 'item_fits',
            description: `✓ Item ${item.id} cabe! Sem pegar: ${semPegar}. Pegando: ${B[k-1][i-item.weight]} + ${item.profit} = ${pegando}. B[${k},${i}] = ${B[k][i]}`,
            k: k,
            i: i,
            B: B.map(row => [...row])
          });
        }
      }
    }

    // Traceback
    const selectedItems: number[] = [];
    let r = capacity;
    for (let i = n; i >= 1; i--) {
      if (B[i - 1][r] !== B[i][r]) {
        selectedItems.unshift(i);
        r -= items[i - 1].weight;
      }
    }

    stepList.push({
      type: 'complete',
      description: `Concluído! Lucro máximo: ${B[n][capacity]}. Itens selecionados: ${selectedItems.join(', ')}`,
      B: B.map(row => [...row]),
      selectedItems
    });

    return stepList;
  }, [items, capacity]);

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

  const renderCell = (k: number, i: number) => {
    if (!currentStep) return null;
    const value = currentStep.B[k][i];
    const isCurrent = currentStep.k === k && currentStep.i === i;
    const isPast = (currentStep.k !== undefined && k < currentStep.k) || (k === currentStep.k && currentStep.i !== undefined && i < currentStep.i);

    return (
      <div className={`flex items-center justify-center w-12 h-12 border-2 transition-all ${
        isCurrent ? 'bg-yellow-100 border-yellow-500 scale-110' :
        isPast ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
      }`}>
        <span className={`text-sm font-bold ${isCurrent ? 'text-yellow-700' : isPast ? 'text-green-700' : 'text-gray-600'}`}>
          {value}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={onBack} className="p-2 bg-white rounded-lg shadow hover:shadow-md">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Problema da Mochila 0/1</h1>
            <p className="text-gray-600">Programação Dinâmica - Maximizar lucro com limite de peso</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button onClick={handleStart} disabled={isSimulating}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400">
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
              <label className="block text-sm font-medium mb-2">Capacidade da Mochila</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-32 px-3 py-2 border rounded-lg" min="1" max="20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Itens</label>
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center space-x-2 mb-2">
                  <span className="w-20">Item {item.id}:</span>
                  <input type="number" value={item.weight} onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].weight = Math.max(1, parseInt(e.target.value) || 1);
                    setItems(newItems);
                  }} className="w-20 px-2 py-1 border rounded" placeholder="Peso" />
                  <input type="number" value={item.profit} onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].profit = Math.max(1, parseInt(e.target.value) || 1);
                    setItems(newItems);
                  }} className="w-20 px-2 py-1 border rounded" placeholder="Lucro" />
                </div>
              ))}
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
              <h3 className="text-lg font-semibold mb-4">Matriz B[k,i] - Lucro Máximo</h3>
              <div className="overflow-x-auto">
                <div className="inline-grid gap-1" style={{ gridTemplateColumns: `40px repeat(${capacity + 1}, 48px)` }}>
                  <div></div>
                  {Array.from({ length: capacity + 1 }, (_, i) => (
                    <div key={i} className="flex items-center justify-center text-xs font-medium text-gray-600">{i}</div>
                  ))}
                  {currentStep.B.map((row, k) => (
                    <React.Fragment key={k}>
                      <div className="flex items-center justify-center text-xs font-medium text-gray-600">{k}</div>
                      {row.map((_, i) => <div key={i}>{renderCell(k, i)}</div>)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {currentStep.selectedItems && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Solução Ótima</h3>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <p className="font-bold text-teal-800">Itens selecionados: {currentStep.selectedItems.join(', ')}</p>
                  <p className="text-teal-700">Lucro total: {currentStep.B[items.length][capacity]}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Sobre o Algoritmo</h3>
          <div className="text-gray-700 space-y-2 text-sm">
            <p><strong>Objetivo:</strong> Maximizar lucro sem exceder capacidade (cada item pode ser pego ou não - 0/1).</p>
            <p><strong>Recorrência:</strong> B[k,i] = max(B[k-1,i], B[k-1, i-peso[k]] + lucro[k])</p>
            <p><strong>Complexidade:</strong> O(n × capacidade)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnapsackSimulator;
