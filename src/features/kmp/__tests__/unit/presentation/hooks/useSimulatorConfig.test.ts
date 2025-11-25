import { renderHook, act } from '@testing-library/react';
import { useSimulatorConfig } from '@features/kmp/presentation/hooks/useSimulatorConfig';

describe('useSimulatorConfig', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSimulatorConfig());

    expect(result.current.text).toBe('abacaabaccabacabaabb');
    expect(result.current.pattern).toBe('abacab');
  });

  it('should initialize with custom values', () => {
    const { result } = renderHook(() =>
      useSimulatorConfig({
        initialText: 'custom text',
        initialPattern: 'custom'
      })
    );

    expect(result.current.text).toBe('custom text');
    expect(result.current.pattern).toBe('custom');
  });

  it('should update text', () => {
    const { result } = renderHook(() => useSimulatorConfig());

    act(() => {
      result.current.setText('new text');
    });

    expect(result.current.text).toBe('new text');
  });

  it('should update pattern', () => {
    const { result } = renderHook(() => useSimulatorConfig());

    act(() => {
      result.current.setPattern('new pattern');
    });

    expect(result.current.pattern).toBe('new pattern');
  });

  it('should apply config', () => {
    const { result } = renderHook(() => useSimulatorConfig());

    act(() => {
      result.current.applyConfig({
        text: 'applied text',
        pattern: 'applied'
      });
    });

    expect(result.current.text).toBe('applied text');
    expect(result.current.pattern).toBe('applied');
  });

  it('should reset to initial values', () => {
    const { result } = renderHook(() =>
      useSimulatorConfig({
        initialText: 'initial text',
        initialPattern: 'initial'
      })
    );

    act(() => {
      result.current.setText('modified');
      result.current.setPattern('modified pattern');
    });

    expect(result.current.text).toBe('modified');

    act(() => {
      result.current.reset();
    });

    expect(result.current.text).toBe('initial text');
    expect(result.current.pattern).toBe('initial');
  });

  it('should return config object', () => {
    const { result } = renderHook(() =>
      useSimulatorConfig({
        initialText: 'test text',
        initialPattern: 'test'
      })
    );

    expect(result.current.config).toEqual({
      text: 'test text',
      pattern: 'test'
    });
  });

  it('should update config object when text changes', () => {
    const { result } = renderHook(() => useSimulatorConfig());

    act(() => {
      result.current.setText('new text');
    });

    expect(result.current.config.text).toBe('new text');
  });

  it('should update config object when pattern changes', () => {
    const { result } = renderHook(() => useSimulatorConfig());

    act(() => {
      result.current.setPattern('new pattern');
    });

    expect(result.current.config.pattern).toBe('new pattern');
  });
});
