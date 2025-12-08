import { validateArray, parseArrayInput, generateRandomArray } from '../../../data/validators/ArrayValidator';
import { InvalidArrayError } from '../../../domain/errors/InvalidArrayError';

describe('ArrayValidator', () => {
  describe('validateArray', () => {
    it('should accept valid array within bounds', () => {
      const array = [5, 3, 8, 1, 9, 2];
      expect(() => validateArray(array)).not.toThrow();
    });

    it('should accept array with 2 elements (minimum)', () => {
      const array = [1, 2];
      expect(() => validateArray(array)).not.toThrow();
    });

    it('should accept array with 15 elements (maximum)', () => {
      const array = Array.from({ length: 15 }, (_, i) => i + 1);
      expect(() => validateArray(array)).not.toThrow();
    });

    it('should accept array with zeros', () => {
      const array = [0, 0, 0, 5, 0];
      expect(() => validateArray(array)).not.toThrow();
    });

    it('should accept array with maximum value (999)', () => {
      const array = [1, 999, 500, 999];
      expect(() => validateArray(array)).not.toThrow();
    });

    it('should reject array with less than 2 elements', () => {
      const array = [5];
      expect(() => validateArray(array)).toThrow(InvalidArrayError);
    });

    it('should reject empty array', () => {
      const array: number[] = [];
      expect(() => validateArray(array)).toThrow(InvalidArrayError);
    });

    it('should reject array with more than 15 elements', () => {
      const array = Array.from({ length: 16 }, (_, i) => i + 1);
      expect(() => validateArray(array)).toThrow(InvalidArrayError);
    });

    it('should reject array with negative values', () => {
      const array = [5, -3, 8, 1];
      expect(() => validateArray(array)).toThrow(InvalidArrayError);
    });

    it('should reject array with values greater than 999', () => {
      const array = [5, 3, 1000, 1];
      expect(() => validateArray(array)).toThrow(InvalidArrayError);
    });

    it('should reject array with non-integer values', () => {
      const array = [5, 3.5, 8, 1];
      expect(() => validateArray(array)).toThrow(InvalidArrayError);
    });
  });

  describe('parseArrayInput', () => {
    it('should parse comma-separated string', () => {
      const result = parseArrayInput('5, 3, 8, 1, 9');
      expect(result).toEqual([5, 3, 8, 1, 9]);
    });

    it('should parse space-separated string', () => {
      const result = parseArrayInput('5 3 8 1 9');
      expect(result).toEqual([5, 3, 8, 1, 9]);
    });

    it('should parse mixed separators', () => {
      const result = parseArrayInput('5, 3  8,  1, 9');
      expect(result).toEqual([5, 3, 8, 1, 9]);
    });

    it('should trim whitespace', () => {
      const result = parseArrayInput('  5, 3, 8  ');
      expect(result).toEqual([5, 3, 8]);
    });

    it('should handle single spaces between numbers', () => {
      const result = parseArrayInput('1 2 3 4 5');
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should throw for invalid numeric input', () => {
      expect(() => parseArrayInput('5, abc, 8')).toThrow(InvalidArrayError);
    });

    it('should throw for empty string', () => {
      expect(() => parseArrayInput('')).toThrow(InvalidArrayError);
    });

    it('should throw for string with only separators', () => {
      expect(() => parseArrayInput(',  ,  ,')).toThrow(InvalidArrayError);
    });
  });

  describe('generateRandomArray', () => {
    it('should generate array with specified length', () => {
      const result = generateRandomArray(10);
      expect(result).toHaveLength(10);
    });

    it('should generate array with default length when not specified', () => {
      const result = generateRandomArray();
      expect(result.length).toBeGreaterThanOrEqual(5);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should generate values within valid range', () => {
      const result = generateRandomArray(15);
      result.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(99);
      });
    });

    it('should generate integer values', () => {
      const result = generateRandomArray(15);
      result.forEach(value => {
        expect(Number.isInteger(value)).toBe(true);
      });
    });

    it('should generate different arrays on multiple calls (probabilistic)', () => {
      const results = Array.from({ length: 5 }, () => generateRandomArray(10));
      const uniqueArrays = new Set(results.map(arr => JSON.stringify(arr)));
      // With 10 random numbers from 1-99, getting same array twice is extremely unlikely
      expect(uniqueArrays.size).toBeGreaterThan(1);
    });
  });
});
