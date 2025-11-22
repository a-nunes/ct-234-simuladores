import { generateSteps } from '@features/binary-search/data/stepGenerators/BinarySearchStepGenerator';
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';

describe('BinarySearchStepGenerator', () => {
  describe('generateSteps', () => {
    it('should generate initial step', () => {
      const arr = [2, 5, 8, 12, 16, 23];
      const steps = generateSteps(arr, 23);
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[0].l).toBe(0);
      expect(steps[0].r).toBe(arr.length - 1);
      expect(steps[0].callStack).toEqual([]);
    });

    it('should generate found step when value exists', () => {
      const arr = [2, 5, 8, 12, 16, 23];
      const steps = generateSteps(arr, 23);
      
      const foundStep = steps.find(step => step.type === 'found');
      expect(foundStep).toBeDefined();
      expect(foundStep?.q).toBe(5);
      expect(foundStep?.value).toBe(23);
    });

    it('should generate not_found step when value does not exist', () => {
      const arr = [2, 5, 8, 12, 16, 23];
      const steps = generateSteps(arr, 99);
      
      const notFoundStep = steps.find(step => step.type === 'not_found');
      expect(notFoundStep).toBeDefined();
    });

    it('should generate compare steps', () => {
      const arr = [2, 5, 8, 12, 16, 23];
      const steps = generateSteps(arr, 23);
      
      const compareSteps = steps.filter(step => step.type === 'compare');
      expect(compareSteps.length).toBeGreaterThan(0);
    });

    it('should generate calculate_pivot steps', () => {
      const arr = [2, 5, 8, 12, 16, 23];
      const steps = generateSteps(arr, 23);
      
      const pivotSteps = steps.filter(step => step.type === 'calculate_pivot');
      expect(pivotSteps.length).toBeGreaterThan(0);
      pivotSteps.forEach(step => {
        expect(step.q).toBeDefined();
        expect(step.value).toBeDefined();
      });
    });

    it('should build callStack correctly for recursive calls', () => {
      const arr = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78];
      const steps = generateSteps(arr, 23);
      
      // Find a step with callStack
      const stepWithStack = steps.find(step => step.callStack.length > 0);
      expect(stepWithStack).toBeDefined();
      
      if (stepWithStack) {
        // Call stack should contain recursive calls
        const hasRecursiveCall = stepWithStack.callStack.some(call => 
          call.includes('BinarySearch')
        );
        expect(hasRecursiveCall).toBe(true);
      }
    });

    it('should generate go_left steps when searching left', () => {
      const arr = [2, 5, 8, 12, 16, 23];
      const steps = generateSteps(arr, 2); // Search for first element
      
      const goLeftSteps = steps.filter(step => step.type === 'go_left');
      expect(goLeftSteps.length).toBeGreaterThan(0);
    });

    it('should generate go_right steps when searching right', () => {
      const arr = [2, 5, 8, 12, 16, 23];
      const steps = generateSteps(arr, 23); // Search for last element
      
      const goRightSteps = steps.filter(step => step.type === 'go_right');
      expect(goRightSteps.length).toBeGreaterThan(0);
    });

    it('should generate focus steps for sub-arrays', () => {
      const arr = [2, 5, 8, 12, 16, 23];
      const steps = generateSteps(arr, 23);
      
      const focusSteps = steps.filter(step => step.type === 'focus');
      expect(focusSteps.length).toBeGreaterThan(0);
    });
  });
});

