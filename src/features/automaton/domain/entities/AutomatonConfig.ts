/**
 * Configuration for the finite automaton construction simulator.
 *
 * Note: Unlike other pattern matching algorithms (KMP, Boyer-Moore),
 * the automaton simulator focuses on building the transition table,
 * not on searching text. Therefore, it only needs pattern and alphabet.
 */
export interface AutomatonConfig {
  /**
   * The pattern P to build the automaton for.
   * Length is denoted as m.
   * Example: "ababaca"
   */
  pattern: string;

  /**
   * The alphabet Σ containing all possible characters.
   * Example: ['a', 'b', 'c']
   */
  alphabet: string[];
}
