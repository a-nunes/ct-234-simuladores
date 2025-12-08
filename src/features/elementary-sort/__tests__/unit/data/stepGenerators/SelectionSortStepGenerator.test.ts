import { generateSelectionSortSteps } from '@features/elementary-sort/data/stepGenerators/SelectionSortStepGenerator';

describe('SelectionSortStepGenerator', () => {
  it('should generate initial step', () => {
    const arr = [3, 1, 2];
    const steps = generateSelectionSortSteps(arr);
    
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].type).toBe('init');
    expect(steps[0].array).toEqual([3, 1, 2]);
  });

  it('should correctly sort a simple array', () => {
    const arr = [3, 1, 2];
    const steps = generateSelectionSortSteps(arr);
    
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('complete');
    expect(lastStep.array).toEqual([1, 2, 3]);
  });

  it('should handle already sorted array', () => {
    const arr = [1, 2, 3, 4, 5];
    const steps = generateSelectionSortSteps(arr);
    
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
    // Should not have swap steps when min is already in place
    const swapSteps = steps.filter(s => s.type === 'swap');
    expect(swapSteps.length).toBe(0);
  });

  it('should handle reverse sorted array', () => {
    const arr = [5, 4, 3, 2, 1];
    const steps = generateSelectionSortSteps(arr);
    
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
  });

  it('should generate update_min steps when finding new minimum', () => {
    const arr = [3, 1, 2];
    const steps = generateSelectionSortSteps(arr);
    
    const updateMinSteps = steps.filter(s => s.type === 'update_min');
    expect(updateMinSteps.length).toBeGreaterThan(0);
  });

  it('should generate compare steps', () => {
    const arr = [2, 1];
    const steps = generateSelectionSortSteps(arr);
    
    const compareSteps = steps.filter(s => s.type === 'compare');
    expect(compareSteps.length).toBeGreaterThan(0);
  });

  it('should track sorted indices correctly', () => {
    const arr = [3, 2, 1];
    const steps = generateSelectionSortSteps(arr);
    
    const markSortedSteps = steps.filter(s => s.type === 'mark_sorted');
    expect(markSortedSteps.length).toBe(2); // n-1 iterations
    
    // First position should be sorted first
    expect(markSortedSteps[0].sortedIndices).toContain(0);
  });

  it('should include min pointer', () => {
    const arr = [3, 1, 2];
    const steps = generateSelectionSortSteps(arr);
    
    const stepsWithMin = steps.filter(s => 
      s.pointers.some(p => p.label === 'min')
    );
    expect(stepsWithMin.length).toBeGreaterThan(0);
  });
});
