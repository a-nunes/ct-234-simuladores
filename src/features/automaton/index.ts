// Domain exports
export type {
  AFTable,
  AFTableRow,
  AFCellPosition,
  AutomatonStep,
  AutomatonStepType,
  AutomatonConfig,
} from './domain';
export { InvalidInputError } from './domain';

// Data exports
export {
  // Algorithms
  getPrefix,
  isSuffix,
  calculateTransition,
  buildAutomaton,
  createEmptyAutomaton,
  // Step Generators
  generateAutomatonSteps,
  generateAutomatonStepsFast,
  // Validators
  validateAutomatonConfig,
  validatePattern,
  validateAlphabet,
  validatePatternInAlphabet,
  parseAlphabetString,
} from './data';

// TODO: Add presentation exports when component is refactored
// export { AutomatonSimulator } from './presentation/components/AutomatonSimulator';
