import { generateHeapSortSteps } from '@features/heap-sort/data/stepGenerators/HeapSortStepGenerator';
import { HeapSortStep } from '@features/heap-sort/domain/entities/HeapSortStep';

describe('HeapSortStepGenerator', () => {
  describe('generateHeapSortSteps', () => {
    it('should generate initial step', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1]);
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].phase).toBe('build');
      expect(steps[0].array).toEqual([5, 3, 8, 1]);
      expect(steps[0].heapSize).toBe(4);
    });

    it('should generate build phase steps', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1]);
      
      const buildSteps = steps.filter(s => s.phase === 'build');
      expect(buildSteps.length).toBeGreaterThan(0);
    });

    it('should generate extract phase steps', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1]);
      
      const extractSteps = steps.filter(s => s.phase === 'extract');
      expect(extractSteps.length).toBeGreaterThan(0);
    });

    it('should generate completed step at the end', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1]);
      
      const lastStep = steps[steps.length - 1];
      expect(lastStep.type).toBe('complete');
    });

    it('should result in sorted array at completion', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1, 9, 2, 7]);
      
      const lastStep = steps[steps.length - 1];
      expect(lastStep.array).toEqual([1, 2, 3, 5, 7, 8, 9]);
    });

    it('should maintain consistent heapSize reduction during extract phase', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1]);
      
      const extractSteps = steps.filter(s => s.phase === 'extract');
      let prevHeapSize = 4;
      
      extractSteps.forEach(step => {
        expect(step.heapSize).toBeLessThanOrEqual(prevHeapSize);
        prevHeapSize = step.heapSize;
      });
    });

    it('should handle already sorted array', () => {
      const steps = generateHeapSortSteps([1, 2, 3, 4, 5]);
      
      expect(steps.length).toBeGreaterThan(0);
      const lastStep = steps[steps.length - 1];
      expect(lastStep.type).toBe('complete');
      expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle reverse sorted array', () => {
      const steps = generateHeapSortSteps([5, 4, 3, 2, 1]);
      
      const lastStep = steps[steps.length - 1];
      expect(lastStep.type).toBe('complete');
      expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle array with duplicates', () => {
      const steps = generateHeapSortSteps([3, 1, 4, 1, 5]);
      
      const lastStep = steps[steps.length - 1];
      expect(lastStep.array).toEqual([1, 1, 3, 4, 5]);
    });

    it('should handle two element array', () => {
      const steps = generateHeapSortSteps([2, 1]);
      
      expect(steps.length).toBeGreaterThan(0);
      const lastStep = steps[steps.length - 1];
      expect(lastStep.array).toEqual([1, 2]);
    });

    it('should generate message for each step', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1]);
      
      steps.forEach(step => {
        expect(step.message).toBeDefined();
        expect(step.message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('step variables', () => {
    it('should track n variable', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1]);
      
      steps.forEach(step => {
        expect(step.variables.n).toBe(4);
      });
    });
  });

  describe('pointer types', () => {
    it('should use compare type for nodes being compared', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1]);
      
      const stepsWithComparePointer = steps.filter(s => 
        s.pointers.some(p => p.type === 'compare')
      );
      expect(stepsWithComparePointer.length).toBeGreaterThan(0);
    });

    it('should use swap type during swaps', () => {
      const steps = generateHeapSortSteps([1, 5, 3]); // Root needs to swap
      
      const stepsWithSwapPointer = steps.filter(s => 
        s.pointers.some(p => p.type === 'swap')
      );
      expect(stepsWithSwapPointer.length).toBeGreaterThan(0);
    });
  });

  describe('phase transitions', () => {
    it('should follow correct phase order', () => {
      const steps = generateHeapSortSteps([5, 3, 8, 1]);
      
      const phases = steps.map(s => s.phase);
      
      // Find indices of phase changes
      const buildIndex = phases.indexOf('build');
      const extractIndex = phases.indexOf('extract');
      
      expect(buildIndex).toBeGreaterThanOrEqual(0);
      expect(extractIndex).toBeGreaterThan(buildIndex);
    });
  });

  describe('edge cases', () => {
    it('should handle array with all same values', () => {
      const steps = generateHeapSortSteps([5, 5, 5, 5]);
      
      const lastStep = steps[steps.length - 1];
      expect(lastStep.array).toEqual([5, 5, 5, 5]);
    });
  });
});
