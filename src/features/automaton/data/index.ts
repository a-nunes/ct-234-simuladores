// Algorithms
export {
  getPrefix,
  isSuffix,
  calculateTransition,
  buildAutomaton,
  createEmptyAutomaton,
} from './algorithms/AutomatonAlgorithm';

// Step Generators
export {
  generateAutomatonSteps,
  generateAutomatonStepsFast,
} from './stepGenerators/AutomatonStepGenerator';

// Validators
export {
  validateAutomatonConfig,
  validatePattern,
  validateAlphabet,
  validatePatternInAlphabet,
  parseAlphabetString,
} from './validators/AutomatonValidator';
