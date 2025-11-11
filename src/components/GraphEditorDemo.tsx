import React, { useState } from 'react';
import GraphEditor, { GraphDefinition } from './GraphEditor';
import { useGraph } from '../contexts/GraphContext';
import { Check, Save } from 'lucide-react';

const GraphEditorDemo = () => {
  const [currentGraph, setCurrentGraph] = useState<GraphDefinition | null>(null);
  const { savedGraph, setSavedGraph } = useGraph();
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const handleSaveGraph = () => {
    if (currentGraph && currentGraph.nodes.length > 0) {
      setSavedGraph(currentGraph);
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    }
  };

  // Exemplos pré-definidos
  const examples = [
    {
      name: 'Exemplo Tarjan (DFS)',
      graph: {
        nodes: [
          { id: 0, label: 'A', x: 100, y: 100 },
          { id: 1, label: 'B', x: 250, y: 100 },
          { id: 2, label: 'C', x: 400, y: 100 },
          { id: 3, label: 'D', x: 175, y: 250 },
          { id: 4, label: 'E', x: 325, y: 250 },
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 0, to: 3 },
          { from: 1, to: 2 },
          { from: 1, to: 4 },
          { from: 2, to: 4 },
          { from: 3, to: 1 },
          { from: 4, to: 3 },
        ],
        type: 'directed' as const,
        weighted: 'unweighted' as const,
      }
    },
    {
      name: 'Exemplo DAG (Ordenação Topológica)',
      graph: {
        nodes: [
          { id: 0, label: 'A', x: 100, y: 100 },
          { id: 1, label: 'B', x: 250, y: 100 },
          { id: 2, label: 'C', x: 400, y: 100 },
          { id: 3, label: 'D', x: 175, y: 250 },
          { id: 4, label: 'E', x: 325, y: 250 },
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 0, to: 3 },
          { from: 1, to: 2 },
          { from: 1, to: 4 },
          { from: 2, to: 4 },
          { from: 3, to: 4 },
        ],
        type: 'directed' as const,
        weighted: 'unweighted' as const,
      }
    },
    {
      name: 'Exemplo Dijkstra (Caminho Mínimo)',
      graph: {
        nodes: [
          { id: 0, label: 'A', x: 100, y: 200 },
          { id: 1, label: 'B', x: 250, y: 100 },
          { id: 2, label: 'C', x: 400, y: 100 },
          { id: 3, label: 'D', x: 250, y: 300 },
          { id: 4, label: 'E', x: 400, y: 300 },
        ],
        edges: [
          { from: 0, to: 1, weight: 4 },
          { from: 0, to: 3, weight: 3 },
          { from: 1, to: 2, weight: 5 },
          { from: 1, to: 3, weight: 2 },
          { from: 2, to: 4, weight: 1 },
          { from: 3, to: 4, weight: 6 },
        ],
        type: 'directed' as const,
        weighted: 'weighted' as const,
      }
    },
    {
      name: 'Exemplo MST (Árvore Geradora Mínima)',
      graph: {
        nodes: [
          { id: 0, label: 'A', x: 150, y: 150 },
          { id: 1, label: 'B', x: 300, y: 100 },
          { id: 2, label: 'C', x: 450, y: 150 },
          { id: 3, label: 'D', x: 225, y: 300 },
          { id: 4, label: 'E', x: 375, y: 300 },
        ],
        edges: [
          { from: 0, to: 1, weight: 4 },
          { from: 1, to: 0, weight: 4 },
          { from: 0, to: 3, weight: 3 },
          { from: 3, to: 0, weight: 3 },
          { from: 1, to: 2, weight: 5 },
          { from: 2, to: 1, weight: 5 },
          { from: 1, to: 3, weight: 2 },
          { from: 3, to: 1, weight: 2 },
          { from: 1, to: 4, weight: 9 },
          { from: 4, to: 1, weight: 9 },
          { from: 2, to: 4, weight: 1 },
          { from: 4, to: 2, weight: 1 },
          { from: 3, to: 4, weight: 6 },
          { from: 4, to: 3, weight: 6 },
        ],
        type: 'undirected' as const,
        weighted: 'weighted' as const,
      }
    },
    {
      name: 'Exemplo Bipartição',
      graph: {
        nodes: [
          { id: 0, label: 'A', x: 150, y: 100 },
          { id: 1, label: 'B', x: 150, y: 200 },
          { id: 2, label: 'C', x: 150, y: 300 },
          { id: 3, label: 'D', x: 450, y: 150 },
          { id: 4, label: 'E', x: 450, y: 250 },
        ],
        edges: [
          { from: 0, to: 3 },
          { from: 3, to: 0 },
          { from: 0, to: 4 },
          { from: 4, to: 0 },
          { from: 1, to: 3 },
          { from: 3, to: 1 },
          { from: 2, to: 4 },
          { from: 4, to: 2 },
        ],
        type: 'undirected' as const,
        weighted: 'unweighted' as const,
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Editor de Grafos - Demonstração
              </h1>
              <p className="text-slate-600">
                Crie, edite e visualize grafos de forma interativa. Use as ferramentas visuais ou o editor de texto.
              </p>
            </div>
            
            <button
              onClick={handleSaveGraph}
              disabled={!currentGraph || currentGraph.nodes.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              <Save size={24} />
              Salvar para Simuladores
            </button>
          </div>
          
          {showSaveConfirmation && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg flex items-center gap-3">
              <Check className="text-green-600" size={24} />
              <p className="text-green-800 font-semibold">
                ✅ Grafo salvo! Agora você pode carregá-lo em qualquer simulador usando o botão "Carregar Grafo Customizado".
              </p>
            </div>
          )}
          
          {savedGraph && !showSaveConfirmation && (
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
              <p className="text-blue-800 font-semibold">
                📌 Grafo salvo disponível: {savedGraph.nodes.length} vértices, {savedGraph.type === 'directed' ? savedGraph.edges.length : savedGraph.edges.length / 2} arestas
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2">
            <GraphEditor
              onGraphChange={setCurrentGraph}
              defaultType="directed"
              defaultWeighted="unweighted"
              allowTypeChange={true}
              examples={examples}
            />
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Informações do Grafo</h2>
              
              {currentGraph ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Vértices</p>
                    <p className="text-2xl font-bold text-purple-600">{currentGraph.nodes.length}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Arestas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentGraph.type === 'directed' 
                        ? currentGraph.edges.length 
                        : currentGraph.edges.length / 2}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Tipo</p>
                    <p className="text-lg font-bold text-slate-800">
                      {currentGraph.type === 'directed' ? 'Direcionado' : 'Não-Direcionado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Pesos</p>
                    <p className="text-lg font-bold text-slate-800">
                      {currentGraph.weighted === 'weighted' ? 'Ponderado' : 'Não-Ponderado'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Nenhum grafo criado ainda.</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Como Usar</h2>
              
              <div className="space-y-3 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-800 mb-1">🖱️ Selecionar/Arrastar</p>
                  <p>Clique e arraste vértices para reorganizar o layout.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-slate-800 mb-1">➕ Adicionar Vértice</p>
                  <p>Clique no canvas para criar novos vértices (A, B, C...).</p>
                </div>
                
                <div>
                  <p className="font-semibold text-slate-800 mb-1">→ Adicionar Aresta</p>
                  <p>Clique no vértice de origem, depois no destino. Se ponderado, digite o peso.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-slate-800 mb-1">🗑️ Deletar</p>
                  <p>Clique em vértices ou arestas para removê-los.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-slate-800 mb-1">📝 Editor de Texto</p>
                  <p>Digite ou cole a definição do grafo em formato de texto.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-slate-800 mb-1">📚 Exemplos</p>
                  <p>Carregue grafos de exemplo para estudar algoritmos específicos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphEditorDemo;
