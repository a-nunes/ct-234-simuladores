import { HeapSortStep, HeapPointer } from '@features/heap-sort/domain/entities/HeapSortStep';
import { getLeftChild, getRightChild } from '@features/heap-sort/data/algorithms/HeapAlgorithm';

/**
 * Generates visualization steps for Heap Sort algorithm.
 * 
 * Pseudocode:
 * HeapSort(v, n) {
 *   Build(v, n);
 *   for (i = n; i > 1; i--) {
 *     swap(v[1], v[i]);
 *     Sift(1, i - 1);
 *   }
 * }
 * 
 * Sift(i, n) {
 *   esq = 2 * i;
 *   dir = 2 * i + 1;
 *   maior = i;
 *   if (esq <= n && v[esq] > v[i]) maior = esq;
 *   if (dir <= n && v[dir] > v[maior]) maior = dir;
 *   if (maior != i) {
 *     swap(v[i], v[maior]);
 *     Sift(maior, n);
 *   }
 * }
 */
export function generateHeapSortSteps(inputArray: number[]): HeapSortStep[] {
  const steps: HeapSortStep[] = [];
  const arr = [...inputArray];
  const n = arr.length;
  const sortedIndices: number[] = [];
  const withN = (variables: Record<string, number | string> = {}) => ({
    n,
    ...variables
  });

  // Initial step
  steps.push({
    type: 'init',
    phase: 'build',
    array: [...arr],
    heapSize: n,
    pointers: [],
    sortedIndices: [],
    highlightPath: [],
    message: `Iniciando Heap Sort com vetor de ${n} elementos`,
    pseudocodeLine: 1,
    variables: withN()
  });

  // Start build phase
  steps.push({
    type: 'start_build',
    phase: 'build',
    array: [...arr],
    heapSize: n,
    pointers: [],
    sortedIndices: [],
    highlightPath: [],
    message: `Fase 1: Build - Transformando o vetor em Max-Heap`,
    pseudocodeLine: 2,
    variables: withN()
  });

  // Build phase: sift from n/2-1 down to 0
  const startIndex = Math.floor(n / 2) - 1;
  
  for (let i = startIndex; i >= 0; i--) {
    // Generate sift steps for this index
    generateSiftSteps(arr, i, n, n, steps, 'build', sortedIndices);
  }

  // Build complete
  steps.push({
    type: 'build_complete',
    phase: 'build',
    array: [...arr],
    heapSize: n,
    pointers: [],
    sortedIndices: [],
    highlightPath: [],
    message: `Build completo! O vetor agora é um Max-Heap válido`,
    pseudocodeLine: 2,
    variables: withN()
  });

  // Extract phase
  steps.push({
    type: 'start_extract',
    phase: 'extract',
    array: [...arr],
    heapSize: n,
    pointers: [],
    sortedIndices: [],
    highlightPath: [],
    message: `Fase 2: Extração - Removendo elementos do heap`,
    pseudocodeLine: 3,
    variables: withN()
  });

  // Extract elements one by one
  for (let heapSize = n; heapSize > 1; heapSize--) {
    const lastIndex = heapSize - 1;
    
    // Show extraction of max
    steps.push({
      type: 'extract_max',
      phase: 'extract',
      array: [...arr],
      heapSize: heapSize,
      currentIndex: 0,
      swapping: [0, lastIndex],
      pointers: [
        { index: 0, label: 'max', type: 'current' },
        { index: lastIndex, label: 'último', type: 'swap' }
      ],
      sortedIndices: [...sortedIndices],
      highlightPath: [0, lastIndex],
      message: `Trocando raiz (max=${arr[0]}) com último elemento (${arr[lastIndex]})`,
      pseudocodeLine: 4,
      variables: withN({ i: heapSize, 'v[1]': arr[0], 'v[i]': arr[lastIndex] })
    });

    // Swap root with last element
    [arr[0], arr[lastIndex]] = [arr[lastIndex], arr[0]];

    // Mark last position as sorted
    sortedIndices.push(lastIndex);

    steps.push({
      type: 'reduce_heap',
      phase: 'extract',
      array: [...arr],
      heapSize: heapSize - 1,
      pointers: [],
      sortedIndices: [...sortedIndices],
      highlightPath: [],
      message: `Elemento ${arr[lastIndex]} está na posição final. Heap reduzido para ${heapSize - 1} elementos`,
      pseudocodeLine: 5,
      variables: withN({ i: heapSize - 1 })
    });

    // Sift down root to restore heap property
    if (heapSize - 1 > 1) {
      generateSiftSteps(arr, 0, heapSize - 1, n, steps, 'extract', sortedIndices);
    }
  }

  // Final step
  sortedIndices.push(0);
  steps.push({
    type: 'complete',
    phase: 'extract',
    array: [...arr],
    heapSize: 0,
    pointers: [],
    sortedIndices: sortedIndices.sort((a, b) => a - b),
    highlightPath: [],
    message: `Ordenação completa!`,
    pseudocodeLine: 6,
    variables: withN()
  });

  return steps;
}

/**
 * Generate sift steps for a given index
 */
