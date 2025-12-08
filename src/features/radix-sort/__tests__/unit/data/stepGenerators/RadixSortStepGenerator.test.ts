import { generateRadixSortSteps } from '@features/radix-sort/data/stepGenerators/RadixSortStepGenerator';

describe('RadixSortStepGenerator', () => {
  describe('generateRadixSortSteps', () => {
    it('should generate correct steps for simple array', () => {
      const input = [170, 45, 75, 90];
      const steps = generateRadixSortSteps(input, 10);

      // Should have init step
      expect(steps[0].type).toBe('init');
      expect(steps[0].array).toEqual([170, 45, 75, 90]);

      // Should have complete step at the end
      const lastStep = steps[steps.length - 1];
      expect(lastStep.type).toBe('complete');
      expect(lastStep.array).toEqual([45, 75, 90, 170]);
    });

    it('should generate correct steps for single digit numbers', () => {
      const input = [3, 1, 4, 1, 5, 9, 2, 6];
      const steps = generateRadixSortSteps(input, 10);

      const lastStep = steps[steps.length - 1];
      expect(lastStep.type).toBe('complete');
      expect(lastStep.array).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it('should handle array with zeros', () => {
      const input = [100, 0, 50, 0, 25];
      const steps = generateRadixSortSteps(input, 10);

      const lastStep = steps[steps.length - 1];
      expect(lastStep.array).toEqual([0, 0, 25, 50, 100]);
    });

    it('should have distribution and collection steps', () => {
      const input = [42, 23];
      const steps = generateRadixSortSteps(input, 10);

      const distributeSteps = steps.filter(s => s.type === 'distribute');
      const collectSteps = steps.filter(s => s.type === 'collect');

      expect(distributeSteps.length).toBeGreaterThan(0);
      expect(collectSteps.length).toBeGreaterThan(0);
    });

    it('should track current digit position correctly', () => {
      const input = [123, 456];
      const steps = generateRadixSortSteps(input, 10);

      const selectDigitSteps = steps.filter(s => s.type === 'select_digit');
      
      // Should have 3 digit positions (1, 2, 3 for a 3-digit max number)
      expect(selectDigitSteps.length).toBe(3);
      expect(selectDigitSteps[0].currentDigitFactor).toBe(1);
      expect(selectDigitSteps[1].currentDigitFactor).toBe(10);
      expect(selectDigitSteps[2].currentDigitFactor).toBe(100);
    });

    it('should preserve original array', () => {
      const input = [5, 3, 8, 1];
      const originalCopy = [...input];
      
      generateRadixSortSteps(input, 10);

      expect(input).toEqual(originalCopy);
    });

    it('should have valid buckets in each step', () => {
      const input = [91, 46, 85, 15];
      const steps = generateRadixSortSteps(input, 10);

      steps.forEach(step => {
        expect(step.buckets).toBeDefined();
        expect(step.buckets.length).toBe(10);
        step.buckets.forEach((bucket, i) => {
          expect(bucket.digit).toBe(i);
          expect(Array.isArray(bucket.elements)).toBe(true);
        });
      });
    });

    it('should highlight correct bucket during distribution', () => {
      const input = [25, 37];
      const steps = generateRadixSortSteps(input, 10);

      const distributeSteps = steps.filter(s => s.type === 'distribute');
      
      // First distribution: 25 goes to bucket 5 (digit = 25 % 10 = 5)
      expect(distributeSteps[0].highlightedBucket).toBe(5);
      expect(distributeSteps[0].currentElement).toBe(25);
      
      // Second distribution: 37 goes to bucket 7 (digit = 37 % 10 = 7)
      expect(distributeSteps[1].highlightedBucket).toBe(7);
      expect(distributeSteps[1].currentElement).toBe(37);
    });

    it('should work with base 2', () => {
      const input = [5, 3, 7, 1]; // binary: 101, 011, 111, 001
      const steps = generateRadixSortSteps(input, 2);

      const lastStep = steps[steps.length - 1];
      expect(lastStep.array).toEqual([1, 3, 5, 7]);
    });

    it('should include pseudocode line numbers', () => {
      const input = [42, 17];
      const steps = generateRadixSortSteps(input, 10);

      steps.forEach(step => {
        expect(step.pseudocodeLine).toBeDefined();
        expect(step.pseudocodeLine).toBeGreaterThan(0);
      });
    });

    it('should include messages for each step', () => {
      const input = [99, 11];
      const steps = generateRadixSortSteps(input, 10);

      steps.forEach(step => {
        expect(step.message).toBeDefined();
        expect(step.message.length).toBeGreaterThan(0);
      });
    });
  });
});
