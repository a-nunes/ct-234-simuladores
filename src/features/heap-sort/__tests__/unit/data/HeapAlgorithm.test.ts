import {
  getLeftChild,
  getRightChild,
  getParent,
  hasLeftChild,
  hasRightChild,
  siftDown,
  buildMaxHeap,
  heapSort,
  arrayToTree,
} from '../../../data/algorithms/HeapAlgorithm';

describe('HeapAlgorithm', () => {
  describe('getLeftChild', () => {
    it('should return correct left child index for root', () => {
      expect(getLeftChild(0)).toBe(1);
    });

    it('should return correct left child index for internal nodes', () => {
      expect(getLeftChild(1)).toBe(3);
      expect(getLeftChild(2)).toBe(5);
      expect(getLeftChild(3)).toBe(7);
    });
  });

  describe('getRightChild', () => {
    it('should return correct right child index for root', () => {
      expect(getRightChild(0)).toBe(2);
    });

    it('should return correct right child index for internal nodes', () => {
      expect(getRightChild(1)).toBe(4);
      expect(getRightChild(2)).toBe(6);
      expect(getRightChild(3)).toBe(8);
    });
  });

  describe('getParent', () => {
    it('should return correct parent index for left children', () => {
      expect(getParent(1)).toBe(0);
      expect(getParent(3)).toBe(1);
      expect(getParent(5)).toBe(2);
    });

    it('should return correct parent index for right children', () => {
      expect(getParent(2)).toBe(0);
      expect(getParent(4)).toBe(1);
      expect(getParent(6)).toBe(2);
    });
  });

  describe('hasLeftChild', () => {
    it('should return true when left child exists', () => {
      expect(hasLeftChild(0, 3)).toBe(true);
      expect(hasLeftChild(0, 2)).toBe(true);
    });

    it('should return false when left child does not exist', () => {
      expect(hasLeftChild(1, 2)).toBe(false);
      expect(hasLeftChild(2, 5)).toBe(false);
    });
  });

  describe('hasRightChild', () => {
    it('should return true when right child exists', () => {
      expect(hasRightChild(0, 3)).toBe(true);
      expect(hasRightChild(1, 5)).toBe(true);
    });

    it('should return false when right child does not exist', () => {
      expect(hasRightChild(0, 2)).toBe(false);
      expect(hasRightChild(1, 4)).toBe(false);
    });
  });

  describe('siftDown', () => {
    it('should sift down root when children are larger', () => {
      const array = [1, 5, 3, 4, 2];
      siftDown(array, 0, array.length);
      expect(array).toEqual([5, 4, 3, 1, 2]);
    });

    it('should not modify array when already a valid max-heap', () => {
      const array = [5, 4, 3, 1, 2];
      siftDown(array, 0, array.length);
      expect(array).toEqual([5, 4, 3, 1, 2]);
    });

    it('should sift down to left child when left is larger', () => {
      const array = [1, 5, 3];
      siftDown(array, 0, array.length);
      expect(array).toEqual([5, 1, 3]);
    });

    it('should sift down to right child when right is larger', () => {
      const array = [1, 3, 5];
      siftDown(array, 0, array.length);
      expect(array).toEqual([5, 3, 1]);
    });

    it('should handle single element array', () => {
      const array = [42];
      siftDown(array, 0, array.length);
      expect(array).toEqual([42]);
    });

    it('should respect heapSize parameter', () => {
      const array = [1, 5, 3, 4, 2];
      siftDown(array, 0, 3); // Only consider first 3 elements
      expect(array).toEqual([5, 1, 3, 4, 2]);
    });
  });

  describe('buildMaxHeap', () => {
    it('should build max-heap from unsorted array', () => {
      const array = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];
      buildMaxHeap(array);
      
      // Verify max-heap property: parent >= children for all non-leaf nodes
      for (let i = 0; i < Math.floor(array.length / 2); i++) {
        const leftIdx = getLeftChild(i);
        const rightIdx = getRightChild(i);
        
        if (leftIdx < array.length) {
          expect(array[i]).toBeGreaterThanOrEqual(array[leftIdx]);
        }
        if (rightIdx < array.length) {
          expect(array[i]).toBeGreaterThanOrEqual(array[rightIdx]);
        }
      }
    });

    it('should build max-heap from already sorted ascending array', () => {
      const array = [1, 2, 3, 4, 5];
      buildMaxHeap(array);
      expect(array[0]).toBe(5); // Root should be maximum
    });

    it('should build max-heap from descending array', () => {
      const array = [5, 4, 3, 2, 1];
      buildMaxHeap(array);
      expect(array[0]).toBe(5); // Root should still be maximum
    });

    it('should handle single element array', () => {
      const array = [42];
      buildMaxHeap(array);
      expect(array).toEqual([42]);
    });

    it('should handle two element array', () => {
      const array = [1, 2];
      buildMaxHeap(array);
      expect(array[0]).toBeGreaterThanOrEqual(array[1]);
    });
  });

  describe('heapSort', () => {
    it('should sort array in ascending order', () => {
      const array = [4, 1, 3, 2, 5];
      heapSort(array);
      expect(array).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort already sorted array', () => {
      const array = [1, 2, 3, 4, 5];
      heapSort(array);
      expect(array).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort reverse sorted array', () => {
      const array = [5, 4, 3, 2, 1];
      heapSort(array);
      expect(array).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle array with duplicates', () => {
      const array = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
      heapSort(array);
      expect(array).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 6, 9]);
    });

    it('should handle single element array', () => {
      const array = [42];
      heapSort(array);
      expect(array).toEqual([42]);
    });

    it('should handle two element array', () => {
      const array = [2, 1];
      heapSort(array);
      expect(array).toEqual([1, 2]);
    });

    it('should handle array with all same elements', () => {
      const array = [5, 5, 5, 5, 5];
      heapSort(array);
      expect(array).toEqual([5, 5, 5, 5, 5]);
    });
  });

  describe('arrayToTree', () => {
    it('should convert array to tree structure', () => {
      const array = [5, 3, 4, 1, 2];
      const tree = arrayToTree(array, array.length);

      expect(tree).not.toBeNull();
      expect(tree!.value).toBe(5);
      expect(tree!.index).toBe(0);
      expect(tree!.left?.value).toBe(3);
      expect(tree!.left?.index).toBe(1);
      expect(tree!.right?.value).toBe(4);
      expect(tree!.right?.index).toBe(2);
    });

    it('should respect heapSize parameter', () => {
      const array = [5, 3, 4, 1, 2];
      const tree = arrayToTree(array, 3);

      expect(tree).not.toBeNull();
      expect(tree!.value).toBe(5);
      expect(tree!.left?.value).toBe(3);
      expect(tree!.right?.value).toBe(4);
      expect(tree!.left?.left).toBeNull(); // Index 3 excluded
    });

    it('should handle single element array', () => {
      const array = [42];
      const tree = arrayToTree(array, 1);

      expect(tree).not.toBeNull();
      expect(tree!.value).toBe(42);
      expect(tree!.left).toBeNull();
      expect(tree!.right).toBeNull();
    });

    it('should return null for empty heapSize', () => {
      const array = [1, 2, 3];
      const tree = arrayToTree(array, 0);
      expect(tree).toBeNull();
    });

    it('should mark inHeap correctly based on heapSize', () => {
      const array = [5, 3, 4, 1, 2];
      const tree = arrayToTree(array, 3);

      expect(tree!.inHeap).toBe(true);
      expect(tree!.left?.inHeap).toBe(true);
      expect(tree!.right?.inHeap).toBe(true);
    });
  });
});
