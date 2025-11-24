import { UnionFindState } from '@features/kruskal/domain/entities/UnionFindState';

/**
 * Union-Find: MAKE_SET
 * Creates a new Union-Find data structure with n elements.
 */
export function makeSet(n: number): UnionFindState {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(0);
  return { parent, rank };
}

/**
 * Union-Find: FIND (with path compression)
 * Finds the root of the set containing x.
 */
export function find(uf: UnionFindState, x: number): number {
  if (uf.parent[x] !== x) {
    uf.parent[x] = find(uf, uf.parent[x]);
  }
  return uf.parent[x];
}

/**
 * Union-Find: UNION (by rank)
 * Merges the sets containing x and y.
 */
export function union(uf: UnionFindState, x: number, y: number): void {
  const rootX = find(uf, x);
  const rootY = find(uf, y);
  
  if (rootX === rootY) return;
  
  if (uf.rank[rootX] < uf.rank[rootY]) {
    uf.parent[rootX] = rootY;
  } else if (uf.rank[rootX] > uf.rank[rootY]) {
    uf.parent[rootY] = rootX;
  } else {
    uf.parent[rootY] = rootX;
    uf.rank[rootX]++;
  }
}

