import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';

/**
 * Generates visualization steps for binary search algorithm.
 * Captures each step of the algorithm execution for visualization.
 */
export function generateSteps(arr: number[], x: number): BinarySearchStep[] {
  const allSteps: BinarySearchStep[] = [];

  // Initial step
  allSteps.push({
    type: 'init',
    l: 0,
    r: arr.length - 1,
    message: `Iniciando busca binária por ${x} no vetor ordenado`,
    callStack: []
  });

  const binarySearch = (l: number, r: number, depth: number = 0): boolean => {
    const indent = '  '.repeat(depth);
    const callStackEntry = `${indent}BinarySearch(l=${l}, r=${r}, x=${x})`;

    // Focus step - focusing on sub-array
    allSteps.push({
      type: 'focus',
      l,
      r,
      message: `Focando no sub-vetor v[${l}...${r}]`,
      callStack: [...(allSteps[allSteps.length - 1]?.callStack || []), callStackEntry]
    });

    // Check if not found
    if (r < l) {
      allSteps.push({
        type: 'not_found',
        l,
        r,
        message: `r (${r}) < l (${l}). Valor não encontrado!`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      return false;
    }

    // Calculate pivot
    const q = Math.floor((l + r) / 2);
    allSteps.push({
      type: 'calculate_pivot',
      l,
      r,
      q,
      value: arr[q],
      message: `Pivô calculado: q = ⌊(${l}+${r})/2⌋ = ${q}, v[${q}] = ${arr[q]}`,
      callStack: allSteps[allSteps.length - 1].callStack
    });

    // Compare step
    allSteps.push({
      type: 'compare',
      l,
      r,
      q,
      value: arr[q],
      message: `Comparando: v[${q}] = ${arr[q]} com x = ${x}`,
      callStack: allSteps[allSteps.length - 1].callStack
    });

    // Found
    if (arr[q] === x) {
      allSteps.push({
        type: 'found',
        l,
        r,
        q,
        value: arr[q],
        message: `✓ Valor ${x} encontrado no índice ${q}!`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      return true;
    }

    // Go left
    if (arr[q] > x) {
      allSteps.push({
        type: 'go_left',
        l,
        r,
        q,
        value: arr[q],
        message: `v[${q}] = ${arr[q]} > ${x}. Buscando na metade esquerda...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      return binarySearch(l, q - 1, depth + 1);
    } else {
      // Go right
      allSteps.push({
        type: 'go_right',
        l,
        r,
        q,
        value: arr[q],
        message: `v[${q}] = ${arr[q]} < ${x}. Buscando na metade direita...`,
        callStack: allSteps[allSteps.length - 1].callStack
      });
      return binarySearch(q + 1, r, depth + 1);
    }
  };

  binarySearch(0, arr.length - 1);

  return allSteps;
}

