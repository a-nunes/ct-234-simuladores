import { makeSet, find, union } from '@features/kruskal/data/algorithms/UnionFind';

describe('UnionFind', () => {
  describe('makeSet', () => {
    it('should create union-find structure with n elements', () => {
      const uf = makeSet(5);

      expect(uf.parent).toHaveLength(5);
      expect(uf.rank).toHaveLength(5);
    });

    it('should initialize each element as its own parent', () => {
      const uf = makeSet(5);

      for (let i = 0; i < 5; i++) {
        expect(uf.parent[i]).toBe(i);
      }
    });

    it('should initialize all ranks to 0', () => {
      const uf = makeSet(5);

      for (let i = 0; i < 5; i++) {
        expect(uf.rank[i]).toBe(0);
      }
    });

    it('should handle single element', () => {
      const uf = makeSet(1);

      expect(uf.parent).toEqual([0]);
      expect(uf.rank).toEqual([0]);
    });

    it('should handle large sets', () => {
      const uf = makeSet(1000);

      expect(uf.parent).toHaveLength(1000);
      expect(uf.rank).toHaveLength(1000);
    });
  });

  describe('find', () => {
    it('should return element itself when it is its own parent', () => {
      const uf = makeSet(5);

      expect(find(uf, 0)).toBe(0);
      expect(find(uf, 3)).toBe(3);
    });

    it('should find root after union', () => {
      const uf = makeSet(5);
      union(uf, 0, 1);

      const root0 = find(uf, 0);
      const root1 = find(uf, 1);

      expect(root0).toBe(root1);
    });

    it('should perform path compression', () => {
      const uf = makeSet(4);
      
      // Create chain: 0 -> 1 -> 2 -> 3
      uf.parent[0] = 1;
      uf.parent[1] = 2;
      uf.parent[2] = 3;

      const root = find(uf, 0);

      expect(root).toBe(3);
      // After path compression, 0 should point directly to root
      expect(uf.parent[0]).toBe(3);
    });

    it('should return correct root for deeply nested structure', () => {
      const uf = makeSet(10);
      
      // Create chain: 0 -> 1 -> 2 -> ... -> 9
      for (let i = 0; i < 9; i++) {
        uf.parent[i] = i + 1;
      }

      const root = find(uf, 0);

      expect(root).toBe(9);
    });
  });

  describe('union', () => {
    it('should merge two separate elements', () => {
      const uf = makeSet(5);
      union(uf, 0, 1);

      const root0 = find(uf, 0);
      const root1 = find(uf, 1);

      expect(root0).toBe(root1);
    });

    it('should do nothing when elements are already in same set', () => {
      const uf = makeSet(5);
      union(uf, 0, 1);
      
      const parentBefore = [...uf.parent];
      const rankBefore = [...uf.rank];
      
      union(uf, 0, 1);

      expect(uf.parent).toEqual(parentBefore);
      expect(uf.rank).toEqual(rankBefore);
    });

    it('should merge by rank correctly', () => {
      const uf = makeSet(5);
      
      // Union 0 and 1 (both rank 0, one becomes rank 1)
      union(uf, 0, 1);
      const root1 = find(uf, 0);
      expect(uf.rank[root1]).toBe(1);
      
      // Union with element of lower rank
      union(uf, 0, 2);
      const root2 = find(uf, 2);
      expect(root2).toBe(root1);
    });

    it('should maintain correct rank after multiple unions', () => {
      const uf = makeSet(8);
      
      union(uf, 0, 1);
      union(uf, 2, 3);
      union(uf, 4, 5);
      union(uf, 6, 7);
      
      union(uf, 0, 2);
      union(uf, 4, 6);
      
      union(uf, 0, 4);
      
      // All elements should have the same root
      const root = find(uf, 0);
      for (let i = 1; i < 8; i++) {
        expect(find(uf, i)).toBe(root);
      }
    });

    it('should handle transitive unions', () => {
      const uf = makeSet(5);
      
      union(uf, 0, 1);
      union(uf, 1, 2);
      union(uf, 2, 3);
      
      // All should be in same set
      const root = find(uf, 0);
      expect(find(uf, 1)).toBe(root);
      expect(find(uf, 2)).toBe(root);
      expect(find(uf, 3)).toBe(root);
    });

    it('should maintain separate components', () => {
      const uf = makeSet(6);
      
      union(uf, 0, 1);
      union(uf, 2, 3);
      union(uf, 4, 5);
      
      const root0 = find(uf, 0);
      const root2 = find(uf, 2);
      const root4 = find(uf, 4);
      
      expect(root0).not.toBe(root2);
      expect(root0).not.toBe(root4);
      expect(root2).not.toBe(root4);
    });
  });

  describe('integration', () => {
    it('should correctly detect cycle formation', () => {
      const uf = makeSet(3);
      
      union(uf, 0, 1);
      union(uf, 1, 2);
      
      // Now 0, 1, 2 are all in same set
      // Adding edge 0-2 would form a cycle
      expect(find(uf, 0)).toBe(find(uf, 2));
    });

    it('should work with Kruskal-like scenario', () => {
      // Simulate Kruskal's algorithm on a simple graph
      const uf = makeSet(4);
      
      // Edges: (0,1,1), (1,2,2), (2,3,3), (0,3,4)
      // Process in order: 1, 2, 3, 4
      
      // Edge (0,1,1)
      expect(find(uf, 0)).not.toBe(find(uf, 1));
      union(uf, 0, 1);
      
      // Edge (1,2,2)
      expect(find(uf, 1)).not.toBe(find(uf, 2));
      union(uf, 1, 2);
      
      // Edge (2,3,3)
      expect(find(uf, 2)).not.toBe(find(uf, 3));
      union(uf, 2, 3);
      
      // Edge (0,3,4) - would form cycle
      expect(find(uf, 0)).toBe(find(uf, 3));
    });
  });
});

