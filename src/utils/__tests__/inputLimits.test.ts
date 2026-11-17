import { clampInt, clampText } from '../inputLimits';

describe('clampInt', () => {
  it.each([
    ['5', 1, 20, 5],
    ['0', 1, 20, 1],
    ['-7', 1, 20, 1],
    ['5000', 1, 20, 20],
    ['1e9', 1, 20, 1], // parseInt('1e9') === 1
    ['3.9', 1, 20, 3],
    [7.9, 1, 20, 7],
  ] as const)('clampInt(%p, %p, %p) === %p', (raw, min, max, expected) => {
    expect(clampInt(raw, min, max)).toBe(expected);
  });

  it.each(['', 'abc', 'NaN', 'Infinity'])('usa o fallback para entrada não numérica %p', (raw) => {
    expect(clampInt(raw, 1, 20)).toBe(1);
    expect(clampInt(raw, 1, 20, 4)).toBe(4);
  });

  it('trata Infinity numérico como inválido', () => {
    expect(clampInt(Infinity, 0, 10, 3)).toBe(3);
  });
});

describe('clampText', () => {
  it('mantém strings curtas', () => {
    expect(clampText('ABC', 5)).toBe('ABC');
  });
  it('corta strings longas', () => {
    expect(clampText('A'.repeat(10_000), 12)).toBe('A'.repeat(12));
  });
});
