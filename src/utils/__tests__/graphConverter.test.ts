import { convertGraphToSimulator } from '../graphConverter';
import type { GraphDefinition } from '../../components/GraphEditor';

describe('convertGraphToSimulator', () => {
  it('renumera ids com lacunas para 0..n-1 preservando as arestas', () => {
    // Situação real: A(0), B(1), C(2) criados e A apagado no editor visual.
    const graph: GraphDefinition = {
      nodes: [
        { id: 1, label: 'B', x: 0, y: 0 },
        { id: 2, label: 'C', x: 10, y: 10 },
      ],
      edges: [{ from: 2, to: 1, weight: 4 }],
      type: 'directed',
      weighted: 'weighted',
    };

    const { nodes, edges } = convertGraphToSimulator(graph);

    expect(nodes.map(n => [n.id, n.label])).toEqual([[0, 'B'], [1, 'C']]);
    expect(edges).toHaveLength(1);
    expect(edges[0]).toMatchObject({ from: 1, to: 0, weight: 4 });
    // Todo id de aresta é um índice válido do array de nós.
    edges.forEach(e => {
      expect(nodes[e.from]).toBeDefined();
      expect(nodes[e.to]).toBeDefined();
    });
  });

  it('descarta arestas cujas extremidades não existem', () => {
    const graph: GraphDefinition = {
      nodes: [{ id: 0, label: 'A', x: 0, y: 0 }],
      edges: [{ from: 0, to: 7 }],
      type: 'directed',
      weighted: 'unweighted',
    };
    expect(convertGraphToSimulator(graph).edges).toEqual([]);
  });

  it('mantém grafos já compactos inalterados', () => {
    const graph: GraphDefinition = {
      nodes: [
        { id: 0, label: 'A', x: 0, y: 0 },
        { id: 1, label: 'B', x: 0, y: 0 },
      ],
      edges: [{ from: 0, to: 1 }],
      type: 'undirected',
      weighted: 'unweighted',
    };
    const { nodes, edges } = convertGraphToSimulator(graph, { dist: Infinity }, { inMST: false });
    expect(nodes[1]).toMatchObject({ id: 1, label: 'B', state: 'unvisited', dist: Infinity });
    expect(edges[0]).toMatchObject({ from: 0, to: 1, type: 'none', inMST: false });
  });
});
