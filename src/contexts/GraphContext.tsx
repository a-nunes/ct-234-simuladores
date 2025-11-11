import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GraphDefinition } from '../components/GraphEditor';

interface GraphContextType {
  savedGraph: GraphDefinition | null;
  setSavedGraph: (graph: GraphDefinition | null) => void;
  clearSavedGraph: () => void;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export const GraphProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedGraph, setSavedGraph] = useState<GraphDefinition | null>(null);

  const clearSavedGraph = () => {
    setSavedGraph(null);
  };

  return (
    <GraphContext.Provider value={{ savedGraph, setSavedGraph, clearSavedGraph }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
};
