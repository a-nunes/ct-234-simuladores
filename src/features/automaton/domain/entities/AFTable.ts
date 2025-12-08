/**
 * Represents a single row in the automaton transition table.
 * Maps each character in the alphabet to the next state.
 *
 * Example for state 0 with alphabet ['a', 'b', 'c']:
 * { 'a': 1, 'b': 0, 'c': 0 }
 */
export type AFTableRow = {
  [character: string]: number | null;
};

/**
 * Represents the complete automaton transition table (AF matrix).
 * Array of rows, where index is the current state (0 to m).
 *
 * AF[s][x] = next state when in state s and reading character x
 *
 * During construction, null values indicate cells not yet calculated.
 */
export type AFTable = AFTableRow[];
