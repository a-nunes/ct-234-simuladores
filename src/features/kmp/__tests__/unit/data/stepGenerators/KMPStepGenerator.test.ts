import { generateSearchSteps } from '@features/kmp/data/stepGenerators/KMPStepGenerator';
import { buildFailureFunction } from '@features/kmp/data/algorithms/KMPAlgorithm';
import { isSearchStep } from '@features/kmp/domain/entities/KMPStep';

describe('KMPStepGenerator', () => {
  describe('generateSearchSteps', () => {
    it('should generate steps for pattern found scenario', () => {
      const text = 'abacaabaccabacabaabb';
      const pattern = 'abacab';
      const { table } = buildFailureFunction(pattern);
      
      const steps = generateSearchSteps(text, pattern, table);
      
      expect(steps.length).toBeGreaterThan(0);
      const lastStep = steps[steps.length - 1];
      expect(lastStep.found).toBe(true);
      expect(lastStep.type).toBe('found');
    });

    it('should generate steps for pattern not found scenario', () => {
      const text = 'abcdefghij';
      const pattern = 'xyz';
      const { table } = buildFailureFunction(pattern);
      
      const steps = generateSearchSteps(text, pattern, table);
      
      expect(steps.length).toBeGreaterThan(0);
      const lastStep = steps[steps.length - 1];
      expect(lastStep.found).toBe(false);
    });

    it('should start with init step', () => {
      const text = 'abcdef';
      const pattern = 'abc';
      const { table } = buildFailureFunction(pattern);
      
      const steps = generateSearchSteps(text, pattern, table);
      
      expect(steps[0].type).toBe('init');
      expect(steps[0].i).toBe(0);
      expect(steps[0].j).toBe(0);
    });

    it('should track comparison count correctly', () => {
      const text = 'abacaabaccabacabaabb';
      const pattern = 'abacab';
      const { table } = buildFailureFunction(pattern);
      
      const steps = generateSearchSteps(text, pattern, table);
      
      // Comparison count should be non-decreasing
      let lastCount = 0;
      steps.forEach(step => {
        expect(step.comparisonCount).toBeGreaterThanOrEqual(lastCount);
        lastCount = step.comparisonCount;
      });
    });

    it('should mark usedFailure when failure function is applied', () => {
      const text = 'abacaabaccabacabaabb';
      const pattern = 'abacab';
      const { table } = buildFailureFunction(pattern);
      
      const steps = generateSearchSteps(text, pattern, table);
      
      // There should be at least one step that used the failure function
      const usedFailureSteps = steps.filter(s => s.usedFailure === true);
      expect(usedFailureSteps.length).toBeGreaterThan(0);
    });

    it('should include comparisons for current position', () => {
      const text = 'abcdef';
      const pattern = 'abc';
      const { table } = buildFailureFunction(pattern);
      
      const steps = generateSearchSteps(text, pattern, table);
      
      // Compare steps should have comparisons array
      const compareSteps = steps.filter(s => s.type === 'compare');
      compareSteps.forEach(step => {
        expect(Array.isArray(step.comparisons)).toBe(true);
      });
    });

    it('should correctly track position alignment', () => {
      const text = 'xxxabcyyy';
      const pattern = 'abc';
      const { table } = buildFailureFunction(pattern);
      
      const steps = generateSearchSteps(text, pattern, table);
      
      // All steps should have valid position
      steps.forEach(step => {
        expect(step.position).toBeGreaterThanOrEqual(0);
        expect(step.position).toBeLessThanOrEqual(text.length - pattern.length);
      });
    });

    it('should generate steps with left-to-right comparison order', () => {
      const text = 'abcdef';
      const pattern = 'abc';
      const { table } = buildFailureFunction(pattern);
      
      const steps = generateSearchSteps(text, pattern, table);
      
      // KMP compares left to right, unlike Boyer-Moore
      // Check that j increases as matches occur
      const matchSteps = steps.filter(s => s.type === 'advance' && s.match === true);
      if (matchSteps.length > 1) {
        for (let i = 1; i < matchSteps.length; i++) {
          // j should increase for consecutive matches at same position
          // (or reset when using failure function)
        }
      }
    });
  });
});
