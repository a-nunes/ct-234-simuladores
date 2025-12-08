import { GenerateStepsUseCase } from '@features/lcs/domain/usecases/GenerateSteps.usecase';
import { LCSConfig } from '@features/lcs/domain/entities/LCSConfig';
import { InvalidLCSStringError } from '@features/lcs/domain/errors/InvalidLCSInputError';

describe('GenerateStepsUseCase', () => {
  let useCase: GenerateStepsUseCase;

  beforeEach(() => {
    useCase = new GenerateStepsUseCase();
  });

  describe('execute', () => {
    it('should generate steps correctly for valid config', () => {
      const config: LCSConfig = {
        stringX: 'ABCBDAB',
        stringY: 'BDCABA'
      };

      const steps = useCase.execute(config);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
    });

    it('should throw InvalidLCSStringError for empty stringX', () => {
      const config: LCSConfig = {
        stringX: '',
        stringY: 'BDCABA'
      };

      expect(() => useCase.execute(config)).toThrow(InvalidLCSStringError);
    });

    it('should throw InvalidLCSStringError for empty stringY', () => {
      const config: LCSConfig = {
        stringX: 'ABCBDAB',
        stringY: ''
      };

      expect(() => useCase.execute(config)).toThrow(InvalidLCSStringError);
    });

    it('should throw InvalidLCSStringError for strings with only spaces', () => {
      const config: LCSConfig = {
        stringX: '   ',
        stringY: 'BDCABA'
      };

      expect(() => useCase.execute(config)).toThrow(InvalidLCSStringError);
    });

    it('should generate complete step with LCS result', () => {
      const config: LCSConfig = {
        stringX: 'ABC',
        stringY: 'ABC'
      };

      const steps = useCase.execute(config);
      const completeStep = steps[steps.length - 1];

      expect(completeStep.type).toBe('complete');
      expect(completeStep.lcs).toBe('ABC');
    });

    it('should generate traceback steps', () => {
      const config: LCSConfig = {
        stringX: 'ABCBDAB',
        stringY: 'BDCABA'
      };

      const steps = useCase.execute(config);
      const tracebackSteps = steps.filter(step => step.type === 'traceback_step');

      expect(tracebackSteps.length).toBeGreaterThan(0);
    });

    it('should generate match steps when characters match', () => {
      const config: LCSConfig = {
        stringX: 'AB',
        stringY: 'AB'
      };

      const steps = useCase.execute(config);
      const matchSteps = steps.filter(step => step.type === 'match');

      expect(matchSteps.length).toBeGreaterThan(0);
    });
  });
});