function generateSiftSteps(
  arr: number[],
  startIndex: number,
  heapSize: number,
  totalSize: number,
  steps: HeapSortStep[],
  phase: 'build' | 'extract',
  sortedIndices: number[]
): void {
  let i = startIndex;
  const withN = (variables: Record<string, number | string> = {}) => ({
    n: totalSize,
    ...variables
  });

  // Start sift
  steps.push({
    type: 'start_sift',
    phase,
    array: [...arr],
    heapSize,
    currentIndex: i,
    pointers: [{ index: i, label: 'i', type: 'current' }],
    sortedIndices: [...sortedIndices],
    highlightPath: [i],
    message: `Sift: Verificando nó ${i} (valor=${arr[i]})`,
    pseudocodeLine: 7,
    variables: withN({ i: i + 1, 'v[i]': arr[i] })
  });

  while (true) {
    const left = getLeftChild(i);
    const right = getRightChild(i);
    let largest = i;

    const pointers: HeapPointer[] = [{ index: i, label: 'i', type: 'compare' }];
    const highlightPath: number[] = [i];

    // Check children
    if (left < heapSize) {
      pointers.push({ index: left, label: 'esq', type: 'compare' });
      highlightPath.push(left);
    }
    if (right < heapSize) {
      pointers.push({ index: right, label: 'dir', type: 'compare' });
      highlightPath.push(right);
    }

    // Compare with children step
    steps.push({
      type: 'compare_children',
      phase,
      array: [...arr],
      heapSize,
      currentIndex: i,
      leftChild: left < heapSize ? left : undefined,
      rightChild: right < heapSize ? right : undefined,
      pointers,
      sortedIndices: [...sortedIndices],
      highlightPath,
      message: `Comparando ${arr[i]} com filhos${left < heapSize ? ` esq=${arr[left]}` : ''}${right < heapSize ? ` dir=${arr[right]}` : ''}`,
      pseudocodeLine: 10,
      variables: withN({
        i: i + 1,
        esq: left + 1,
        dir: right + 1,
        'v[i]': arr[i],
        ...(left < heapSize && { 'v[esq]': arr[left] }),
        ...(right < heapSize && { 'v[dir]': arr[right] })
      })
    });

    // Find largest
    if (left < heapSize && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < heapSize && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      // Select larger step
      steps.push({
        type: 'select_larger',
        phase,
        array: [...arr],
        heapSize,
        currentIndex: i,
        largerChild: largest,
        pointers: [
          { index: i, label: 'i', type: 'current' },
          { index: largest, label: 'maior', type: 'larger' }
        ],
        sortedIndices: [...sortedIndices],
        highlightPath: [i, largest],
        message: `Maior filho: ${arr[largest]} na posição ${largest}`,
        pseudocodeLine: 11,
        variables: withN({ i: i + 1, maior: largest + 1, 'v[maior]': arr[largest] })
      });

      // Swap step
      steps.push({
        type: 'swap',
        phase,
        array: [...arr],
        heapSize,
        currentIndex: i,
        swapping: [i, largest],
        pointers: [
          { index: i, label: 'i', type: 'swap' },
          { index: largest, label: 'maior', type: 'swap' }
        ],
        sortedIndices: [...sortedIndices],
        highlightPath: [i, largest],
        message: `Trocando ${arr[i]} com ${arr[largest]}`,
        pseudocodeLine: 12,
        variables: withN({ i: i + 1, maior: largest + 1 })
      });

      // Perform swap
      [arr[i], arr[largest]] = [arr[largest], arr[i]];

      // Continue sifting down
      i = largest;
    } else {
      // Sift complete for this node
      steps.push({
        type: 'sift_complete',
        phase,
        array: [...arr],
        heapSize,
        currentIndex: i,
        pointers: [{ index: i, label: 'i', type: 'current' }],
        sortedIndices: [...sortedIndices],
        highlightPath: [i],
        message: `Sift completo: nó ${i} está na posição correta`,
        pseudocodeLine: 14,
        variables: withN({ i: i + 1 })
      });
      break;
    }
  }
}

/**
 * Heap Sort pseudocode for display
 */
export const HEAP_SORT_PSEUDOCODE = [
  'HeapSort(v, n) {',
  '    Build(v, n);',
  '    for (i = n; i > 1; i--) {',
  '        swap(v[1], v[i]);',
  '        Sift(1, i - 1);',
  '    }',
  '}',
  '',
  'Sift(i, n) {',
  '    esq = 2 * i; dir = 2 * i + 1;',
  '    maior = i;',
  '    if (esq <= n && v[esq] > v[i]) maior = esq;',
  '    if (dir <= n && v[dir] > v[maior]) maior = dir;',
  '    if (maior != i) {',
  '        swap(v[i], v[maior]);',
  '        Sift(maior, n);',
  '    }',
  '}'
];

/**
 * Build pseudocode for display
 */
export const BUILD_PSEUDOCODE = [
  'Build(v, n) {',
  '    for (i = floor(n/2); i > 0; i--) {',
  '        Sift(i, n);',
  '    }',
  '}'
];
