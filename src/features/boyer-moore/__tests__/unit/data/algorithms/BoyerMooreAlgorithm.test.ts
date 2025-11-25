import { buildLastOccurrence, calculateBadCharShift, boyerMooreSearch } from '@features/boyer-moore/data/algorithms/BoyerMooreAlgorithm';

describe('BoyerMooreAlgorithm', () => {
  describe('buildLastOccurrence', () => {
    it('should build correct last occurrence table', () => {
      const pattern = 'araras';
      const table = buildLastOccurrence(pattern);
      
      expect(table['a']).toBe(4); // Last 'a' at index 4
      expect(table['r']).toBe(3); // Last 'r' at index 3
      expect(table['s']).toBe(5); // Last 's' at index 5
    });

    it('should handle single character pattern', () => {
      const table = buildLastOccurrence('a');
      expect(table['a']).toBe(0);
    });

    it('should handle pattern with all unique characters', () => {
      const table = buildLastOccurrence('abc');
      expect(table['a']).toBe(0);
      expect(table['b']).toBe(1);
      expect(table['c']).toBe(2);
    });
  });

  describe('calculateBadCharShift', () => {
    const lastOcc = { 'a': 4, 'r': 3, 's': 5 };

    it('should calculate correct shift when character exists in table', () => {
      // If mismatch at j=5 and char 'r' has last occurrence at 3
      // shift = max(1, 5 - 3) = 2
      const shift = calculateBadCharShift(5, 'r', lastOcc);
      expect(shift).toBe(2);
    });

    it('should return j+1 when character not in table', () => {
      const shift = calculateBadCharShift(3, 'x', lastOcc);
      expect(shift).toBe(4); // j + 1 = 3 + 1 = 4
    });

    it('should return at least 1 even when last occurrence is after mismatch', () => {
      // If mismatch at j=2 and char 'a' has last occurrence at 4
      // shift = max(1, 2 - 4) = max(1, -2) = 1
      const shift = calculateBadCharShift(2, 'a', lastOcc);
      expect(shift).toBe(1);
    });
  });

  describe('boyerMooreSearch', () => {
    it('should find pattern at the beginning', () => {
      const text = 'araras e duas';
      const pattern = 'araras';
      const lastOcc = buildLastOccurrence(pattern);
      
      const result = boyerMooreSearch(text, pattern, lastOcc);
      expect(result).toBe(0);
    });

    it('should find pattern in the middle', () => {
      const text = 'vi na mata duas aranhas e duas araras';
      const pattern = 'araras';
      const lastOcc = buildLastOccurrence(pattern);
      
      const result = boyerMooreSearch(text, pattern, lastOcc);
      expect(result).toBe(31);
    });

    it('should return -1 when pattern not found', () => {
      const text = 'hello world';
      const pattern = 'xyz';
      const lastOcc = buildLastOccurrence(pattern);
      
      const result = boyerMooreSearch(text, pattern, lastOcc);
      expect(result).toBe(-1);
    });
  });
});
