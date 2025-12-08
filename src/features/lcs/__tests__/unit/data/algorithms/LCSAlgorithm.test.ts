import {
  createEmptyLCSTables,
  buildLCSTables,
  reconstructLCS
} from '@features/lcs/data/algorithms/LCSAlgorithm';

describe('LCSAlgorithm', () => {
  describe('createEmptyLCSTables', () => {
    it('should create tables with correct dimensions', () => {
      const { c, trace } = createEmptyLCSTables(3, 4);
      
      expect(c.length).toBe(4); // m + 1
      expect(c[0].length).toBe(5); // n + 1
      expect(trace.length).toBe(4);
      expect(trace[0].length).toBe(5);
    });

    it('should initialize c table with zeros', () => {
      const { c } = createEmptyLCSTables(2, 2);
      
      for (let i = 0; i < c.length; i++) {
        for (let j = 0; j < c[i].length; j++) {
          expect(c[i][j]).toBe(0);
        }
      }
    });

    it('should initialize trace table with null', () => {
      const { trace } = createEmptyLCSTables(2, 2);
      
      for (let i = 0; i < trace.length; i++) {
        for (let j = 0; j < trace[i].length; j++) {
          expect(trace[i][j]).toBe(null);
        }
      }
    });

    it('should handle zero-length strings', () => {
      const { c, trace } = createEmptyLCSTables(0, 0);
      
      expect(c.length).toBe(1);
      expect(c[0].length).toBe(1);
      expect(trace.length).toBe(1);
      expect(trace[0].length).toBe(1);
    });
  });

  describe('buildLCSTables', () => {
    it('should build correct tables for matching strings', () => {
      const { c, trace } = buildLCSTables('ABC', 'ABC');
      
      expect(c[3][3]).toBe(3); // Full match
      expect(trace[3][3]).toBe('DIAGONAL');
    });

    it('should build correct tables for example from docs', () => {
      const { c, trace } = buildLCSTables('ABCBDAB', 'BDCABA');
      
      // Known LCS length for this example is 4
      expect(c[7][6]).toBe(4);
    });

    it('should handle strings with no common characters', () => {
      const { c, trace } = buildLCSTables('ABC', 'XYZ');
      
      expect(c[3][3]).toBe(0); // No common subsequence
    });

    it('should handle single character match', () => {
      const { c, trace } = buildLCSTables('A', 'A');
      
      expect(c[1][1]).toBe(1);
      expect(trace[1][1]).toBe('DIAGONAL');
    });

    it('should handle single character no match', () => {
      const { c, trace } = buildLCSTables('A', 'B');
      
      expect(c[1][1]).toBe(0);
      expect(trace[1][1]).toBe('CIMA'); // or 'ESQUERDA', depends on tie-breaking
    });

    it('should set DIAGONAL when characters match', () => {
      const { trace } = buildLCSTables('AB', 'AB');
      
      expect(trace[1][1]).toBe('DIAGONAL');
      expect(trace[2][2]).toBe('DIAGONAL');
    });

    it('should set CIMA when c[i-1][j] >= c[i][j-1]', () => {
      const { trace } = buildLCSTables('AB', 'CD');
      
      // When no match, prefers CIMA if tie or greater
      expect(trace[2][2]).toBe('CIMA');
    });

    it('should follow tie-breaker preferring CIMA when values are equal', () => {
      const { trace } = buildLCSTables('CD', 'AB');
      
      // All zeros → tie goes to CIMA per implementation
      expect(trace[2][2]).toBe('CIMA');
    });

    it('should handle empty string X', () => {
      const { c } = buildLCSTables('', 'ABC');
      
      expect(c[0][3]).toBe(0);
    });

    it('should handle empty string Y', () => {
      const { c } = buildLCSTables('ABC', '');
      
      expect(c[3][0]).toBe(0);
    });

    it('should handle both empty strings', () => {
      const { c } = buildLCSTables('', '');
      
      expect(c[0][0]).toBe(0);
    });
  });

  describe('reconstructLCS', () => {
    it('should reconstruct LCS for matching strings', () => {
      const { trace } = buildLCSTables('ABC', 'ABC');
      const lcs = reconstructLCS(trace, 'ABC');
      
      expect(lcs).toBe('ABC');
    });

    it('should reconstruct LCS for example from docs', () => {
      const { trace } = buildLCSTables('ABCBDAB', 'BDCABA');
      const lcs = reconstructLCS(trace, 'ABCBDAB');
      
      // LCS should be one of: "BCBA", "BCAB", "BDAB"
      // The algorithm chooses based on tie-breaking (prefers CIMA)
      expect(lcs.length).toBe(4);
      expect(['BCBA', 'BCAB', 'BDAB']).toContain(lcs);
    });

    it('should return empty string when no common subsequence', () => {
      const { trace } = buildLCSTables('ABC', 'XYZ');
      const lcs = reconstructLCS(trace, 'ABC');
      
      expect(lcs).toBe('');
    });

    it('should handle single character match', () => {
      const { trace } = buildLCSTables('A', 'A');
      const lcs = reconstructLCS(trace, 'A');
      
      expect(lcs).toBe('A');
    });

    it('should handle partial match', () => {
      const { trace } = buildLCSTables('ABCD', 'ACD');
      const lcs = reconstructLCS(trace, 'ABCD');
      
      expect(lcs).toBe('ACD');
    });

    it('should handle custom start position', () => {
      const { trace } = buildLCSTables('ABC', 'ABC');
      const lcs = reconstructLCS(trace, 'ABC', 2, 2);
      
      expect(lcs).toBe('AB');
    });

    it('should handle empty strings', () => {
      const { trace } = buildLCSTables('', '');
      const lcs = reconstructLCS(trace, '');
      
      expect(lcs).toBe('');
    });

    it('should handle strings with repeated characters', () => {
      const { trace } = buildLCSTables('AABB', 'ABAB');
      const lcs = reconstructLCS(trace, 'AABB');
      
      // Should find common subsequence
      expect(lcs.length).toBeGreaterThan(0);
      expect(lcs.length).toBeLessThanOrEqual(4);
    });
  });
});

