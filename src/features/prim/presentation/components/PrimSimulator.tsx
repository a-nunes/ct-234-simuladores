import React, { useState, useCallback } from 'react';
import { Shuffle } from 'lucide-react';
import { usePrimSimulator } from '../hooks/usePrimSimulator';
import { useGraphEditor } from '@shared/graph-simulators/hooks/useGraphEditor';
import { GraphVisualization } from './GraphVisualization';
import { ControlPanel } from '@shared/graph-simulators/components/ControlPanel';
import { SetsPanel } from './SetsPanel';
import { CandidateEdgesPanel } from './CandidateEdgesPanel';
import { MSTPanel } from './MSTPanel';
import { ActionMessagePanel } from '@shared/graph-simulators/components/ActionMessagePanel';
import { Node } from '@features/prim/domain/entities/Node';
import { PrimStep } from '@features/prim/domain/entities/PrimStep';

export function PrimSimulator() {
  const simulator = usePrimSimulator({});
  const [showRootDialog, setShowRootDialog] = useState(false);
  const [showRandomDialog, setShowRandomDialog] = useState(false);
  const [numVertices, setNumVertices] = useState(6);

  // For drag functionality, we need to update steps when nodes are dragged during simulation
  const graphEditor = useGraphEditor({
    nodes: simulator.nodes,
    setNodes: simulator.setNodes,
    isSimulating: simulator.isRunning,
    steps: simulator._steps || [],
    setSteps: simulator._setSteps || (() => {})
  });

  const handleRootChange = useCallback((nodeId: number) => {
    simulator.setRootNode(nodeId);
    setShowRootDialog(false);
    simulator.reset();
  }, [simulator]);

  const handleGenerateRandom = useCallback(() => {
    simulator.generateRandomGraph(numVertices);
    simulator.setRootNode(0);
    setShowRandomDialog(false);
  }, [simulator, numVertices]);

  const currentNodes = simulator.currentStep ? simulator.currentStep.nodes : simulator.nodes;
  const rootNodeLabel = currentNodes.find(n => n.id === simulator.rootNode)?.label || 'A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Algoritmo de Prim (Crescimento)
          </h1>
          <p className="text-slate-600 mb-4">
            Encontra a árvore geradora de custo mínimo em grafos não-orientados ponderados usando crescimento de árvore.
          </p>
          
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Raiz: <span className="text-purple-700 text-lg">{rootNodeLabel}</span>
              </span>
            </div>
            <button
              data-testid="change-root-button"
              onClick={() => setShowRootDialog(true)}
              disabled={simulator.isRunning}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            >
              Alterar Raiz
            </button>
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
              requiredGraphType="undirected"
              requiresWeights={true}
            />
          </div>

          {/* Painel Lateral */}
          <div className={`space-y-4 ${graphEditor.isExpanded ? 'col-span-1' : ''}`}>
            {graphEditor.isExpanded ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SetsPanel currentStep={simulator.currentStep} />
                <CandidateEdgesPanel currentStep={simulator.currentStep} />
                <MSTPanel currentStep={simulator.currentStep} />
                <ActionMessagePanel currentStep={simulator.currentStep} />
              </div>
            ) : (
              <>
                <SetsPanel currentStep={simulator.currentStep} />
                <CandidateEdgesPanel currentStep={simulator.currentStep} />
                <MSTPanel currentStep={simulator.currentStep} />
                <ActionMessagePanel currentStep={simulator.currentStep} />
              </>
            )}
          </div>
        </div>

        {/* Modal de Seleção de Raiz */}
        {showRootDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Selecionar Raiz para Prim
              </h2>
              
              <div className="grid grid-cols-4 gap-2 mb-6">
                {simulator.nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleRootChange(node.id)}
                    className={`p-4 rounded-lg font-bold text-lg transition-colors ${
                      simulator.rootNode === node.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {node.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowRootDialog(false)}
                className="w-full px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Grafo Aleatório */}
        {showRandomDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Gerar Grafo Aleatório
              </h2>
              
              <p className="text-slate-600 mb-6">
                Será gerado um grafo não-orientado conectado com pesos aleatórios (1-9).
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Número de Vértices (3-12)
                </label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  value={numVertices}
                  onChange={(e) => setNumVertices(Math.min(12, Math.max(3, parseInt(e.target.value) || 3)))}
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

