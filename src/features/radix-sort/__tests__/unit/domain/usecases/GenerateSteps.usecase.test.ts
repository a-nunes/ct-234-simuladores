import { GenerateStepsUseCase } from '@features/radix-sort/domain/usecases/GenerateSteps.usecase';
import { InvalidArrayError } from '@features/radix-sort/domain/errors/InvalidArrayError';

describe('GenerateStepsUseCase', () => {
  let useCase: GenerateStepsUseCase;

  beforeEach(() => {
    useCase = new GenerateStepsUseCase();
  });

  describe('execute', () => {
    it('should generate steps for valid config', () => {
      const steps = useCase.execute({
        array: [170, 45, 75, 90],
        base: 10
      });

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[steps.length - 1].type).toBe('complete');
    });

    it('should throw for invalid array', () => {
      expect(() => useCase.execute({
        array: [],
        base: 10
      })).toThrow(InvalidArrayError);
    });

    it('should throw for negative numbers', () => {
      expect(() => useCase.execute({
        array: [-1, 2, 3],
        base: 10
      })).toThrow(InvalidArrayError);
    });

    it('should produce sorted result', () => {
      const steps = useCase.execute({
        array: [802, 24, 2, 66, 170, 45, 75, 90],
        base: 10
      });

      const lastStep = steps[steps.length - 1];
      expect(lastStep.array).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
    });

    it('should work with different bases', () => {
      const stepsBase2 = useCase.execute({
        array: [5, 3, 7, 1],
        base: 2
      });

      const lastStep = stepsBase2[stepsBase2.length - 1];
      expect(lastStep.array).toEqual([1, 3, 5, 7]);
    });
  });
});
