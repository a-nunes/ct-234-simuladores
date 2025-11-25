import { validateInput } from '@features/boyer-moore/data/validators/InputValidator';
import { InvalidInputError } from '@features/boyer-moore/domain/errors/InvalidInputError';

describe('InputValidator', () => {
  describe('validateInput', () => {
    it('should not throw for valid input', () => {
      expect(() => validateInput({
        text: 'some text',
        pattern: 'text'
      })).not.toThrow();
    });

    it('should throw InvalidInputError for empty text', () => {
      expect(() => validateInput({
        text: '',
        pattern: 'pattern'
      })).toThrow(InvalidInputError);
    });

    it('should throw InvalidInputError for empty pattern', () => {
      expect(() => validateInput({
        text: 'some text',
        pattern: ''
      })).toThrow(InvalidInputError);
    });

    it('should throw InvalidInputError when pattern is longer than text', () => {
      expect(() => validateInput({
        text: 'hi',
        pattern: 'hello'
      })).toThrow(InvalidInputError);
    });
  });
});
