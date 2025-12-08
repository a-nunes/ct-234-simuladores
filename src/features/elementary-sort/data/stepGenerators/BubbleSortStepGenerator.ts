import { ElementarySortStep, ArrayPointer } from '@features/elementary-sort/domain/entities/ElementarySortStep';

/**
 * Generates visualization steps for Bubble Sort algorithm.
 * 
 * Pseudocode:
 * BubbleSort(v, n) {
 *   for (i = 1; i < n; i++) {
 *     for (j = 1; j <= n - i; j++) {
 *       if (v[j] > v[j + 1]) {
 *         x = v[j]; v[j] = v[j + 1]; v[j + 1] = x;
 *       }
 *     }
 *   }
 * }
 */
export function generateBubbleSortSteps(inputArray: number[]): ElementarySortStep[] {
  const steps: ElementarySortStep[] = [];
  const arr = [...inputArray];
  const n = arr.length;
  const sortedIndices: number[] = [];

  // Initial step
  steps.push({
    type: 'init',
    array: [...arr],
    pointers: [],
    sortedIndices: [],
    message: `Iniciando Bubble Sort com vetor de ${n} elementos`,
    pseudocodeLine: 1,
    variables: { n }
  });

  // Main loop: i controls number of passes
  for (let i = 0; i < n - 1; i++) {
    // Inner loop: j compares adjacent elements
    for (let j = 0; j < n - 1 - i; j++) {
      const pointers: ArrayPointer[] = [
        { index: j, label: 'j', type: 'primary' },
        { index: j + 1, label: 'j+1', type: 'secondary' }
      ];

      // Compare step
      steps.push({
        type: 'compare',
        array: [...arr],
        comparing: [j, j + 1],
        pointers,
        sortedIndices: [...sortedIndices],
        message: `Comparando v[${j}]=${arr[j]} com v[${j + 1}]=${arr[j + 1]}`,
        pseudocodeLine: 4,
        variables: { i: i + 1, j: j + 1, 'v[j]': arr[j], 'v[j+1]': arr[j + 1] }
      });

      // Swap if needed
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          type: 'swap',
          array: [...arr],
          swapping: [j, j + 1],
          pointers,
          sortedIndices: [...sortedIndices],
          message: `Troca: ${arr[j + 1]} > ${arr[j]}, então trocamos`,
          pseudocodeLine: 5,
          variables: { i: i + 1, j: j + 1, x: temp }
        });
      }
    }

    // Mark the last unsorted position as sorted
    sortedIndices.push(n - 1 - i);
    
    steps.push({
      type: 'mark_sorted',
      array: [...arr],
      pointers: [],
      sortedIndices: [...sortedIndices],
      message: `Passada ${i + 1} completa. Elemento ${arr[n - 1 - i]} "flutuou" para a posição ${n - 1 - i}`,
      pseudocodeLine: 2,
      variables: { i: i + 1 }
    });
  }

  // Final step - mark first element as sorted too
  sortedIndices.push(0);
  steps.push({
    type: 'complete',
    array: [...arr],
    pointers: [],
    sortedIndices: sortedIndices.sort((a, b) => a - b),
    message: `Ordenação completa!`,
    pseudocodeLine: 8,
    variables: {}
  });

  return steps;
}

/**
 * Bubble Sort pseudocode for display
 */
export const BUBBLE_SORT_PSEUDOCODE = [
  'BubbleSort(v, n) {',
  '    for (i = 1; i < n; i++) {',
  '        for (j = 1; j <= n - i; j++) {',
  '            if (v[j] > v[j + 1]) {',
  '                x = v[j];',
  '                v[j] = v[j + 1];',
  '                v[j + 1] = x;',
  '            }',
  '        }',
  '    }',
  '}'
];
