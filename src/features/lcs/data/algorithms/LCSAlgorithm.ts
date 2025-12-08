import { LCSDirection } from '@features/lcs/domain/entities/LCSStep';

export interface LCSTables {
  c: number[][];
  trace: LCSDirection[][];
}

/**
 * Creates zero-initialized tables for LCS dynamic programming.
 * @param m Length of string X
 * @param n Length of string Y
 */
export function createEmptyLCSTables(m: number, n: number): LCSTables {
  const c = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const trace = Array.from({ length: m + 1 }, () =>
    Array<LCSDirection>(n + 1).fill(null)
  );

  return { c, trace };
}

/**
 * Builds the LCS length (`c`) and direction (`trace`) tables using
 * the classic bottom-up dynamic programming algorithm.
 * @param stringX First string (X)
 * @param stringY Second string (Y)
 * @returns Filled `c` and `trace` tables
 */
export function buildLCSTables(stringX: string, stringY: string): LCSTables {
  const m = stringX.length;
  const n = stringY.length;

  const { c, trace } = createEmptyLCSTables(m, n);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const charX = stringX[i - 1];
      const charY = stringY[j - 1];

      if (charX === charY) {
        c[i][j] = c[i - 1][j - 1] + 1;
        trace[i][j] = 'DIAGONAL';
      } else if (c[i - 1][j] >= c[i][j - 1]) {
        c[i][j] = c[i - 1][j];
        trace[i][j] = 'CIMA';
      } else {
        c[i][j] = c[i][j - 1];
        trace[i][j] = 'ESQUERDA';
      }
    }
  }

  return { c, trace };
}

/**
 * Reconstructs the LCS string using the `trace` table.
 * @param trace Direction table returned by `buildLCSTables`
 * @param stringX First string (X) - used to pull characters
 * @param i Optional starting row (defaults to stringX length)
 * @param j Optional starting column (defaults to trace row length - 1)
 * @returns LCS string reconstructed from the trace
 */
export function reconstructLCS(
  trace: LCSDirection[][],
  stringX: string,
  i: number = trace.length - 1,
  j: number = trace[0]?.length - 1
): string {
  const lcsChars: string[] = [];
  let ti = i;
  let tj = j;

  while (ti > 0 && tj > 0) {
    const direction = trace[ti][tj];

    if (direction === 'DIAGONAL') {
      lcsChars.unshift(stringX[ti - 1]);
      ti--;
      tj--;
    } else if (direction === 'CIMA') {
      ti--;
    } else {
      tj--;
    }
  }

  return lcsChars.join('');
}
