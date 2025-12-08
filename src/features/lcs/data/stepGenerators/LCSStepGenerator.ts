import { LCSConfig } from '@features/lcs/domain/entities/LCSConfig';
import { LCSStep, LCSDirection } from '@features/lcs/domain/entities/LCSStep';
import { createEmptyLCSTables } from '@features/lcs/data/algorithms/LCSAlgorithm';

function cloneNumberMatrix(matrix: number[][]): number[][] {
  return matrix.map(row => [...row]);
}

function cloneDirectionMatrix(matrix: LCSDirection[][]): LCSDirection[][] {
  return matrix.map(row => [...row]);
}

/**
 * Generates visualization steps for the LCS dynamic programming process.
 * The steps capture:
 * - Initialization of tables
 * - Each cell update during the bottom-up pass
 * - Traceback used to rebuild the LCS string
 */
export function generateSteps(config: LCSConfig): LCSStep[] {
  const { stringX, stringY } = config;
  const m = stringX.length;
  const n = stringY.length;
  const { c, trace } = createEmptyLCSTables(m, n);

  const steps: LCSStep[] = [];

  const pushStep = (step: LCSStep) => {
    steps.push({
      ...step,
      c: cloneNumberMatrix(step.c),
      trace: cloneDirectionMatrix(step.trace)
    });
  };

  pushStep({
    type: 'init',
    description: `Inicializando algoritmo LCS. X = "${stringX}" (${m} caracteres), Y = "${stringY}" (${n} caracteres).`,
    c,
    trace
  });

  pushStep({
    type: 'fill_borders',
    description: 'Preenchendo linha 0 e coluna 0 com 0 (LCS de string vazia é 0).',
    c,
    trace
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const charX = stringX[i - 1];
      const charY = stringY[j - 1];

      pushStep({
        type: 'process_cell',
        description: `Processando c[${i},${j}]. Comparando X[${i}]='${charX}' com Y[${j}]='${charY}'.`,
        i,
        j,
        c,
        trace
      });

      if (charX === charY) {
        c[i][j] = c[i - 1][j - 1] + 1;
        trace[i][j] = 'DIAGONAL';

        pushStep({
          type: 'match',
          description: `✓ '${charX}' == '${charY}'! c[${i},${j}] = c[${i - 1},${j - 1}] + 1 = ${c[i - 1][j - 1]} + 1 = ${c[i][j]}. Seta: DIAGONAL ↖`,
          i,
          j,
          c,
          trace
        });
      } else if (c[i - 1][j] >= c[i][j - 1]) {
        c[i][j] = c[i - 1][j];
        trace[i][j] = 'CIMA';

        pushStep({
          type: 'no_match_up',
          description: `✗ '${charX}' ≠ '${charY}'. c[${i - 1},${j}] (${c[i - 1][j]}) >= c[${i},${j - 1}] (${c[i][j - 1]}). c[${i},${j}] = ${c[i][j]}. Seta: CIMA ↑`,
          i,
          j,
          c,
          trace
        });
      } else {
        c[i][j] = c[i][j - 1];
        trace[i][j] = 'ESQUERDA';

        pushStep({
          type: 'no_match_left',
          description: `✗ '${charX}' ≠ '${charY}'. c[${i},${j - 1}] (${c[i][j - 1]}) > c[${i - 1},${j}] (${c[i - 1][j]}). c[${i},${j}] = ${c[i][j]}. Seta: ESQUERDA ←`,
          i,
          j,
          c,
          trace
        });
      }
    }
  }

  pushStep({
    type: 'start_traceback',
    description: `Tabelas preenchidas! LCS tem comprimento ${c[m][n]}. Iniciando traceback de [${m},${n}] para reconstruir a LCS.`,
    c,
    trace,
    tracebackI: m,
    tracebackJ: n
  });

  let ti = m;
  let tj = n;
  const lcsChars: string[] = [];

  while (ti > 0 && tj > 0) {
    const direction = trace[ti][tj];

    pushStep({
      type: 'traceback_step',
      description: `Traceback em [${ti},${tj}]: trace = ${direction ?? 'Ø'}. ${
        direction === 'DIAGONAL'
          ? `Adicionando '${stringX[ti - 1]}' à LCS.`
          : direction === 'CIMA'
          ? 'Subindo (i-1).'
          : direction === 'ESQUERDA'
          ? 'Indo à esquerda (j-1).'
          : 'Fim das setas.'
      }`,
      c,
      trace,
      tracebackI: ti,
      tracebackJ: tj,
      lcs: lcsChars.join('')
    });

    if (direction === 'DIAGONAL') {
      lcsChars.unshift(stringX[ti - 1]);
      ti--;
      tj--;
    } else if (direction === 'CIMA') {
      ti--;
    } else if (direction === 'ESQUERDA') {
      tj--;
    } else {
      break;
    }
  }

  pushStep({
    type: 'complete',
    description: `Traceback concluído! LCS = "${lcsChars.join('')}" (comprimento ${c[m][n]}).`,
    c,
    trace,
    lcs: lcsChars.join('')
  });

  return steps;
}
