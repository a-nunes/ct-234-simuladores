import { GenerateStepsUseCase } from '@features/kmp/domain/usecases/GenerateSteps.usecase';
import { InvalidInputError } from '@features/kmp/domain/errors/InvalidInputError';
import { isPreprocessStep, isSearchStep } from '@features/kmp/domain/entities/KMPStep';

describe('GenerateStepsUseCase', () => {
  let useCase: GenerateStepsUseCase;

  beforeEach(() => {
    useCase = new GenerateStepsUseCase();
  });

  describe('execute', () => {
    it('should generate steps and failure table for valid input', () => {
      const result = useCase.execute({
        text: 'abacaabaccabacabaabb',
        pattern: 'abacab'
      });

      expect(result.steps).toBeDefined();
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.failureTable).toBeDefined();
      expect(result.failureTable.length).toBe(6); // pattern length
    });

    it('should include both preprocess and search steps', () => {
      const result = useCase.execute({
        text: 'abcdef',
        pattern: 'abc'
      });

      const preprocessSteps = result.steps.filter(s => isPreprocessStep(s));
      const searchSteps = result.steps.filter(s => isSearchStep(s));

      expect(preprocessSteps.length).toBeGreaterThan(0);
      expect(searchSteps.length).toBeGreaterThan(0);
    });

    it('should generate correct failure table', () => {
      const result = useCase.execute({
        text: 'some text',
        pattern: 'abacab'
      });

      expect(result.failureTable).toEqual([0, 0, 1, 0, 1, 2]);
    });

    it('should throw InvalidInputError for empty text', () => {
      expect(() => useCase.execute({
        text: '',
        pattern: 'abc'
      })).toThrow(InvalidInputError);
    });

    it('should throw InvalidInputError for empty pattern', () => {
      expect(() => useCase.execute({
        text: 'some text',
        pattern: ''
      })).toThrow(InvalidInputError);
    });

    it('should throw InvalidInputError when pattern is longer than text', () => {
      expect(() => useCase.execute({
        text: 'hi',
        pattern: 'hello'
      })).toThrow(InvalidInputError);
    });

    it('should find pattern and mark found in last step', () => {
      const result = useCase.execute({
        text: 'abacaabaccabacabaabb',
        pattern: 'abacab'
      });

      const lastStep = result.steps[result.steps.length - 1];
      expect(isSearchStep(lastStep)).toBe(true);
      if (isSearchStep(lastStep)) {
        expect(lastStep.found).toBe(true);
      }
    });

    it('should handle pattern not found scenario', () => {
      const result = useCase.execute({
        text: 'abcdefghij',
        pattern: 'xyz'
      });

      const lastStep = result.steps[result.steps.length - 1];
      expect(isSearchStep(lastStep)).toBe(true);
      if (isSearchStep(lastStep)) {
        expect(lastStep.found).toBe(false);
      }
    });

    it('should handle pattern equal to text', () => {
      const result = useCase.execute({
        text: 'abc',
        pattern: 'abc'
      });

      expect(result.steps.length).toBeGreaterThan(0);
      const lastStep = result.steps[result.steps.length - 1];
      if (isSearchStep(lastStep)) {
        expect(lastStep.found).toBe(true);
      }
    });
  });
});
