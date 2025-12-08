import { generateInsertionSortSteps } from '@features/elementary-sort/data/stepGenerators/InsertionSortStepGenerator';

describe('InsertionSortStepGenerator', () => {
  it('should generate initial step', () => {
    const arr = [3, 1, 2];
    const steps = generateInsertionSortSteps(arr);
    
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].type).toBe('init');
    expect(steps[0].array).toEqual([3, 1, 2]);
    // First element is already "sorted"
    expect(steps[0].sortedIndices).toContain(0);
  });

  it('should correctly sort a simple array', () => {
    const arr = [3, 1, 2];
    const steps = generateInsertionSortSteps(arr);
    
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('complete');
    expect(lastStep.array).toEqual([1, 2, 3]);
  });

  it('should handle already sorted array', () => {
    const arr = [1, 2, 3, 4, 5];
    const steps = generateInsertionSortSteps(arr);
    
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
    // Should have no shift steps for already sorted array
    const shiftSteps = steps.filter(s => s.type === 'shift');
    expect(shiftSteps.length).toBe(0);
  });

  it('should handle reverse sorted array (worst case)', () => {
    const arr = [5, 4, 3, 2, 1];
    const steps = generateInsertionSortSteps(arr);
    
    const lastStep = steps[steps.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
    // Should have many shift steps for worst case
    const shiftSteps = steps.filter(s => s.type === 'shift');
    expect(shiftSteps.length).toBeGreaterThan(0);
  });

  it('should generate shift steps', () => {
    const arr = [2, 1];
    const steps = generateInsertionSortSteps(arr);
    
    const shiftSteps = steps.filter(s => s.type === 'shift');
    expect(shiftSteps.length).toBeGreaterThan(0);
  });

  it('should generate insert steps', () => {
    const arr = [2, 1];
    const steps = generateInsertionSortSteps(arr);
    
    const insertSteps = steps.filter(s => s.type === 'insert');
    expect(insertSteps.length).toBeGreaterThan(0);
    expect(insertSteps[0].insertValue).toBeDefined();
    expect(insertSteps[0].insertPosition).toBeDefined();
  });

  it('should track the value being inserted (x)', () => {
    const arr = [3, 1, 2];
    const steps = generateInsertionSortSteps(arr);
    
    // Find steps where we're inserting 1
    const stepsWithInsertValue = steps.filter(s => s.insertValue !== undefined);
    expect(stepsWithInsertValue.length).toBeGreaterThan(0);
  });

  it('should include pivot pointer for the element being inserted', () => {
    const arr = [3, 1, 2];
    const steps = generateInsertionSortSteps(arr);
    
    const stepsWithPivot = steps.filter(s => 
      s.pointers.some(p => p.type === 'pivot')
    );
    expect(stepsWithPivot.length).toBeGreaterThan(0);
  });

  it('should mark elements as sorted incrementally', () => {
    const arr = [3, 2, 1];
    const steps = generateInsertionSortSteps(arr);
    
    const markSortedSteps = steps.filter(s => s.type === 'mark_sorted');
    
    // Each iteration adds one more element to sorted portion
    for (let i = 0; i < markSortedSteps.length; i++) {
      expect(markSortedSteps[i].sortedIndices.length).toBe(i + 2); // starts with 1, adds 1 each time
    }
  });
});
