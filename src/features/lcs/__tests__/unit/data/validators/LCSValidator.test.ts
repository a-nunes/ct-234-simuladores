import { validateLCSConfig } from '@features/lcs/data/validators/LCSValidator';
import { InvalidLCSStringError } from '@features/lcs/domain/errors/InvalidLCSInputError';
import { LCSConfig } from '@features/lcs/domain/entities/LCSConfig';

describe('LCSValidator', () => {
  describe('validateLCSConfig', () => {
    it('should accept valid config with non-empty strings', () => {
      const config: LCSConfig = {
        stringX: 'ABCBDAB',
        stringY: 'BDCABA'
      };
      expect(() => validateLCSConfig(config)).not.toThrow();
    });

    it('should reject null config', () => {
      expect(() => validateLCSConfig(null as any)).toThrow(InvalidLCSStringError);
      expect(() => validateLCSConfig(null as any)).toThrow('Configuração LCS é obrigatória');
    });

    it('should reject undefined config', () => {
      expect(() => validateLCSConfig(undefined as any)).toThrow(InvalidLCSStringError);
    });

    it('should reject empty stringX', () => {
      const config: LCSConfig = {
        stringX: '',
        stringY: 'BDCABA'
      };
      expect(() => validateLCSConfig(config)).toThrow(InvalidLCSStringError);
      expect(() => validateLCSConfig(config)).toThrow('String X não pode ser vazia');
    });

    it('should reject empty stringY', () => {
      const config: LCSConfig = {
        stringX: 'ABCBDAB',
        stringY: ''
      };
      expect(() => validateLCSConfig(config)).toThrow(InvalidLCSStringError);
      expect(() => validateLCSConfig(config)).toThrow('String Y não pode ser vazia');
    });

    it('should reject stringX with only spaces', () => {
      const config: LCSConfig = {
        stringX: '   ',
        stringY: 'BDCABA'
      };
      expect(() => validateLCSConfig(config)).toThrow(InvalidLCSStringError);
      expect(() => validateLCSConfig(config)).toThrow('String X não pode ser vazia');
    });

    it('should reject stringY with only spaces', () => {
      const config: LCSConfig = {
        stringX: 'ABCBDAB',
        stringY: '   '
      };
      expect(() => validateLCSConfig(config)).toThrow(InvalidLCSStringError);
      expect(() => validateLCSConfig(config)).toThrow('String Y não pode ser vazia');
    });

    it('should accept strings with spaces at edges (trimmed)', () => {
      const config: LCSConfig = {
        stringX: '  ABC  ',
        stringY: '  BDC  '
      };
      expect(() => validateLCSConfig(config)).not.toThrow();
    });

    it('should reject non-string stringX', () => {
      const config = {
        stringX: 123 as any,
        stringY: 'BDCABA'
      };
      expect(() => validateLCSConfig(config)).toThrow(InvalidLCSStringError);
      expect(() => validateLCSConfig(config)).toThrow('String X deve ser um texto válido');
    });

    it('should reject non-string stringY', () => {
      const config = {
        stringX: 'ABCBDAB',
        stringY: 123 as any
      };
      expect(() => validateLCSConfig(config)).toThrow(InvalidLCSStringError);
      expect(() => validateLCSConfig(config)).toThrow('String Y deve ser um texto válido');
    });

    it('should accept single character strings', () => {
      const config: LCSConfig = {
        stringX: 'A',
        stringY: 'B'
      };
      expect(() => validateLCSConfig(config)).not.toThrow();
    });

    it('should accept strings with special characters', () => {
      const config: LCSConfig = {
        stringX: 'A!@#B',
        stringY: 'B$%^C'
      };
      expect(() => validateLCSConfig(config)).not.toThrow();
    });
  });
});

