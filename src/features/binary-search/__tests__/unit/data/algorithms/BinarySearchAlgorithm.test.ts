import { binarySearch } from '@features/binary-search/data/algorithms/BinarySearchAlgorithm';

describe('BinarySearchAlgorithm', () => {
  describe('binarySearch', () => {
    it('should find value present in array', () => {
      const arr = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78];
      const result = binarySearch(arr, 23, 0, arr.length - 1);
      expect(result.found).toBe(true);
      expect(result.index).toBe(5);
    });

    it('should not find value absent from array', () => {
      const arr = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78];
      const result = binarySearch(arr, 99, 0, arr.length - 1);
      expect(result.found).toBe(false);
      expect(result.index).toBeUndefined();
    });

    it('should work with array of 1 element - found', () => {
      const arr = [5];
      const result = binarySearch(arr, 5, 0, arr.length - 1);
      expect(result.found).toBe(true);
      expect(result.index).toBe(0);
    });

    it('should work with array of 1 element - not found', () => {
      const arr = [5];
      const result = binarySearch(arr, 10, 0, arr.length - 1);
      expect(result.found).toBe(false);
    });

    it('should handle empty range (r < l)', () => {
      const arr = [2, 5, 8];
      const result = binarySearch(arr, 10, 0, -1);
      expect(result.found).toBe(false);
    });

    it('should find value at beginning of array', () => {
      const arr = [2, 5, 8, 12, 16];
      const result = binarySearch(arr, 2, 0, arr.length - 1);
      expect(result.found).toBe(true);
      expect(result.index).toBe(0);
    });

    it('should find value at end of array', () => {
      const arr = [2, 5, 8, 12, 16];
      const result = binarySearch(arr, 16, 0, arr.length - 1);
      expect(result.found).toBe(true);
      expect(result.index).toBe(4);
    });
  });
});

