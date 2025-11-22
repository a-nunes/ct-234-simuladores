import {
  validateArray,
  validateSearchValue,
  parseArray,
  parseSearchValue
} from '@features/binary-search/data/validators/ArrayValidator';
import { InvalidArrayError, InvalidSearchValueError } from '@features/binary-search/domain/errors/InvalidArrayError';

describe('ArrayValidator', () => {
  describe('validateArray', () => {
    it('should accept valid sorted array', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(() => validateArray(arr)).not.toThrow();
    });

    it('should reject empty array', () => {
      const arr: number[] = [];
      expect(() => validateArray(arr)).toThrow(InvalidArrayError);
      expect(() => validateArray(arr)).toThrow('Array não pode estar vazio!');
    });

    it('should reject unsorted array', () => {
      const arr = [1, 3, 2, 4, 5];
      expect(() => validateArray(arr)).toThrow(InvalidArrayError);
      expect(() => validateArray(arr)).toThrow('Array deve estar ordenado');
    });

    it('should accept array with single element', () => {
      const arr = [5];
      expect(() => validateArray(arr)).not.toThrow();
    });

    it('should accept array with duplicate values', () => {
      const arr = [1, 2, 2, 3, 3, 4];
      expect(() => validateArray(arr)).not.toThrow();
    });
  });

  describe('validateSearchValue', () => {
    it('should accept valid number', () => {
      expect(() => validateSearchValue(5)).not.toThrow();
      expect(() => validateSearchValue(0)).not.toThrow();
      expect(() => validateSearchValue(-5)).not.toThrow();
    });

    it('should reject NaN', () => {
      expect(() => validateSearchValue(NaN)).toThrow(InvalidSearchValueError);
    });
  });

  describe('parseArray', () => {
    it('should parse valid comma-separated string', () => {
      const result = parseArray('1,2,3,4,5');
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle spaces in input', () => {
      const result = parseArray('1, 2, 3, 4, 5');
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should filter out invalid numbers', () => {
      const result = parseArray('1,abc,2,3');
      expect(result).toEqual([1, 2, 3]);
    });

    it('should throw error for empty result', () => {
      expect(() => parseArray('abc,def')).toThrow(InvalidArrayError);
      expect(() => parseArray('')).toThrow(InvalidArrayError);
    });
  });

  describe('parseSearchValue', () => {
    it('should parse valid number string', () => {
      expect(parseSearchValue('5')).toBe(5);
      expect(parseSearchValue('0')).toBe(0);
      expect(parseSearchValue('-5')).toBe(-5);
    });

    it('should handle spaces', () => {
      expect(parseSearchValue('  5  ')).toBe(5);
    });

    it('should throw error for invalid input', () => {
      expect(() => parseSearchValue('abc')).toThrow(InvalidSearchValueError);
      expect(() => parseSearchValue('')).toThrow(InvalidSearchValueError);
    });
  });
});

