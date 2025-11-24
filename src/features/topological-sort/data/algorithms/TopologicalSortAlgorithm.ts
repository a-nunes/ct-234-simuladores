import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';

export interface AlgorithmState {
  indegree: Record<number, number>;
  queue: number[];
  topologicalOrder: number[];
  counter: number;
  processedNodes: Set<number>;
}

/**
 * Pure algorithm for topological sort.
 * Implements the algorithm from the pseudocode with support for queue or stack.
 * 
 * @param nodes - Array of nodes
 * @param edges - Array of edges
 * @param useStack - If true, uses stack (LIFO), otherwise uses queue (FIFO)
 * @returns Array of algorithm states for visualization
 */
export function topologicalSort(
  nodes: Node[],
  edges: Edge[],
  useStack: boolean = false
): AlgorithmState[] {
  const states: AlgorithmState[] = [];
  const n = nodes.length;
  
  // Initialize indegree for all vertices
  const indegree: Record<number, number> = {};
  nodes.forEach(node => {
    indegree[node.id] = 0;
  });
  
  // Calculate indegree
  edges.forEach(edge => {
    indegree[edge.to]++;
  });
  
  // Initial state
  const queue: number[] = [];
  const topologicalOrder: number[] = [];
  let counter = 0;
  const processedNodes = new Set<number>();
  
  // Enqueue all vertices with indegree 0
  nodes.forEach(node => {
    if (indegree[node.id] === 0) {
      queue.push(node.id);
    }
  });
  
  states.push({
    indegree: { ...indegree },
    queue: [...queue],
    topologicalOrder: [...topologicalOrder],
    counter,
    processedNodes: new Set(processedNodes)
  });
  
  // Process vertices
  while (queue.length > 0) {
    // State before dequeue
    states.push({
      indegree: { ...indegree },
      queue: [...queue],
      topologicalOrder: [...topologicalOrder],
      counter,
      processedNodes: new Set(processedNodes)
    });
    
    // Dequeue (or pop if stack)
    const v = useStack ? queue.pop()! : queue.shift()!;
    
    // Assign topological order
    topologicalOrder.push(v);
    counter++;
    processedNodes.add(v);
    
    // State after assigning order
    states.push({
      indegree: { ...indegree },
      queue: [...queue],
      topologicalOrder: [...topologicalOrder],
      counter,
      processedNodes: new Set(processedNodes)
    });
    
    // Process outgoing edges
    edges.forEach(edge => {
      if (edge.from === v) {
        const w = edge.to;
        const oldIndegree = indegree[w];
        indegree[w]--;
        
        // State after decrementing indegree
        states.push({
          indegree: { ...indegree },
          queue: [...queue],
          topologicalOrder: [...topologicalOrder],
          counter,
          processedNodes: new Set(processedNodes)
        });
        
        // If indegree becomes 0, enqueue
        if (oldIndegree > 0 && indegree[w] === 0) {
          queue.push(w);
          
          // State after enqueueing
          states.push({
            indegree: { ...indegree },
            queue: [...queue],
            topologicalOrder: [...topologicalOrder],
            counter,
            processedNodes: new Set(processedNodes)
          });
        }
      }
    });
  }
  
  // Final state
  states.push({
    indegree: { ...indegree },
    queue: [...queue],
    topologicalOrder: [...topologicalOrder],
    counter,
    processedNodes: new Set(processedNodes)
  });
  
  return states;
}

