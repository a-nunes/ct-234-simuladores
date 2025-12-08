import {
  DivideConquerSortStep,
  ArrayPointer,
  RecursionLevel,
  ArraySegment
} from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';

/**
 * Generates visualization steps for Merge Sort algorithm.
 * 
 * Pseudocode:
 * MergeSort(i, f) {
 *   if (i < f) {
 *     m = floor((i + f) / 2);
 *     MergeSort(i, m);       // Ordena metade esquerda
 *     MergeSort(m + 1, f);   // Ordena metade direita
 *     Merge(i, m, f);        // Intercala as metades
 *   }
 * }
 */
export function generateMergeSortSteps(inputArray: number[]): DivideConquerSortStep[] {
  const steps: DivideConquerSortStep[] = [];
  const arr = [...inputArray];
  const n = arr.length;
  const sortedIndices: number[] = [];
  const recursionStack: RecursionLevel[] = [];

  // Initial step
  steps.push({
    type: 'init',
    array: [...arr],
    pointers: [],
    sortedIndices: [],
    segments: [{ start: 0, end: n - 1, type: 'current' }],
    recursionStack: [],
    currentRecursionDepth: 0,
    message: `Iniciando Merge Sort com vetor de ${n} elementos`,
    pseudocodeLine: 1,
    variables: { i: 0, f: n - 1 }
  });

  // Recursive merge sort with step generation
  function mergeSort(left: number, right: number, depth: number): void {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Record divide step
    recursionStack.push({
      depth,
      left,
      right,
      description: `MergeSort(${left}, ${right})`
    });

    const dividePointers: ArrayPointer[] = [
      { index: left, label: 'i', type: 'left' },
      { index: mid, label: 'm', type: 'mid' },
      { index: right, label: 'f', type: 'right' }
    ];

    steps.push({
      type: 'divide',
      array: [...arr],
      pointers: dividePointers,
      sortedIndices: [...sortedIndices],
      segments: [
        { start: left, end: mid, type: 'left' },
        { start: mid + 1, end: right, type: 'right' }
      ],
      recursionStack: [...recursionStack],
      currentRecursionDepth: depth,
      message: `Dividindo: [${left}..${right}] em [${left}..${mid}] e [${mid + 1}..${right}]`,
      pseudocodeLine: 3,
      variables: { i: left, f: right, m: mid, profundidade: depth }
    });

    // Recursive call left
    steps.push({
      type: 'recursive_call',
      array: [...arr],
      pointers: [
        { index: left, label: 'i', type: 'left' },
        { index: mid, label: 'f', type: 'right' }
      ],
      sortedIndices: [...sortedIndices],
      segments: [{ start: left, end: mid, type: 'current' }],
      recursionStack: [...recursionStack],
      currentRecursionDepth: depth,
      message: `Chamada recursiva: MergeSort(${left}, ${mid}) - metade esquerda`,
      pseudocodeLine: 4,
      variables: { i: left, m: mid }
    });

    mergeSort(left, mid, depth + 1);

    // Recursive call right
    steps.push({
      type: 'recursive_call',
      array: [...arr],
      pointers: [
        { index: mid + 1, label: 'i', type: 'left' },
        { index: right, label: 'f', type: 'right' }
      ],
      sortedIndices: [...sortedIndices],
      segments: [{ start: mid + 1, end: right, type: 'current' }],
      recursionStack: [...recursionStack],
      currentRecursionDepth: depth,
      message: `Chamada recursiva: MergeSort(${mid + 1}, ${right}) - metade direita`,
      pseudocodeLine: 5,
      variables: { i: mid + 1, f: right }
    });

    mergeSort(mid + 1, right, depth + 1);

    // Merge phase
    merge(left, mid, right, depth);

    recursionStack.pop();
  }

  function merge(left: number, mid: number, right: number, depth: number): void {
    const aux: number[] = new Array(right - left + 1);
    let i = left;
    let j = mid + 1;
    let k = 0;

    steps.push({
      type: 'compare',
      array: [...arr],
      auxiliaryArray: [...aux],
      pointers: [
        { index: i, label: 'i1', type: 'left' },
        { index: j, label: 'i2', type: 'right' }
      ],
      sortedIndices: [...sortedIndices],
      segments: [
        { start: left, end: mid, type: 'left' },
        { start: mid + 1, end: right, type: 'right' }
      ],
      recursionStack: [...recursionStack],
      currentRecursionDepth: depth,
      message: `Iniciando intercalação de [${left}..${mid}] com [${mid + 1}..${right}]`,
      pseudocodeLine: 9,
      variables: { i: left, m: mid, f: right, i1: i, i2: j }
    });

    // Merge both halves
    while (i <= mid && j <= right) {
      const comparing: [number, number] = [i, j];
      
      steps.push({
        type: 'compare',
        array: [...arr],
        auxiliaryArray: [...aux],
        comparing,
        pointers: [
          { index: i, label: 'i1', type: 'left' },
          { index: j, label: 'i2', type: 'right' }
        ],
        sortedIndices: [...sortedIndices],
        segments: [
          { start: left, end: mid, type: 'left' },
          { start: mid + 1, end: right, type: 'right' }
        ],
        recursionStack: [...recursionStack],
        currentRecursionDepth: depth,
        message: `Comparando v[${i}]=${arr[i]} com v[${j}]=${arr[j]}`,
        pseudocodeLine: 12,
        variables: { i1: i, i2: j, 'v[i1]': arr[i], 'v[i2]': arr[j] }
      });

      if (arr[i] <= arr[j]) {
        aux[k] = arr[i];
        steps.push({
          type: 'copy_to_aux',
          array: [...arr],
          auxiliaryArray: [...aux],
          pointers: [
            { index: i, label: 'i1', type: 'primary' }
          ],
          sortedIndices: [...sortedIndices],
          segments: [{ start: left, end: right, type: 'current' }],
          recursionStack: [...recursionStack],
          currentRecursionDepth: depth,
          message: `${arr[i]} ≤ ${arr[j]}, copiando ${arr[i]} para aux[${k}]`,
          pseudocodeLine: 13,
          variables: { 'aux[k]': aux[k], k: k + 1 }
        });
        i++;
      } else {
        aux[k] = arr[j];
        steps.push({
          type: 'copy_to_aux',
          array: [...arr],
          auxiliaryArray: [...aux],
          pointers: [
            { index: j, label: 'i2', type: 'primary' }
          ],
          sortedIndices: [...sortedIndices],
          segments: [{ start: left, end: right, type: 'current' }],
          recursionStack: [...recursionStack],
          currentRecursionDepth: depth,
          message: `${arr[i]} > ${arr[j]}, copiando ${arr[j]} para aux[${k}]`,
          pseudocodeLine: 15,
          variables: { 'aux[k]': aux[k], k: k + 1 }
        });
        j++;
      }
      k++;
    }

    // Copy remaining elements from left half
    while (i <= mid) {
      aux[k] = arr[i];
      steps.push({
        type: 'copy_to_aux',
        array: [...arr],
        auxiliaryArray: [...aux],
        pointers: [{ index: i, label: 'i1', type: 'left' }],
        sortedIndices: [...sortedIndices],
        segments: [{ start: left, end: right, type: 'current' }],
        recursionStack: [...recursionStack],
        currentRecursionDepth: depth,
        message: `Copiando restante da esquerda: ${arr[i]} para aux[${k}]`,
        pseudocodeLine: 18,
        variables: { 'aux[k]': aux[k] }
      });
      i++;
      k++;
    }

    // Copy remaining elements from right half
    while (j <= right) {
      aux[k] = arr[j];
      steps.push({
        type: 'copy_to_aux',
        array: [...arr],
        auxiliaryArray: [...aux],
        pointers: [{ index: j, label: 'i2', type: 'right' }],
        sortedIndices: [...sortedIndices],
        segments: [{ start: left, end: right, type: 'current' }],
        recursionStack: [...recursionStack],
        currentRecursionDepth: depth,
        message: `Copiando restante da direita: ${arr[j]} para aux[${k}]`,
        pseudocodeLine: 22,
        variables: { 'aux[k]': aux[k] }
      });
      j++;
      k++;
    }

    // Copy back to original array
    for (let idx = 0; idx < aux.length; idx++) {
      arr[left + idx] = aux[idx];
    }

    // Mark merged segment
    steps.push({
      type: 'merge_back',
      array: [...arr],
      auxiliaryArray: [...aux],
      pointers: [],
      sortedIndices: [...sortedIndices],
      segments: [{ start: left, end: right, type: 'merged' }],
      recursionStack: [...recursionStack],
      currentRecursionDepth: depth,
      message: `Copiando aux de volta para v[${left}..${right}]: [${aux.join(', ')}]`,
      pseudocodeLine: 26,
      variables: { i: left, f: right }
    });

    // If we're at the top level (depth 0), mark all as sorted
    if (depth === 0) {
      for (let idx = left; idx <= right; idx++) {
        if (!sortedIndices.includes(idx)) {
          sortedIndices.push(idx);
        }
      }
    }
  }

  mergeSort(0, n - 1, 0);

  // Mark all as sorted
  sortedIndices.length = 0;
  for (let i = 0; i < n; i++) {
    sortedIndices.push(i);
  }

  steps.push({
    type: 'complete',
    array: [...arr],
    pointers: [],
    sortedIndices: sortedIndices.sort((a, b) => a - b),
    segments: [],
    recursionStack: [],
    currentRecursionDepth: 0,
    message: 'Ordenação completa!',
    pseudocodeLine: 28,
    variables: {}
  });

  return steps;
}

/**
 * Merge Sort pseudocode for display
 */
export const MERGE_SORT_PSEUDOCODE = [
  'MergeSort(i, f) {',
  '    if (i < f) {',
  '        m = floor((i + f) / 2);',
  '        MergeSort(i, m);',
  '        MergeSort(m + 1, f);',
  '        Merge(i, m, f);',
  '    }',
  '}',
  '',
  'Merge(i, m, f) {',
  '    i1 = i; i2 = m + 1; k = 0;',
  '    while (i1 <= m && i2 <= f) {',
  '        if (v[i1] < v[i2])',
  '            aux[k++] = v[i1++];',
  '        else',
  '            aux[k++] = v[i2++];',
  '    }',
  '    while (i1 <= m)',
  '        aux[k++] = v[i1++];',
  '    while (i2 <= f)',
  '        aux[k++] = v[i2++];',
  '    for (j = i; j <= f; j++)',
  '        v[j] = aux[j - i];',
  '}'
];
