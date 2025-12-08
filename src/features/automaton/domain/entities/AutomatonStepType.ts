/**
 * Types of steps during the finite automaton construction.
 *
 * - 'idle': Initial state, waiting to start calculation
 * - 'initialized': Started calculating a new cell, first k tested
 * - 'testing': Testing decremented k values for suffix match
 * - 'matched': Found a suffix match, ready to assign value
 * - 'assigned': Value assigned to cell, moving to next cell
 * - 'complete': All cells calculated, automaton construction finished
 */
export type AutomatonStepType =
  | 'idle'
  | 'initialized'
  | 'testing'
  | 'matched'
  | 'assigned'
  | 'complete';
