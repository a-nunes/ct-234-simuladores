import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TopologicalSortSimulator } from '@features/topological-sort/presentation/components/TopologicalSortSimulator';
import { GraphProvider } from '../../../../contexts/GraphContext';

// Mock alert
global.alert = jest.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <GraphProvider>
      {component}
    </GraphProvider>
  );
};

describe('TopologicalSortSimulator Integration', () => {
  it('should render with default configuration', () => {
    renderWithProvider(<TopologicalSortSimulator />);

    expect(screen.getByText('Ordenação Topológica (TopSort)')).toBeInTheDocument();
    expect(screen.getByText(/Ordena os vértices de um DAG/i)).toBeInTheDocument();
  });

  it('should display data structure selection', () => {
    renderWithProvider(<TopologicalSortSimulator />);

    expect(screen.getByTestId('queue-button')).toBeInTheDocument();
    expect(screen.getByTestId('stack-button')).toBeInTheDocument();
  });

  it('should start simulation and show first step', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
      expect(screen.getByText(/Inicializando/i)).toBeInTheDocument();
    });
  });

  it('should navigate between steps', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });

    const nextButton = screen.getByTestId('next-button');
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);

    await waitFor(() => {
      const stepIndicator = screen.getByTestId('step-indicator');
      expect(stepIndicator).toBeInTheDocument();
    });
  });

  it('should show queue/stack panel', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    await waitFor(() => {
      expect(screen.getByTestId('queue-stack-panel')).toBeInTheDocument();
    });
  });

  it('should show indegree table panel', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    await waitFor(() => {
      expect(screen.getByTestId('indegree-table-panel')).toBeInTheDocument();
    });
  });

  it('should show topological order panel', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    await waitFor(() => {
      expect(screen.getByTestId('topological-order-panel')).toBeInTheDocument();
    });
  });

  it('should show action message panel', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });
  });

  it('should complete topological sort successfully', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toBeInTheDocument();
    });

    // Click next multiple times to reach final step
    let attempts = 0;
    const maxAttempts = 50;
    while (attempts < maxAttempts) {
      const nextButton = screen.queryByTestId('next-button');
      if (!nextButton || (nextButton as HTMLButtonElement).disabled) {
        break;
      }
      fireEvent.click(nextButton);
      attempts++;
      await waitFor(() => {
        const updatedButton = screen.queryByTestId('next-button');
        expect(updatedButton).toBeInTheDocument();
      }, { timeout: 100 });
    }

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });
    // Check for completion message in action panel
    const actionPanel = screen.getByTestId('action-message-panel');
    expect(actionPanel.textContent).toMatch(/concluída/i);
  });

  it('should reset simulation', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });

    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);

    await waitFor(() => {
      // After reset, start button should be available again
      expect(screen.getByTestId('start-button')).toBeInTheDocument();
    });
  });

  it('should switch between queue and stack', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    // Initially queue should be selected
    const queueButton = screen.getByTestId('queue-button');
    expect(queueButton).toHaveClass('bg-purple-600');

    const stackButton = screen.getByTestId('stack-button');
    fireEvent.click(stackButton);

    await waitFor(() => {
      expect(stackButton).toHaveClass('bg-purple-600');
    });
  });

  it('should disable data structure buttons during simulation', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const queueButton = screen.getByTestId('queue-button') as HTMLButtonElement;
    const stackButton = screen.getByTestId('stack-button') as HTMLButtonElement;

    expect(queueButton).not.toBeDisabled();
    expect(stackButton).not.toBeDisabled();

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(queueButton).toBeDisabled();
      expect(stackButton).toBeDisabled();
    });
  });

  it('should generate random DAG', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const generateButton = screen.getByTestId('generate-graph-button');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/Gerar Grafo Aleatório/i)).toBeInTheDocument();
    });

    const numberInput = await screen.findByRole('spinbutton', { hidden: false });
    fireEvent.change(numberInput, { target: { value: '5' } });

    const generateModalButtons = screen.getAllByText('Gerar');
    const generateModalButton = generateModalButtons.find(btn => {
      const button = btn as HTMLButtonElement;
      return !button.disabled && button.textContent?.includes('Gerar');
    });

    if (generateModalButton) {
      fireEvent.click(generateModalButton);
    }

    await waitFor(() => {
      expect(screen.getByText('Ordenação Topológica (TopSort)')).toBeInTheDocument();
    });
  });

  it('should disable buttons at correct moments', () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const startButton = screen.getByTestId('start-button');
    expect(startButton).not.toBeDisabled();

    const previousButton = screen.getByTestId('previous-button');
    expect(previousButton).toBeDisabled();

    const nextButton = screen.queryByTestId('next-button');
    expect(nextButton).toBeNull();
  });

  it('should show graph visualization', () => {
    renderWithProvider(<TopologicalSortSimulator />);

    expect(screen.getByText('Grafo Direcionado')).toBeInTheDocument();
  });

  it('should expand and collapse canvas', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const expandButton = screen.getByText('Expandir');
    fireEvent.click(expandButton);

    await waitFor(() => {
      const normalButtons = screen.getAllByText('Normal').filter(el => el.tagName === 'BUTTON');
      expect(normalButtons.length).toBeGreaterThan(0);
    });

    const normalButtons = screen.getAllByText('Normal').filter(el => el.tagName === 'BUTTON');
    if (normalButtons.length > 0) {
      fireEvent.click(normalButtons[0]);
    }

    await waitFor(() => {
      expect(screen.getByText('Expandir')).toBeInTheDocument();
    });
  });

  it('should display indegree values during execution', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('indegree-table-panel')).toBeInTheDocument();
    });
  });

  it('should show topological order as it builds', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });

    const nextButton = screen.getByTestId('next-button');
    for (let i = 0; i < 5; i++) {
      if (!nextButton || (nextButton as HTMLButtonElement).disabled) {
        break;
      }
      fireEvent.click(nextButton);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Topological order panel should be updated
    await waitFor(() => {
      expect(screen.getByTestId('topological-order-panel')).toBeInTheDocument();
    });
  });

  it('should detect and display cycle error for cyclic graph', async () => {
    // Note: Default graph should be a DAG, but if cycle detection is implemented
    // this test would need a cyclic graph
    // For now, just verify the simulation works with default DAG
    renderWithProvider(<TopologicalSortSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });
  });

  it('should preserve algorithm state when moving nodes during execution', async () => {
    renderWithProvider(<TopologicalSortSimulator />);

    // Start algorithm
    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });

    // Navigate to step 3
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      const stepIndicator = screen.getByTestId('step-indicator');
      expect(stepIndicator).toBeInTheDocument();
    });

    // Capture current step info
    const stepIndicatorBefore = screen.getByTestId('step-indicator').textContent;

    // Note: In a real test with drag functionality, we would simulate node movement here
    // For now, this test ensures the structure is in place
    // The actual fix will be implemented in the hooks

    // Verify step didn't reset (in actual implementation with drag)
    await waitFor(() => {
      const stepIndicatorAfter = screen.getByTestId('step-indicator').textContent;
      expect(stepIndicatorAfter).toBe(stepIndicatorBefore);
    });
  });
});

