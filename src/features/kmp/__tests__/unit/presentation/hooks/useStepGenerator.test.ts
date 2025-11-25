import { renderHook, act } from '@testing-library/react';
import { useStepGenerator } from '@features/kmp/presentation/hooks/useStepGenerator';

describe('useStepGenerator', () => {
  const validConfig = {
    text: 'abacaabaccabacabaabb',
    pattern: 'abacab'
  };

  it('should initialize with empty steps', () => {
    const { result } = renderHook(() =>
      useStepGenerator({ config: validConfig })
    );

    expect(result.current.steps).toEqual([]);
    expect(result.current.failureTable).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerated).toBe(false);
  });

  it('should generate steps for valid config', () => {
    const { result } = renderHook(() =>
      useStepGenerator({ config: validConfig })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.failureTable.length).toBe(validConfig.pattern.length);
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerated).toBe(true);
  });

  it('should set error for invalid config (empty text)', () => {
    const invalidConfig = { text: '', pattern: 'abc' };
    const { result } = renderHook(() =>
      useStepGenerator({ config: invalidConfig })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.steps).toEqual([]);
    expect(result.current.isGenerated).toBe(false);
  });

  it('should set error for invalid config (empty pattern)', () => {
    const invalidConfig = { text: 'some text', pattern: '' };
    const { result } = renderHook(() =>
      useStepGenerator({ config: invalidConfig })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.steps).toEqual([]);
    expect(result.current.isGenerated).toBe(false);
  });

  it('should set error for invalid config (pattern longer than text)', () => {
    const invalidConfig = { text: 'hi', pattern: 'hello' };
    const { result } = renderHook(() =>
      useStepGenerator({ config: invalidConfig })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.steps).toEqual([]);
    expect(result.current.isGenerated).toBe(false);
  });

  it('should clear steps', () => {
    const { result } = renderHook(() =>
      useStepGenerator({ config: validConfig })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(0);

    act(() => {
      result.current.clearSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.failureTable).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerated).toBe(false);
  });

  it('should generate correct failure table', () => {
    const { result } = renderHook(() =>
      useStepGenerator({ config: validConfig })
    );

    act(() => {
      result.current.generateSteps();
    });

    // Expected failure table for "abacab": [0, 0, 1, 0, 1, 2]
    expect(result.current.failureTable).toEqual([0, 0, 1, 0, 1, 2]);
  });

  it('should clear error when generating steps succeeds after failure', () => {
    const { result, rerender } = renderHook(
      ({ config }) => useStepGenerator({ config }),
      { initialProps: { config: { text: '', pattern: 'abc' } } }
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).not.toBeNull();

    rerender({ config: validConfig });

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isGenerated).toBe(true);
  });
});
