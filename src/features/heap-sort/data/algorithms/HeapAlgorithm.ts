/**
 * Pure Heap operations without visualization steps.
 * Uses 0-based indexing for arrays.
 */

/**
 * Get left child index (0-based)
 */
export function getLeftChild(i: number): number {
  return 2 * i + 1;
}

/**
 * Get right child index (0-based)
 */
export function getRightChild(i: number): number {
  return 2 * i + 2;
}

/**
 * Get parent index (0-based)
 */
export function getParent(i: number): number {
  return Math.floor((i - 1) / 2);
}

/**
 * Check if index has left child within heap size
 */
export function hasLeftChild(i: number, heapSize: number): boolean {
  return getLeftChild(i) < heapSize;
}

/**
 * Check if index has right child within heap size
 */
export function hasRightChild(i: number, heapSize: number): boolean {
  return getRightChild(i) < heapSize;
}

/**
 * Sift down operation (max-heap)
 * Returns the final position after sifting
 */
export function siftDown(arr: number[], i: number, heapSize: number): void {
  let largest = i;
  const left = getLeftChild(i);
  const right = getRightChild(i);

  if (left < heapSize && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < heapSize && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    // Swap
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    // Recursively sift down
    siftDown(arr, largest, heapSize);
  }
}

/**
 * Build max-heap from array
 */
export function buildMaxHeap(arr: number[]): void {
  const n = arr.length;
  // Start from last non-leaf node
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, n);
  }
}

/**
 * Heap Sort algorithm (in-place)
 */
export function heapSort(arr: number[]): void {
  const n = arr.length;
  
  // Build max-heap
  buildMaxHeap(arr);
  
  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    // Sift down on reduced heap
    siftDown(arr, 0, i);
  }
}
