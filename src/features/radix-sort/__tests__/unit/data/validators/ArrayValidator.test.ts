import { validateArray, parseArrayInput } from '@features/radix-sort/data/validators/ArrayValidator';
import { InvalidArrayError } from '@features/radix-sort/domain/errors/InvalidArrayError';

describe('ArrayValidator', () => {
  describe('validateArray', () => {
    it('should accept valid array of positive integers', () => {
      expect(() => validateArray([1, 2, 3, 4, 5])).not.toThrow();
    });

    it('should accept array with zeros', () => {
      expect(() => validateArray([0, 1, 0, 2])).not.toThrow();
    });

    it('should throw for empty array', () => {
      expect(() => validateArray([])).toThrow(InvalidArrayError);
      expect(() => validateArray([])).toThrow('O vetor não pode estar vazio');
    });

    it('should throw for single element array', () => {
      expect(() => validateArray([42])).toThrow(InvalidArrayError);
      expect(() => validateArray([42])).toThrow('O vetor deve ter pelo menos 2 elementos');
    });

    it('should throw for array with more than 15 elements', () => {
      const largeArray = Array.from({ length: 16 }, (_, i) => i);
      expect(() => validateArray(largeArray)).toThrow(InvalidArrayError);
      expect(() => validateArray(largeArray)).toThrow('O vetor deve ter no máximo 15 elementos');
    });

    it('should throw for non-integer values', () => {
      expect(() => validateArray([1.5, 2, 3])).toThrow(InvalidArrayError);
      expect(() => validateArray([1.5, 2, 3])).toThrow('números inteiros');
    });

    it('should throw for negative values', () => {
      expect(() => validateArray([-1, 2, 3])).toThrow(InvalidArrayError);
      expect(() => validateArray([-1, 2, 3])).toThrow('não-negativos');
    });

    it('should throw for values greater than 9999', () => {
      expect(() => validateArray([10000, 1, 2])).toThrow(InvalidArrayError);
      expect(() => validateArray([10000, 1, 2])).toThrow('entre 0 e 9999');
    });

    it('should accept boundary values (0 and 9999)', () => {
      expect(() => validateArray([0, 9999])).not.toThrow();
    });
  });

  describe('parseArrayInput', () => {
    it('should parse comma-separated values', () => {
      expect(parseArrayInput('1, 2, 3')).toEqual([1, 2, 3]);
    });

    it('should parse space-separated values', () => {
      expect(parseArrayInput('1 2 3')).toEqual([1, 2, 3]);
    });

    it('should parse mixed separators', () => {
      expect(parseArrayInput('1, 2 3,4')).toEqual([1, 2, 3, 4]);
    });

    it('should handle brackets', () => {
      expect(parseArrayInput('[1, 2, 3]')).toEqual([1, 2, 3]);
    });

    it('should handle extra whitespace', () => {
      expect(parseArrayInput('  1 ,  2  , 3  ')).toEqual([1, 2, 3]);
    });

    it('should throw for invalid values', () => {
      expect(() => parseArrayInput('1, abc, 3')).toThrow(InvalidArrayError);
      expect(() => parseArrayInput('1, abc, 3')).toThrow('Valor inválido');
    });

    it('should parse larger numbers', () => {
      expect(parseArrayInput('170, 45, 75, 90, 802')).toEqual([170, 45, 75, 90, 802]);
    });
  });
});
