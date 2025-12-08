import { ElementarySortStep, ArrayPointer } from '@features/elementary-sort/domain/entities/ElementarySortStep';

/**
 * Generates visualization steps for Selection Sort algorithm.
 * 
 * Pseudocode:
 * SelectionSort(v, n) {
 *   for (i = 1; i < n; i++) {
 *     min = i;
 *     for (j = i + 1; j <= n; j++) {
 *       if (v[j] < v[min]) {
 *         min = j;
 *       }
 *     }
 *     x = v[min]; v[min] = v[i]; v[i] = x;
 *   }
 * }
 */
export function generateSelectionSortSteps(inputArray: number[]): ElementarySortStep[] {
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
    message: `Iniciando Selection Sort com vetor de ${n} elementos`,
    pseudocodeLine: 1,
    variables: { n }
  });

  // Main loop
  for (let i = 0; i < n - 1; i++) {
    let min = i;

    // Pointer for current position
    const initPointers: ArrayPointer[] = [
      { index: i, label: 'i', type: 'primary' },
      { index: min, label: 'min', type: 'min' }
    ];

    steps.push({
      type: 'init',
      array: [...arr],
      pointers: initPointers,
      sortedIndices: [...sortedIndices],
      message: `Iniciando busca pelo menor elemento a partir da posição ${i}`,
      pseudocodeLine: 3,
      variables: { i: i + 1, min: min + 1 }
    });

    // Inner loop to find minimum
    for (let j = i + 1; j < n; j++) {
      const pointers: ArrayPointer[] = [
        { index: i, label: 'i', type: 'primary' },
        { index: j, label: 'j', type: 'secondary' },
        { index: min, label: 'min', type: 'min' }
      ];

      // Compare step
      steps.push({
        type: 'compare',
        array: [...arr],
        comparing: [j, min],
        pointers,
        sortedIndices: [...sortedIndices],
        message: `Comparando v[${j}]=${arr[j]} com v[min]=${arr[min]}`,
        pseudocodeLine: 5,
        variables: { i: i + 1, j: j + 1, min: min + 1, 'v[j]': arr[j], 'v[min]': arr[min] }
      });

      if (arr[j] < arr[min]) {
        min = j;

        steps.push({
          type: 'update_min',
          array: [...arr],
          pointers: [
            { index: i, label: 'i', type: 'primary' },
            { index: j, label: 'j', type: 'secondary' },
            { index: min, label: 'min', type: 'min' }
          ],
          sortedIndices: [...sortedIndices],
          message: `Novo mínimo encontrado: v[${min}]=${arr[min]}`,
          pseudocodeLine: 6,
          variables: { i: i + 1, j: j + 1, min: min + 1 }
        });
      }
    }

    // Swap if needed
    if (min !== i) {
      const temp = arr[i];
      arr[i] = arr[min];
      arr[min] = temp;

      steps.push({
        type: 'swap',
        array: [...arr],
        swapping: [i, min],
        pointers: [
          { index: i, label: 'i', type: 'primary' },
          { index: min, label: 'min', type: 'min' }
        ],
        sortedIndices: [...sortedIndices],
        message: `Trocando v[${i}] com v[${min}]: posição ${i} agora tem ${arr[i]}`,
        pseudocodeLine: 8,
        variables: { i: i + 1, min: min + 1, x: temp }
      });
    }

    // Mark position as sorted
    sortedIndices.push(i);

    steps.push({
      type: 'mark_sorted',
      array: [...arr],
      pointers: [],
      sortedIndices: [...sortedIndices],
      message: `Posição ${i} finalizada com o menor elemento ${arr[i]}`,
      pseudocodeLine: 2,
      variables: { i: i + 1 }
    });
  }

  // Final step
  sortedIndices.push(n - 1);
  steps.push({
    type: 'complete',
    array: [...arr],
    pointers: [],
    sortedIndices: sortedIndices.sort((a, b) => a - b),
    message: `Ordenação completa!`,
    pseudocodeLine: 10,
    variables: {}
  });

  return steps;
}

/**
 * Selection Sort pseudocode for display
 */
export const SELECTION_SORT_PSEUDOCODE = [
  'SelectionSort(v, n) {',
  '    for (i = 1; i < n; i++) {',
  '        min = i;',
  '        for (j = i + 1; j <= n; j++) {',
  '            if (v[j] < v[min]) {',
  '                min = j;',
  '            }',
  '        }',
  '        x = v[min]; v[min] = v[i]; v[i] = x;',
  '    }',
  '}'
];
