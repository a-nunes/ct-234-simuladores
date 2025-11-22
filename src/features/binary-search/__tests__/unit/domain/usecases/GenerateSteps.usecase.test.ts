import { GenerateStepsUseCase } from '@features/binary-search/domain/usecases/GenerateSteps.usecase';
import { BinarySearchConfig } from '@features/binary-search/domain/entities/BinarySearchConfig';
import { InvalidArrayError, InvalidSearchValueError } from '@features/binary-search/domain/errors/InvalidArrayError';

describe('GenerateStepsUseCase', () => {
  let useCase: GenerateStepsUseCase;

  beforeEach(() => {
    useCase = new GenerateStepsUseCase();
  });

  describe('execute', () => {
    it('should generate steps correctly for valid array', () => {
      const config: BinarySearchConfig = {
        array: [2, 5, 8, 12, 16, 23],
        searchValue: 23
      };

      const steps = useCase.execute(config);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
    });

    it('should throw InvalidArrayError for empty array', () => {
      const config: BinarySearchConfig = {
        array: [],
        searchValue: 5
      };

      expect(() => useCase.execute(config)).toThrow(InvalidArrayError);
    });

    it('should throw InvalidArrayError for unsorted array', () => {
      const config: BinarySearchConfig = {
        array: [5, 2, 8, 12],
        searchValue: 5
      };

      expect(() => useCase.execute(config)).toThrow(InvalidArrayError);
    });

    it('should throw InvalidSearchValueError for NaN search value', () => {
      const config: BinarySearchConfig = {
        array: [2, 5, 8, 12],
        searchValue: NaN
      };

      expect(() => useCase.execute(config)).toThrow(InvalidSearchValueError);
    });

    it('should generate steps for value that exists', () => {
      const config: BinarySearchConfig = {
        array: [2, 5, 8, 12, 16, 23],
        searchValue: 8
      };

      const steps = useCase.execute(config);
      const foundStep = steps.find(step => step.type === 'found');

      expect(foundStep).toBeDefined();
    });

    it('should generate steps for value that does not exist', () => {
      const config: BinarySearchConfig = {
        array: [2, 5, 8, 12, 16, 23],
        searchValue: 99
      };

      const steps = useCase.execute(config);
      const notFoundStep = steps.find(step => step.type === 'not_found');

      expect(notFoundStep).toBeDefined();
    });
  });
});

