import { generateSteps } from '@features/boyer-moore/data/stepGenerators/BoyerMooreStepGenerator';
import { buildLastOccurrence } from '@features/boyer-moore/data/algorithms/BoyerMooreAlgorithm';

describe('BoyerMooreStepGenerator', () => {
  describe('generateSteps', () => {
    it('should generate steps for pattern found scenario', () => {
      const text = 'araras';
      const pattern = 'araras';
      const lastOcc = buildLastOccurrence(pattern);
      
      const steps = generateSteps(text, pattern, lastOcc);
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[steps.length - 1].found).toBe(true);
    });

    it('should generate steps with correct comparison order (right to left)', () => {
      const text = 'vi na mata duas aranhas e duas araras';
      const pattern = 'araras';
      const lastOcc = buildLastOccurrence(pattern);
      
      const steps = generateSteps(text, pattern, lastOcc);
      
      // Each step should have comparisons starting from rightmost character
      steps.forEach(step => {
        if (step.comparisons.length > 0) {
          const indices = step.comparisons.map(c => c.index);
          // Comparisons should be in descending order by index (right to left)
          for (let i = 1; i < indices.length; i++) {
            expect(indices[i]).toBeLessThan(indices[i - 1]);
          }
        }
      });
    });

    it('should generate steps with mismatch info when pattern not found immediately', () => {
      const text = 'hello world';
      const pattern = 'xyz';
      const lastOcc = buildLastOccurrence(pattern);
      
      const steps = generateSteps(text, pattern, lastOcc);
      
      expect(steps.length).toBeGreaterThan(0);
      // At least one step should have mismatch info
      const hasMismatch = steps.some(step => step.mismatchChar !== null);
      expect(hasMismatch).toBe(true);
    });

    it('should track comparison count correctly', () => {
      const text = 'abcdef';
      const pattern = 'def';
      const lastOcc = buildLastOccurrence(pattern);
      
      const steps = generateSteps(text, pattern, lastOcc);
      
      // Comparison count should increase across steps
      let lastCount = 0;
      steps.forEach(step => {
        expect(step.comparisonCount).toBeGreaterThanOrEqual(lastCount);
        lastCount = step.comparisonCount;
      });
    });
  });
});
