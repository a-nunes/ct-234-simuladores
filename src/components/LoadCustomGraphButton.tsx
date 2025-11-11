import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useGraph } from '../contexts/GraphContext';
import { isGraphCompatible } from '../utils/graphConverter';

interface Props {
  onLoadGraph: () => void;
  requiredType: 'directed' | 'undirected';
  requiresWeights?: boolean;
  disabled?: boolean;
}

const LoadCustomGraphButton: React.FC<Props> = ({
  onLoadGraph,
  requiredType,
  requiresWeights = false,
  disabled = false
}) => {
  const { savedGraph } = useGraph();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!savedGraph) {
      setShowModal(true);
      return;
    }

    const compatibility = isGraphCompatible(savedGraph, requiredType, requiresWeights);
    
    if (!compatibility.compatible) {
      setShowModal(true);
      return;
    }

    onLoadGraph();
  };

  const compatibility = savedGraph 
    ? isGraphCompatible(savedGraph, requiredType, requiresWeights)
    : { compatible: false, message: 'Nenhum grafo salvo.' };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm ${
          savedGraph && compatibility.compatible
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-slate-300 text-slate-600 cursor-not-allowed'
        } ${disabled ? 'opacity-50' : ''}`}
        title={savedGraph && compatibility.compatible ? 'Carregar grafo customizado' : 'Nenhum grafo compatível salvo'}
      >
        <Upload size={18} />
        Grafo Customizado
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="text-orange-600" />
                Grafo Não Disponível
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {!savedGraph ? (
              <div>
                <p className="text-slate-600 mb-4">
                  Você ainda não criou um grafo customizado.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 text-sm mb-2">Como criar um grafo:</h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Volte ao início e clique em "Editor de Grafos"</li>
                    <li>Crie seu grafo usando as ferramentas visuais ou o editor de texto</li>
                    <li>Configure o tipo: <strong>{requiredType === 'directed' ? 'Direcionado' : 'Não-Direcionado'}</strong></li>
                    {requiresWeights && <li>Configure como: <strong>Ponderado</strong></li>}
                    <li>Clique em "Salvar para Simuladores"</li>
                    <li>Retorne a este simulador e carregue o grafo</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-slate-600 mb-4">
                  {compatibility.message}
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-orange-900 text-sm mb-2">Requisitos deste simulador:</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Tipo: <strong>{requiredType === 'directed' ? 'Direcionado' : 'Não-Direcionado'}</strong></li>
                    <li>• Pesos: <strong>{requiresWeights ? 'Ponderado' : 'Não-Ponderado (opcional)'}</strong></li>
                  </ul>
                  
                  <div className="mt-3 pt-3 border-t border-orange-300">
                    <h3 className="font-semibold text-orange-900 text-sm mb-1">Grafo salvo atual:</h3>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Tipo: <strong>{savedGraph.type === 'directed' ? 'Direcionado' : 'Não-Direcionado'}</strong></li>
                      <li>• Pesos: <strong>{savedGraph.weighted === 'weighted' ? 'Ponderado' : 'Não-Ponderado'}</strong></li>
                      <li>• Vértices: <strong>{savedGraph.nodes.length}</strong></li>
                      <li>• Arestas: <strong>{savedGraph.type === 'directed' ? savedGraph.edges.length : savedGraph.edges.length / 2}</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadCustomGraphButton;
