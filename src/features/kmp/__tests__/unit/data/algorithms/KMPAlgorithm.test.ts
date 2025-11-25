import { buildFailureFunction, kmpSearch } from '@features/kmp/data/algorithms/KMPAlgorithm';

describe('KMPAlgorithm', () => {
  describe('buildFailureFunction', () => {
    it('should build correct failure table for pattern with no repeated prefixes', () => {
      const { table } = buildFailureFunction('abc');
      
      expect(table).toEqual([0, 0, 0]);
    });

    it('should build correct failure table for pattern with repeated prefix', () => {
      const { table } = buildFailureFunction('abacab');
      
      // F[0] = 0 (always)
      // F[1] = 0 (no proper prefix that is also suffix for "ab")
      // F[2] = 1 ("a" is prefix and suffix of "aba")
      // F[3] = 0 (no proper prefix that is also suffix for "abac")
      // F[4] = 1 ("a" is prefix and suffix of "abaca")
      // F[5] = 2 ("ab" is prefix and suffix of "abacab")
      expect(table).toEqual([0, 0, 1, 0, 1, 2]);
    });

    it('should build correct failure table for pattern with all same characters', () => {
      const { table } = buildFailureFunction('aaaa');
      
      // F[0] = 0
      // F[1] = 1 ("a" is prefix and suffix of "aa")
      // F[2] = 2 ("aa" is prefix and suffix of "aaa")
      // F[3] = 3 ("aaa" is prefix and suffix of "aaaa")
      expect(table).toEqual([0, 1, 2, 3]);
    });

    it('should handle single character pattern', () => {
      const { table } = buildFailureFunction('a');
      
      expect(table).toEqual([0]);
    });

    it('should generate preprocessing steps', () => {
      const { steps } = buildFailureFunction('abab');
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].phase).toBe('preprocess');
      expect(steps[steps.length - 1].type).toBe('complete');
    });

    it('should build correct failure table for classic example "ababaca"', () => {
      const { table } = buildFailureFunction('ababaca');
      
      // F[0] = 0
      // F[1] = 0 ("ab" has no proper prefix that is also suffix)
      // F[2] = 1 ("a" is prefix and suffix of "aba")
      // F[3] = 2 ("ab" is prefix and suffix of "abab")
      // F[4] = 3 ("aba" is prefix and suffix of "ababa")
      // F[5] = 0 (no proper prefix that is also suffix for "ababac")
      // F[6] = 1 ("a" is prefix and suffix of "ababaca")
      expect(table).toEqual([0, 0, 1, 2, 3, 0, 1]);
    });
  });

  describe('kmpSearch', () => {
    it('should find pattern at the beginning', () => {
      const pattern = 'abacab';
      const { table } = buildFailureFunction(pattern);
      const text = 'abacabaabb';
      
      const result = kmpSearch(text, pattern, table);
      expect(result).toBe(0);
    });

    it('should find pattern in the middle', () => {
      const pattern = 'abacab';
      const { table } = buildFailureFunction(pattern);
      const text = 'xxxabacabyyy';
      
      const result = kmpSearch(text, pattern, table);
      expect(result).toBe(3);
    });

    it('should return -1 when pattern not found', () => {
      const pattern = 'xyz';
      const { table } = buildFailureFunction(pattern);
      const text = 'abcdefghij';
      
      const result = kmpSearch(text, pattern, table);
      expect(result).toBe(-1);
    });

    it('should find pattern when text equals pattern', () => {
      const pattern = 'abacab';
      const { table } = buildFailureFunction(pattern);
      
      const result = kmpSearch(pattern, pattern, table);
      expect(result).toBe(0);
    });

    it('should handle pattern with repeated characters', () => {
      const pattern = 'aaa';
      const { table } = buildFailureFunction(pattern);
      const text = 'aaaaaaa';
      
      const result = kmpSearch(text, pattern, table);
      expect(result).toBe(0);
    });

    it('should find first occurrence when multiple matches exist', () => {
      const pattern = 'aba';
      const { table } = buildFailureFunction(pattern);
      const text = 'abaXaba';
      
      // Pattern exists at index 0 and index 4, should return first (0)
      const result = kmpSearch(text, pattern, table);
      expect(result).toBe(0);
    });
  });
});
