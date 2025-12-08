import { ElementarySortStep, ArrayPointer } from '@features/elementary-sort/domain/entities/ElementarySortStep';

/**
 * Generates visualization steps for Insertion Sort algorithm.
 * 
 * Pseudocode:
 * InsertionSort(v, n) {
 *   for (i = 2; i <= n; i++) {
 *     x = v[i];
 *     for (j = i; j > 1 && x < v[j - 1]; j--) {
 *       v[j] = v[j - 1];
 *     }
 *     v[j] = x;
 *   }
 * }
 */
export function generateInsertionSortSteps(inputArray: number[]): ElementarySortStep[] {
  const steps: ElementarySortStep[] = [];
  const arr = [...inputArray];
  const n = arr.length;
  const sortedIndices: number[] = [0]; // First element is always "sorted"

  // Initial step
  steps.push({
    type: 'init',
    array: [...arr],
    pointers: [],
    sortedIndices: [0],
    message: `Iniciando Insertion Sort com vetor de ${n} elementos. Primeiro elemento já está "ordenado"`,
    pseudocodeLine: 1,
    variables: { n }
  });

  // Main loop starts from second element
  for (let i = 1; i < n; i++) {
    const x = arr[i]; // Element to be inserted
    let j = i;

    // Step: Pick up the element
    steps.push({
      type: 'init',
      array: [...arr],
      insertValue: x,
      pointers: [
        { index: i, label: 'i', type: 'pivot' }
      ],
      sortedIndices: [...sortedIndices],
      message: `Pegando elemento v[${i}]=${x} para inserir na parte ordenada`,
      pseudocodeLine: 3,
      variables: { i: i + 1, x }
    });

    // Inner loop: shift elements right
    while (j > 0 && x < arr[j - 1]) {
      const pointers: ArrayPointer[] = [
        { index: j, label: 'j', type: 'primary' },
        { index: j - 1, label: 'j-1', type: 'secondary' }
      ];

      // Compare step
      steps.push({
        type: 'compare',
        array: [...arr],
        comparing: [j - 1, j],
        insertValue: x,
        pointers,
        sortedIndices: [...sortedIndices],
        message: `Comparando x=${x} com v[${j - 1}]=${arr[j - 1]}`,
        pseudocodeLine: 4,
        variables: { i: i + 1, j: j + 1, x, 'v[j-1]': arr[j - 1] }
      });

      // Shift right
      arr[j] = arr[j - 1];

      steps.push({
        type: 'shift',
        array: [...arr],
        shifting: j - 1,
        insertValue: x,
        pointers: [
          { index: j, label: 'j', type: 'primary' }
        ],
        sortedIndices: [...sortedIndices],
        message: `Deslocando v[${j - 1}]=${arr[j]} para a direita (posição ${j})`,
        pseudocodeLine: 5,
        variables: { i: i + 1, j: j, x }
      });

      j--;
    }

    // Insert element at correct position
    arr[j] = x;
    sortedIndices.push(i);

    steps.push({
      type: 'insert',
      array: [...arr],
      insertValue: x,
      insertPosition: j,
      pointers: [
        { index: j, label: 'j', type: 'pivot' }
      ],
      sortedIndices: [...sortedIndices],
      message: `Inserindo x=${x} na posição ${j}`,
      pseudocodeLine: 7,
      variables: { i: i + 1, j: j + 1, x }
    });

    // Mark as sorted
    steps.push({
      type: 'mark_sorted',
      array: [...arr],
      pointers: [],
      sortedIndices: [...sortedIndices],
      message: `Elementos de 0 a ${i} agora estão ordenados entre si`,
      pseudocodeLine: 2,
      variables: { i: i + 1 }
    });
  }

  // Final step
  steps.push({
    type: 'complete',
    array: [...arr],
    pointers: [],
    sortedIndices: sortedIndices.sort((a, b) => a - b),
    message: `Ordenação completa!`,
    pseudocodeLine: 9,
    variables: {}
  });

  return steps;
}

/**
 * Insertion Sort pseudocode for display
 */
export const INSERTION_SORT_PSEUDOCODE = [
  'InsertionSort(v, n) {',
  '    for (i = 2; i <= n; i++) {',
  '        x = v[i];',
  '        for (j = i; j > 1 && x < v[j-1]; j--) {',
  '            v[j] = v[j - 1];',
  '        }',
  '        v[j] = x;',
  '    }',
  '}'
];
