import { generateBubbleSortSteps } from '@features/elementary-sort/data/stepGenerators/BubbleSortStepGenerator';

describe('BubbleSortStepGenerator', () => {
  it('should generate initial step', () => {
    const arr = [3, 1, 2];
    const steps = generateBubbleSortSteps(arr);
    
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].type).toBe('init');
    expect(steps[0].array).toEqual([3, 1, 2]);
  });

  it('should correctly sort a simple array', () => {
    const arr = [3, 1, 2];
    const steps = generateBubbleSortSteps(arr);
    
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('complete');
    expect(lastStep.array).toEqual([1, 2, 3]);
  });

  it('should handle already sorted array', () => {
    const arr = [1, 2, 3, 4, 5];
    const steps = generateBubbleSortSteps(arr);
    
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
    // Should have fewer swap steps for already sorted array
    const swapSteps = steps.filter(s => s.type === 'swap');
    expect(swapSteps.length).toBe(0);
  });

  it('should handle reverse sorted array (worst case)', () => {
    const arr = [5, 4, 3, 2, 1];
    const steps = generateBubbleSortSteps(arr);
    
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
    // Should have many swap steps for worst case
    const swapSteps = steps.filter(s => s.type === 'swap');
    expect(swapSteps.length).toBeGreaterThan(0);
  });

  it('should generate compare steps', () => {
    const arr = [2, 1];
    const steps = generateBubbleSortSteps(arr);
    
    const compareSteps = steps.filter(s => s.type === 'compare');
    expect(compareSteps.length).toBeGreaterThan(0);
    expect(compareSteps[0].comparing).toEqual([0, 1]);
  });

  it('should track sorted indices correctly', () => {
    const arr = [3, 2, 1];
    const steps = generateBubbleSortSteps(arr);
    
    const markSortedSteps = steps.filter(s => s.type === 'mark_sorted');
    expect(markSortedSteps.length).toBe(2); // n-1 passes
    
    // After first pass, last element should be sorted
    expect(markSortedSteps[0].sortedIndices).toContain(2);
  });

  it('should include variables in steps', () => {
    const arr = [2, 1];
    const steps = generateBubbleSortSteps(arr);
    
    const compareStep = steps.find(s => s.type === 'compare');
    expect(compareStep?.variables).toBeDefined();
    expect(compareStep?.variables.i).toBeDefined();
    expect(compareStep?.variables.j).toBeDefined();
  });

  it('should include pseudocode line references', () => {
    const arr = [2, 1];
    const steps = generateBubbleSortSteps(arr);
    
    steps.forEach(step => {
      expect(step.pseudocodeLine).toBeDefined();
      expect(step.pseudocodeLine).toBeGreaterThanOrEqual(1);
    });
  });
});
