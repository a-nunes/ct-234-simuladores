/**
 * Pure binary search algorithm implementation.
 * No side effects, no UI dependencies, just the algorithm logic.
 */
export interface BinarySearchResult {
  found: boolean;
  index?: number;
}

/**
 * Performs binary search on a sorted array.
 * @param arr - Sorted array of numbers
 * @param x - Value to search for
 * @param l - Left boundary (inclusive)
 * @param r - Right boundary (inclusive)
 * @returns Result indicating if value was found and at which index
 */
export function binarySearch(
  arr: number[],
  x: number,
  l: number,
  r: number
): BinarySearchResult {
  if (r < l) {
    return { found: false };
  }

  const q = Math.floor((l + r) / 2);

  if (arr[q] === x) {
    return { found: true, index: q };
  }

  if (arr[q] > x) {
    return binarySearch(arr, x, l, q - 1);
  } else {
    return binarySearch(arr, x, q + 1, r);
  }
}

