import React from 'react';
import { render, screen } from '@testing-library/react';
import { SortingLayout } from '../ui/SortingLayout';
import { SortingStep } from '../types';

const sampleStep: SortingStep = {
  array: [5, 3, 1],
  message: 'Comparando 5 e 3',
  pseudocodeLine: 2,
  comparing: [0, 1]
};

const pseudocode = {
  title: 'Bubble Sort',
  lines: ['procedure bubble()', 'if a > b then swap']
};

const complexity = {
  best: 'O(n)',
  average: 'O(n²)',
  worst: 'O(n²)',
  space: 'O(1)'
};

describe('SortingLayout', () => {
  it('renders title, array strip and highlights pseudocode line', () => {
    render(
      <SortingLayout
        title="Demo Sort"
        description="testing layout"
        baseArray={[5, 3, 1]}
        step={sampleStep}
        stepIndex={0}
        totalSteps={3}
        isPlaying={false}
        speedMs={800}
        pseudocode={pseudocode}
        complexity={complexity}
        onPlayPause={() => {}}
        onReset={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
        onStepChange={() => {}}
        onSpeedChange={() => {}}
      />
    );

    expect(screen.getByRole('heading', { name: 'Demo Sort' })).toBeInTheDocument();

    const narration = screen.getByTestId('sorting-narration-message');
    expect(narration).toHaveTextContent(sampleStep.message ?? '');

    const activePseudocodeLine = screen.getByTestId('pseudocode-line-2');
    expect(activePseudocodeLine).toHaveAttribute('data-active', 'true');
  });
});

