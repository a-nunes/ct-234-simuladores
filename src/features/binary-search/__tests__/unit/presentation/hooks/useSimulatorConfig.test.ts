import { renderHook, act } from '@testing-library/react';
import { useSimulatorConfig } from '@features/binary-search/presentation/hooks/useSimulatorConfig';

// Mock alert
global.alert = jest.fn();

describe('useSimulatorConfig', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    expect(result.current.array.length).toBeGreaterThan(0);
    expect(result.current.searchValue).toBe(23);
    expect(result.current.isRunning).toBe(false);
  });

  it('should initialize with custom values', () => {
    const { result } = renderHook(() =>
      useSimulatorConfig({
        initialArray: [1, 2, 3],
        initialSearchValue: 2
      })
    );

    expect(result.current.array).toEqual([1, 2, 3]);
    expect(result.current.searchValue).toBe(2);
    expect(result.current.customArray).toBe('1,2,3');
    expect(result.current.customSearch).toBe('2');
  });

  it('should update customArray', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setCustomArray('1,2,3,4,5');
    });

    expect(result.current.customArray).toBe('1,2,3,4,5');
  });

  it('should update customSearch', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setCustomSearch('10');
    });

    expect(result.current.customSearch).toBe('10');
  });

  it('should apply custom config with valid input', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setCustomArray('1,2,3,4,5');
      result.current.setCustomSearch('3');
    });

    act(() => {
      result.current.applyCustomConfig();
    });

    expect(result.current.array).toEqual([1, 2, 3, 4, 5]);
    expect(result.current.searchValue).toBe(3);
    expect(result.current.isRunning).toBe(false);
  });

  it('should sort array when applying custom config', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setCustomArray('5,2,8,1,3');
      result.current.setCustomSearch('3');
    });

    act(() => {
      result.current.applyCustomConfig();
    });

    expect(result.current.array).toEqual([1, 2, 3, 5, 8]);
  });

  it('should show alert for invalid array', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setCustomArray('abc,def');
      result.current.setCustomSearch('5');
    });

    act(() => {
      result.current.applyCustomConfig();
    });

    expect(global.alert).toHaveBeenCalled();
  });

  it('should show alert for invalid search value', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setCustomArray('1,2,3');
      result.current.setCustomSearch('abc');
    });

    act(() => {
      result.current.applyCustomConfig();
    });

    expect(global.alert).toHaveBeenCalled();
  });

  it('should set isRunning state', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setIsRunning(true);
    });

    expect(result.current.isRunning).toBe(true);
  });
});

