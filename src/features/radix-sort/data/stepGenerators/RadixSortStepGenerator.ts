import { RadixSortStep, Bucket, ArrayPointer } from '@features/radix-sort/domain/entities/RadixSortStep';

/**
 * Pseudocode for Radix Sort (LSD - Least Significant Digit)
 */
export const RADIX_SORT_PSEUDOCODE = [
  'RadixSort(v, n, d) {',
  '  factor = 1;',
  '  for (i = 0; i < d; i++) {',
  '    // Distribuição nos baldes',
  '    for (j = 1; j <= n; j++) {',
  '      digit = (v[j] / factor) % base;',
  '      q[digit].enqueue(v[j]);',
  '    }',
  '    // Coleta dos baldes',
  '    k = 1;',
  '    for (j = 0; j < base; j++) {',
  '      while (!q[j].isEmpty()) {',
  '        v[k++] = q[j].dequeue();',
  '      }',
  '    }',
  '    factor = factor * base;',
  '  }',
  '}'
];

/**
 * Creates empty buckets for radix sort.
 */
function createEmptyBuckets(base: number): Bucket[] {
  return Array.from({ length: base }, (_, i) => ({
    digit: i,
    elements: []
  }));
}

/**
 * Gets the digit at a specific position.
 * @param num The number
 * @param factor The factor (1, 10, 100, etc.)
 * @param base The base (usually 10)
 */
function getDigit(num: number, factor: number, base: number): number {
  return Math.floor(num / factor) % base;
}

/**
 * Gets the maximum number of digits in the array.
 */
function getMaxDigits(arr: number[], base: number): number {
  const maxVal = Math.max(...arr);
  if (maxVal === 0) return 1;
  return Math.floor(Math.log(maxVal) / Math.log(base)) + 1;
}

/**
 * Generates visualization steps for Radix Sort algorithm (LSD).
 * 
 * The algorithm processes digits from least significant to most significant,
 * using stable sorting (buckets/queues) at each step.
 */
export function generateRadixSortSteps(inputArray: number[], base: number = 10): RadixSortStep[] {
  const steps: RadixSortStep[] = [];
  const arr = [...inputArray];
  const n = arr.length;
  const maxDigits = getMaxDigits(arr, base);

  // Initial step
  steps.push({
    type: 'init',
    array: [...arr],
    buckets: createEmptyBuckets(base),
    currentDigitPosition: 0,
    currentDigitFactor: 1,
    pointers: [],
    sortedIndices: [],
    message: `Iniciando Radix Sort (LSD) com ${n} elementos. Máximo de ${maxDigits} dígito(s). Base ${base}.`,
    pseudocodeLine: 1,
    variables: { n, d: maxDigits, base, factor: 1 }
  });

  let factor = 1;

  // Process each digit position (from LSD to MSD)
  for (let digitPos = 0; digitPos < maxDigits; digitPos++) {
    const buckets = createEmptyBuckets(base);

    // Step: Select digit position
    steps.push({
      type: 'select_digit',
      array: [...arr],
      buckets: createEmptyBuckets(base),
      currentDigitPosition: digitPos + 1,
      currentDigitFactor: factor,
      pointers: [],
      sortedIndices: [],
      message: `Processando o ${digitPos + 1}º dígito (posição ${digitPos === 0 ? 'unidades' : digitPos === 1 ? 'dezenas' : digitPos === 2 ? 'centenas' : 'milhares'}, factor=${factor})`,
      pseudocodeLine: 3,
      variables: { i: digitPos, factor, d: maxDigits }
    });

    // Distribution phase: place each element in its bucket
    for (let j = 0; j < n; j++) {
      const element = arr[j];
      const digit = getDigit(element, factor, base);
      
      // Create pointers for current element
      const pointers: ArrayPointer[] = [
        { index: j, label: 'j', type: 'current' }
      ];

      // Step: Show distribution
      steps.push({
        type: 'distribute',
        array: [...arr],
        buckets: buckets.map(b => ({ ...b, elements: [...b.elements] })),
        currentDigitPosition: digitPos + 1,
        currentDigitFactor: factor,
        currentElementIndex: j,
        currentElement: element,
        currentDigit: digit,
        highlightedBucket: digit,
        pointers,
        sortedIndices: [],
        message: `Elemento ${element}: dígito = (${element} / ${factor}) % ${base} = ${digit}. Colocando no balde ${digit}.`,
        pseudocodeLine: 6,
        variables: { 
          j: j + 1, 
          'v[j]': element, 
          digit, 
          factor 
        }
      });

      // Add element to bucket
      buckets[digit].elements.push(element);
    }

    // Collect phase: gather elements from buckets back to array
    let k = 0;
    
    for (let bucketIdx = 0; bucketIdx < base; bucketIdx++) {
      const bucket = buckets[bucketIdx];
      
      if (bucket.elements.length > 0) {
        // Step: Show collection from this bucket
        for (let elemIdx = 0; elemIdx < bucket.elements.length; elemIdx++) {
          const element = bucket.elements[elemIdx];
          arr[k] = element;

          steps.push({
            type: 'collect',
            array: [...arr],
            buckets: buckets.map(b => ({ ...b, elements: [...b.elements] })),
            currentDigitPosition: digitPos + 1,
            currentDigitFactor: factor,
            currentElementIndex: k,
            currentElement: element,
            highlightedBucket: bucketIdx,
            pointers: [
              { index: k, label: 'k', type: 'collected' }
            ],
            sortedIndices: [],
            message: `Coletando ${element} do balde ${bucketIdx} → posição ${k}`,
            pseudocodeLine: 12,
            variables: { 
              k: k + 1, 
              'q[j]': bucketIdx,
              element
            }
          });

          k++;
        }
      }
    }

    factor *= base;
  }

  // Final step - all elements are sorted
  steps.push({
    type: 'complete',
    array: [...arr],
    buckets: createEmptyBuckets(base),
    currentDigitPosition: maxDigits,
    currentDigitFactor: factor,
    pointers: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    message: `Ordenação completa! Todos os ${maxDigits} dígitos foram processados.`,
    pseudocodeLine: 15,
    variables: {}
  });

  return steps;
}
