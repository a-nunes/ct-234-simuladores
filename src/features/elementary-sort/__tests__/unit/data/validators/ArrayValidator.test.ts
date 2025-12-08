import { validateArray, parseArrayInput } from '@features/elementary-sort/data/validators/ArrayValidator';
import { InvalidArrayError } from '@features/elementary-sort/domain/errors/InvalidArrayError';

describe('ArrayValidator', () => {
  describe('validateArray', () => {
    it('should accept valid array', () => {
      expect(() => validateArray([1, 2, 3, 4, 5])).not.toThrow();
    });

    it('should reject empty array', () => {
      expect(() => validateArray([])).toThrow(InvalidArrayError);
      expect(() => validateArray([])).toThrow('não pode estar vazio');
    });

    it('should reject single element array', () => {
      expect(() => validateArray([1])).toThrow(InvalidArrayError);
      expect(() => validateArray([1])).toThrow('pelo menos 2 elementos');
    });

    it('should reject array with more than 20 elements', () => {
      const largeArray = Array.from({ length: 21 }, (_, i) => i);
      expect(() => validateArray(largeArray)).toThrow(InvalidArrayError);
      expect(() => validateArray(largeArray)).toThrow('no máximo 20 elementos');
    });

    it('should reject non-integer values', () => {
      expect(() => validateArray([1, 2.5, 3])).toThrow(InvalidArrayError);
      expect(() => validateArray([1, 2.5, 3])).toThrow('números inteiros');
    });

    it('should reject values out of range', () => {
      expect(() => validateArray([1, 1000, 3])).toThrow(InvalidArrayError);
      expect(() => validateArray([-1, 2, 3])).toThrow(InvalidArrayError);
    });

    it('should accept edge case values', () => {
      expect(() => validateArray([0, 999])).not.toThrow();
    });
  });

  describe('parseArrayInput', () => {
    it('should parse comma-separated values', () => {
      expect(parseArrayInput('1, 2, 3')).toEqual([1, 2, 3]);
    });

    it('should parse space-separated values', () => {
      expect(parseArrayInput('1 2 3')).toEqual([1, 2, 3]);
    });

    it('should parse values with brackets', () => {
      expect(parseArrayInput('[1, 2, 3]')).toEqual([1, 2, 3]);
    });

    it('should handle mixed separators', () => {
      expect(parseArrayInput('1, 2  3')).toEqual([1, 2, 3]);
    });

    it('should handle extra whitespace', () => {
      expect(parseArrayInput('  1,  2,  3  ')).toEqual([1, 2, 3]);
    });

    it('should throw on invalid number', () => {
      expect(() => parseArrayInput('1, abc, 3')).toThrow(InvalidArrayError);
      expect(() => parseArrayInput('1, abc, 3')).toThrow('Valor inválido');
    });
  });
});
