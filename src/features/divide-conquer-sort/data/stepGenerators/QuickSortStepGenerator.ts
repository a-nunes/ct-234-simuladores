import {
  DivideConquerSortStep,
  ArrayPointer,
  RecursionLevel
} from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';

/**
 * Generates visualization steps for Quick Sort algorithm.
 * 
 * Pseudocode:
 * QuickSort(min, max) {
 *   if (min < max) {
 *     p = Partition(min, max);
 *     QuickSort(min, p - 1);
 *     QuickSort(p + 1, max);
 *   }
 * }
 * 
 * Partition(left, right) {
 *   pivot = v[left];
 *   l = left + 1; r = right;
 *   while (true) {
 *     while (l < right && v[l] < pivot) l++;
 *     while (r > left && v[r] >= pivot) r--;
 *     if (l >= r) break;
 *     swap(v[l], v[r]);
 *   }
 *   v[left] = v[r]; v[r] = pivot;
 *   return r;
 * }
 */
export function generateQuickSortSteps(inputArray: number[]): DivideConquerSortStep[] {
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
    message: `Iniciando Quick Sort com vetor de ${n} elementos`,
    pseudocodeLine: 1,
    variables: { min: 0, max: n - 1 }
  });

  function quickSort(min: number, max: number, depth: number): void {
    if (min >= max) {
      // Single element or empty - mark as sorted
      if (min === max && !sortedIndices.includes(min)) {
        sortedIndices.push(min);
        steps.push({
          type: 'mark_sorted',
          array: [...arr],
          pointers: [],
          sortedIndices: [...sortedIndices],
          segments: [],
          recursionStack: [...recursionStack],
          currentRecursionDepth: depth,
          message: `Elemento ${arr[min]} na posição ${min} já está ordenado (subvetor unitário)`,
          pseudocodeLine: 2,
          variables: { min, max }
        });
      }
      return;
    }

    recursionStack.push({
      depth,
      left: min,
      right: max,
      description: `QuickSort(${min}, ${max})`
    });

    steps.push({
      type: 'recursive_call',
      array: [...arr],
      pointers: [
        { index: min, label: 'min', type: 'left' },
        { index: max, label: 'max', type: 'right' }
      ],
      sortedIndices: [...sortedIndices],
      segments: [{ start: min, end: max, type: 'current' }],
      recursionStack: [...recursionStack],
      currentRecursionDepth: depth,
      message: `QuickSort(${min}, ${max}) - Processando subvetor [${arr.slice(min, max + 1).join(', ')}]`,
      pseudocodeLine: 2,
      variables: { min, max, profundidade: depth }
    });

    const p = partition(min, max, depth);

    // Mark pivot as sorted
    if (!sortedIndices.includes(p)) {
      sortedIndices.push(p);
    }

    steps.push({
      type: 'mark_sorted',
      array: [...arr],
      pointers: [{ index: p, label: 'p', type: 'pivot' }],
      sortedIndices: [...sortedIndices],
      pivotIndex: p,
      pivotValue: arr[p],
      segments: [
        { start: min, end: p - 1, type: 'left' },
        { start: p + 1, end: max, type: 'right' }
      ],
      recursionStack: [...recursionStack],
      currentRecursionDepth: depth,
      message: `Pivô ${arr[p]} está na posição final ${p}. Dividindo em [${min}..${p - 1}] e [${p + 1}..${max}]`,
      pseudocodeLine: 4,
      variables: { p, 'v[p]': arr[p] }
    });

    // Recursive call left
    if (min < p - 1) {
      steps.push({
        type: 'recursive_call',
        array: [...arr],
        pointers: [
          { index: min, label: 'min', type: 'left' },
          { index: p - 1, label: 'max', type: 'right' }
        ],
        sortedIndices: [...sortedIndices],
        segments: [{ start: min, end: p - 1, type: 'left' }],
        recursionStack: [...recursionStack],
        currentRecursionDepth: depth,
        message: `Chamada recursiva: QuickSort(${min}, ${p - 1}) - lado esquerdo`,
        pseudocodeLine: 5,
        variables: { min, 'p-1': p - 1 }
      });
    }

    quickSort(min, p - 1, depth + 1);

    // Recursive call right
    if (p + 1 < max) {
      steps.push({
        type: 'recursive_call',
        array: [...arr],
        pointers: [
          { index: p + 1, label: 'min', type: 'left' },
          { index: max, label: 'max', type: 'right' }
        ],
        sortedIndices: [...sortedIndices],
        segments: [{ start: p + 1, end: max, type: 'right' }],
        recursionStack: [...recursionStack],
        currentRecursionDepth: depth,
        message: `Chamada recursiva: QuickSort(${p + 1}, ${max}) - lado direito`,
        pseudocodeLine: 6,
        variables: { 'p+1': p + 1, max }
      });
    }

    quickSort(p + 1, max, depth + 1);

    recursionStack.pop();
  }

  function partition(left: number, right: number, depth: number): number {
    const pivot = arr[left];
    let l = left + 1;
    let r = right;

    steps.push({
      type: 'pivot_select',
      array: [...arr],
      pointers: [
        { index: left, label: 'pivot', type: 'pivot' },
        { index: l, label: 'l', type: 'left' },
        { index: r, label: 'r', type: 'right' }
      ],
      sortedIndices: [...sortedIndices],
      pivotIndex: left,
      pivotValue: pivot,
      segments: [{ start: left, end: right, type: 'current' }],
      recursionStack: [...recursionStack],
      currentRecursionDepth: depth,
      message: `Partition: Pivô selecionado = ${pivot} (posição ${left}). l=${l}, r=${r}`,
      pseudocodeLine: 10,
      variables: { pivot, l, r }
    });

    while (true) {
      // Move l right while arr[l] < pivot
      while (l <= right && arr[l] < pivot) {
        steps.push({
          type: 'pointer_move',
          array: [...arr],
          pointers: [
            { index: left, label: 'pivot', type: 'pivot' },
            { index: l, label: 'l', type: 'left' },
            { index: r, label: 'r', type: 'right' }
          ],
          sortedIndices: [...sortedIndices],
          pivotIndex: left,
          pivotValue: pivot,
          segments: [{ start: left, end: right, type: 'current' }],
          recursionStack: [...recursionStack],
          currentRecursionDepth: depth,
          message: `v[${l}]=${arr[l]} < pivô=${pivot}, avançando l`,
          pseudocodeLine: 13,
          variables: { l, 'v[l]': arr[l], pivot }
        });
        l++;
      }

      // Move r left while arr[r] >= pivot
      while (r > left && arr[r] >= pivot) {
        steps.push({
          type: 'pointer_move',
          array: [...arr],
          pointers: [
            { index: left, label: 'pivot', type: 'pivot' },
            { index: l, label: 'l', type: 'left' },
            { index: r, label: 'r', type: 'right' }
          ],
          sortedIndices: [...sortedIndices],
          pivotIndex: left,
          pivotValue: pivot,
          segments: [{ start: left, end: right, type: 'current' }],
          recursionStack: [...recursionStack],
          currentRecursionDepth: depth,
          message: `v[${r}]=${arr[r]} ≥ pivô=${pivot}, recuando r`,
          pseudocodeLine: 14,
          variables: { r, 'v[r]': arr[r], pivot }
        });
        r--;
      }

      // Check if pointers crossed
      if (l >= r) {
        steps.push({
          type: 'compare',
          array: [...arr],
          pointers: [
            { index: left, label: 'pivot', type: 'pivot' },
            { index: l, label: 'l', type: 'left' },
            { index: r, label: 'r', type: 'right' }
          ],
          sortedIndices: [...sortedIndices],
          pivotIndex: left,
          pivotValue: pivot,
          segments: [{ start: left, end: right, type: 'current' }],
          recursionStack: [...recursionStack],
          currentRecursionDepth: depth,
          message: `l(${l}) ≥ r(${r}), ponteiros cruzaram. Fim do particionamento.`,
          pseudocodeLine: 15,
          variables: { l, r }
        });
        break;
      }

      // Swap arr[l] and arr[r]
      steps.push({
        type: 'compare',
        array: [...arr],
        comparing: [l, r],
        pointers: [
          { index: left, label: 'pivot', type: 'pivot' },
          { index: l, label: 'l', type: 'left' },
          { index: r, label: 'r', type: 'right' }
        ],
        sortedIndices: [...sortedIndices],
        pivotIndex: left,
        pivotValue: pivot,
        segments: [{ start: left, end: right, type: 'current' }],
        recursionStack: [...recursionStack],
        currentRecursionDepth: depth,
        message: `v[${l}]=${arr[l]} está no lado errado, v[${r}]=${arr[r]} também. Trocando.`,
        pseudocodeLine: 16,
        variables: { 'v[l]': arr[l], 'v[r]': arr[r] }
      });

      const temp = arr[l];
      arr[l] = arr[r];
      arr[r] = temp;

      steps.push({
        type: 'swap',
        array: [...arr],
        swapping: [l, r],
        pointers: [
          { index: left, label: 'pivot', type: 'pivot' },
          { index: l, label: 'l', type: 'left' },
          { index: r, label: 'r', type: 'right' }
        ],
        sortedIndices: [...sortedIndices],
        pivotIndex: left,
        pivotValue: pivot,
        segments: [{ start: left, end: right, type: 'current' }],
        recursionStack: [...recursionStack],
        currentRecursionDepth: depth,
        message: `Trocado: ${arr[l]} ↔ ${arr[r]}`,
        pseudocodeLine: 17,
        variables: { 'v[l]': arr[l], 'v[r]': arr[r] }
      });

      l++;
      r--;
    }

    // Place pivot in correct position
    arr[left] = arr[r];
    arr[r] = pivot;

    steps.push({
      type: 'pivot_place',
      array: [...arr],
      swapping: [left, r],
      pointers: [{ index: r, label: 'pivot', type: 'pivot' }],
      sortedIndices: [...sortedIndices],
      pivotIndex: r,
      pivotValue: pivot,
      segments: [
        { start: left, end: r - 1, type: 'left' },
        { start: r + 1, end: right, type: 'right' }
      ],
      recursionStack: [...recursionStack],
      currentRecursionDepth: depth,
      message: `Colocando pivô ${pivot} na posição correta ${r}`,
      pseudocodeLine: 19,
      variables: { pivot, 'posição final': r }
    });

    return r;
  }

  quickSort(0, n - 1, 0);

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
    pseudocodeLine: 21,
    variables: {}
  });

  return steps;
}

/**
 * Quick Sort pseudocode for display
 */
export const QUICK_SORT_PSEUDOCODE = [
  'QuickSort(min, max) {',
  '    if (min < max) {',
  '        p = Partition(min, max);',
  '        QuickSort(min, p - 1);',
  '        QuickSort(p + 1, max);',
  '    }',
  '}',
  '',
  'Partition(left, right) {',
  '    pivot = v[left];',
  '    l = left + 1;',
  '    r = right;',
  '    while (true) {',
  '        while (l < right && v[l] < pivot) l++;',
  '        while (r > left && v[r] >= pivot) r--;',
  '        if (l >= r) break;',
  '        swap(v[l], v[r]);',
  '    }',
  '    v[left] = v[r]; v[r] = pivot;',
  '    return r;',
  '}'
];
