import React, { useState, useCallback } from 'react';
import { Shuffle, Layers } from 'lucide-react';
import { useTopologicalSortSimulator } from '../hooks/useTopologicalSortSimulator';
import { useGraphEditor } from '@shared/graph-simulators/hooks/useGraphEditor';
import { GraphVisualization } from './GraphVisualization';
import { ControlPanel } from '@shared/graph-simulators/components/ControlPanel';
import { QueueStackPanel } from './QueueStackPanel';
import { IndegreeTablePanel } from './IndegreeTablePanel';
import { TopologicalOrderPanel } from './TopologicalOrderPanel';
import { ActionMessagePanel } from '@shared/graph-simulators/components/ActionMessagePanel';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { TopologicalSortStep } from '@features/topological-sort/domain/entities/TopologicalSortStep';

export function TopologicalSortSimulator() {
  const simulator = useTopologicalSortSimulator({});
  const [showRandomDialog, setShowRandomDialog] = useState(false);
  const [numVertices, setNumVertices] = useState(5);

  // For drag functionality, we need to update steps when nodes are dragged during simulation
  const graphEditor = useGraphEditor({
    nodes: simulator.nodes,
    setNodes: simulator.setNodes,
    isSimulating: simulator.isRunning,
    steps: simulator._steps || [],
    setSteps: simulator._setSteps || (() => {})
  });

  const handleGenerateRandom = useCallback(() => {
    simulator.generateRandomGraph(numVertices);
    setShowRandomDialog(false);
  }, [simulator, numVertices]);

  const handleDataStructureChange = useCallback((newStructure: 'queue' | 'stack') => {
    simulator.setDataStructure(newStructure);
    simulator.reset();
  }, [simulator]);

  const currentNodes = simulator.currentStep ? simulator.currentStep.nodes : simulator.nodes;
  const dataStructureLabel = simulator.dataStructure === 'stack' ? 'Pilha (LIFO)' : 'Fila (FIFO)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Ordenação Topológica (TopSort)
          </h1>
          <p className="text-slate-600 mb-4">
            Ordena os vértices de um DAG (grafo acíclico direcionado) linearmente respeitando as dependências.
          </p>
          
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <Layers className="text-purple-600" size={24} />
              <span className="text-sm font-semibold text-slate-700">
                Estrutura: <span className="text-purple-700 text-lg">{dataStructureLabel}</span>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="queue-button"
                onClick={() => handleDataStructureChange('queue')}
                disabled={simulator.isRunning}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                  simulator.dataStructure === 'queue'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Fila (FIFO)
              </button>
              <button
                data-testid="stack-button"
                onClick={() => handleDataStructureChange('stack')}
                disabled={simulator.isRunning}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                  simulator.dataStructure === 'stack'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Pilha (LIFO)
              </button>
            </div>
          </div>
        </div>

        <div className={`grid gap-8 transition-all duration-300 ${graphEditor.isExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Visualização do Grafo */}
          <div className={graphEditor.isExpanded ? 'col-span-1' : 'lg:col-span-2'}>
            <GraphVisualization
              nodes={simulator.nodes}
              edges={simulator.edges}
              currentStep={simulator.currentStep}
              isExpanded={graphEditor.isExpanded}
              isDragging={graphEditor.isDragging}
              onToggleExpanded={() => graphEditor.setIsExpanded(!graphEditor.isExpanded)}
              handleNodeMouseDown={graphEditor.handleNodeMouseDown}
              handleMouseMove={graphEditor.handleMouseMove}
              handleMouseUp={graphEditor.handleMouseUp}
            />

            <ControlPanel
              onStart={simulator.start}
              onReset={simulator.reset}
              onPrevious={simulator.previous}
              onNext={simulator.next}
              onLoadCustomGraph={simulator.loadCustomGraph}
              isRunning={simulator.isRunning}
              canGoNext={simulator.canGoNext}
              canGoPrevious={simulator.canGoPrevious}
              currentStepIndex={simulator.currentStepIndex}
              totalSteps={simulator.totalSteps}
              onShowRandomDialog={() => setShowRandomDialog(true)}
              requiredGraphType="directed"
              requiresWeights={false}
            />
          </div>

          {/* Painel Lateral */}
          <div className={`space-y-4 ${graphEditor.isExpanded ? 'col-span-1' : ''}`}>
            {graphEditor.isExpanded ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QueueStackPanel
                  currentStep={simulator.currentStep}
                  nodes={currentNodes}
                />
                <IndegreeTablePanel
                  currentStep={simulator.currentStep}
                  nodes={currentNodes}
                />
                <TopologicalOrderPanel
                  currentStep={simulator.currentStep}
                  nodes={currentNodes}
                />
                <ActionMessagePanel currentStep={simulator.currentStep} />
              </div>
            ) : (
              <>
                <QueueStackPanel
                  currentStep={simulator.currentStep}
                  nodes={currentNodes}
                />
                <IndegreeTablePanel
                  currentStep={simulator.currentStep}
                  nodes={currentNodes}
                />
                <TopologicalOrderPanel
                  currentStep={simulator.currentStep}
                  nodes={currentNodes}
                />
                <ActionMessagePanel currentStep={simulator.currentStep} />
              </>
            )}
          </div>
        </div>

        {/* Modal de Grafo Aleatório */}
        {showRandomDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Gerar Grafo Aleatório (DAG)
              </h2>
              
              <p className="text-slate-600 mb-6">
                Será gerado um DAG (grafo acíclico direcionado) aleatório.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Número de Vértices (3-10)
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={numVertices}
                  onChange={(e) => setNumVertices(Math.min(10, Math.max(3, parseInt(e.target.value) || 3)))}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-semibold text-center"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRandomDialog(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGenerateRandom}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Shuffle size={20} />
                  Gerar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

