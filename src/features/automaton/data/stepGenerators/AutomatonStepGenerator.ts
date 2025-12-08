import { AFTable } from '@features/automaton/domain/entities/AFTable';
import { AutomatonStep } from '@features/automaton/domain/entities/AutomatonStep';
import { AutomatonStepType } from '@features/automaton/domain/entities/AutomatonStepType';
import { AutomatonConfig } from '@features/automaton/domain/entities/AutomatonConfig';
import {
  getPrefix,
  isSuffix,
  createEmptyAutomaton,
} from '@features/automaton/data/algorithms/AutomatonAlgorithm';

/**
 * Deep clones an AFTable to avoid mutation.
 */
function cloneAFTable(af: AFTable): AFTable {
  return JSON.parse(JSON.stringify(af));
}

/**
 * Generates all steps for building the automaton transition table.
 * 
 * This generator creates a sequence of steps that can be used to
 * visualize the automaton construction process step by step.
 * 
 * The algorithm for each cell AF[s, x]:
 * 1. Compute test string: P_s + x
 * 2. Start with k = min(s+1, m)
 * 3. Check if P_k is suffix of test string
 * 4. If not, decrement k and repeat
 * 5. When match found, assign AF[s, x] = k
 * 
 * @param config - The automaton configuration (pattern and alphabet)
 * @returns Array of steps representing the construction process
 */
export function generateAutomatonSteps(config: AutomatonConfig): AutomatonStep[] {
  const { pattern, alphabet } = config;
  const m = pattern.length;
  const steps: AutomatonStep[] = [];
  
  // Initialize empty automaton
  let af = createEmptyAutomaton(m, alphabet);
  
  // Initial step
  steps.push({
    position: { s: 0, x: 0 },
    k: 0,
    type: 'idle',
    testString: '',
    candidatePrefix: '',
    isMatch: null,
    af: cloneAFTable(af),
    message: 'Autômato inicializado. Pronto para começar a construção.',
  });
  
  // Process each cell
  for (let s = 0; s <= m; s++) {
    for (let x = 0; x < alphabet.length; x++) {
      const char = alphabet[x];
      const prefixS = getPrefix(pattern, s);
      const testString = prefixS + char;
      const initialK = Math.min(s + 1, m);
      
      // Test each k value from initialK down to 0
      let currentK = initialK;
      let foundMatch = false;
      
      while (!foundMatch && currentK >= 0) {
        const candidatePrefix = getPrefix(pattern, currentK);
        const isMatch = isSuffix(candidatePrefix, testString);
        
        if (isMatch) {
          // Found a match - create step showing the match
          steps.push({
            position: { s, x },
            k: currentK,
            type: 'matched',
            testString,
            candidatePrefix: candidatePrefix || 'ε',
            isMatch: true,
            af: cloneAFTable(af),
            message: currentK === initialK
              ? `Calculando AF[${s}, '${char}']. String de teste: "${testString}". k = ${currentK}: Match encontrado! P${currentK} = "${candidatePrefix || 'ε'}" é sufixo de "${testString}".`
              : `k = ${currentK}: Match encontrado! P${currentK} = "${candidatePrefix || 'ε'}" é sufixo de "${testString}". AF[${s}, '${char}'] = ${currentK}`,
          });
          
          // Assign value to cell
          af[s][char] = currentK;
          
          // Create assigned step
          const isLastCell = s === m && x === alphabet.length - 1;
          steps.push({
            position: { s, x },
            k: currentK,
            type: isLastCell ? 'complete' : 'assigned',
            testString: '',
            candidatePrefix: '',
            isMatch: null,
            af: cloneAFTable(af),
            message: isLastCell
              ? 'Construção do autômato completa!'
              : `AF[${s}, '${char}'] = ${currentK}. Avançando para próxima célula...`,
          });
          
          foundMatch = true;
        } else {
          // No match - create step showing the test
          const stepType: AutomatonStepType = currentK === initialK ? 'initialized' : 'testing';
          
          steps.push({
            position: { s, x },
            k: currentK,
            type: stepType,
            testString,
            candidatePrefix: candidatePrefix || 'ε',
            isMatch: false,
            af: cloneAFTable(af),
            message: `Calculando AF[${s}, '${char}']. String de teste: "${testString}". k = ${currentK}: P${currentK} = "${candidatePrefix || 'ε'}" não é sufixo. Testando k = ${currentK - 1}...`,
          });
          
          currentK--;
        }
      }
    }
  }
  
  return steps;
}

/**
 * Generates steps in "fast mode" - only showing match steps, not testing steps.
 * This is useful when the user wants to see the construction without
 * the intermediate suffix testing steps.
 * 
 * @param config - The automaton configuration
 * @returns Array of steps (only idle, matched, assigned, complete)
 */
export function generateAutomatonStepsFast(config: AutomatonConfig): AutomatonStep[] {
  const allSteps = generateAutomatonSteps(config);
  
  // Filter to only show idle, matched, assigned, and complete steps
  return allSteps.filter(step => 
    step.type === 'idle' ||
    step.type === 'matched' ||
    step.type === 'assigned' ||
    step.type === 'complete'
  );
}
