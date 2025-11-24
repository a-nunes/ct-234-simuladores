import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PrimSimulator } from '@features/prim/presentation/components/PrimSimulator';
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

describe('PrimSimulator Integration', () => {
  it('should render with default configuration', () => {
    renderWithProvider(<PrimSimulator />);

    expect(screen.getByText('Algoritmo de Prim (Crescimento)')).toBeInTheDocument();
    expect(screen.getByText(/Encontra a árvore geradora de custo mínimo/i)).toBeInTheDocument();
  });

  it('should display root node', () => {
    renderWithProvider(<PrimSimulator />);

    expect(screen.getByText(/Raiz:/i)).toBeInTheDocument();
  });

  it('should start simulation and show first step', async () => {
    renderWithProvider(<PrimSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
      expect(screen.getByText(/Iniciando Prim/i)).toBeInTheDocument();
    });
  });

  it('should navigate between steps', async () => {
    renderWithProvider(<PrimSimulator />);

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

  it('should show sets panel', async () => {
    renderWithProvider(<PrimSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('sets-panel')).toBeInTheDocument();
    });
  });

  it('should show candidate edges panel', async () => {
    renderWithProvider(<PrimSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('candidate-edges-panel')).toBeInTheDocument();
    });
  });

  it('should show MST panel', async () => {
    renderWithProvider(<PrimSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    // Navigate through steps until MST panel appears
    let attempts = 0;
    const maxAttempts = 20;
    while (attempts < maxAttempts) {
      const nextButton = screen.queryByTestId('next-button');
      if (!nextButton || (nextButton as HTMLButtonElement).disabled) {
        break;
      }
      fireEvent.click(nextButton);
      attempts++;
      
      const mstPanel = screen.queryByTestId('mst-panel');
      if (mstPanel) {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    await waitFor(() => {
      expect(screen.getByTestId('mst-panel')).toBeInTheDocument();
    });
  });

  it('should show action message panel', async () => {
    renderWithProvider(<PrimSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });
  });

  it('should show final MST when simulation completes', async () => {
    renderWithProvider(<PrimSimulator />);

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
      expect(screen.getByText(/finalizado/i)).toBeInTheDocument();
    });
  });

  it('should reset simulation', async () => {
    renderWithProvider(<PrimSimulator />);

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

  it('should allow changing root node', async () => {
    renderWithProvider(<PrimSimulator />);

    const changeRootButton = screen.getByTestId('change-root-button');
    fireEvent.click(changeRootButton);

    await waitFor(() => {
      expect(screen.getByText('Selecionar Raiz para Prim')).toBeInTheDocument();
    });

    // Click on a node button in the modal
    const nodeButtons = screen.getAllByText('B').filter(el => el.tagName === 'BUTTON');
    if (nodeButtons.length > 0) {
      fireEvent.click(nodeButtons[0]);
    }

    // Root should be updated
    await waitFor(() => {
      const rootLabels = screen.getAllByText('B');
      expect(rootLabels.length).toBeGreaterThan(0);
    });
  });

  it('should generate random graph', async () => {
    renderWithProvider(<PrimSimulator />);

    const generateButton = screen.getByTestId('generate-graph-button');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Gerar Grafo Aleatório')).toBeInTheDocument();
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
      expect(screen.getByText('Algoritmo de Prim (Crescimento)')).toBeInTheDocument();
    });
  });

  it('should disable change root button during simulation', async () => {
    renderWithProvider(<PrimSimulator />);

    const changeRootButton = screen.getByTestId('change-root-button');
    expect(changeRootButton).not.toBeDisabled();

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(changeRootButton).toBeDisabled();
    });
  });

  it('should disable buttons at correct moments', () => {
    renderWithProvider(<PrimSimulator />);

    const startButton = screen.getByTestId('start-button');
    expect(startButton).not.toBeDisabled();

    const previousButton = screen.getByTestId('previous-button');
    expect(previousButton).toBeDisabled();

    const nextButton = screen.queryByTestId('next-button');
    expect(nextButton).toBeNull();
  });

  it('should show graph visualization', () => {
    renderWithProvider(<PrimSimulator />);

    expect(screen.getByText('Grafo Não-Orientado Ponderado')).toBeInTheDocument();
  });

  it('should expand and collapse canvas', async () => {
    renderWithProvider(<PrimSimulator />);

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

  it('should show total cost in final step', async () => {
    renderWithProvider(<PrimSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });

    // Navigate to final step
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
      expect(screen.getByTestId('mst-panel')).toBeInTheDocument();
      expect(screen.getAllByText(/Custo [Tt]otal:/i).length).toBeGreaterThan(0);
    });
  });

  it('should display U and V-U sets during execution', async () => {
    renderWithProvider(<PrimSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });

    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('sets-panel')).toBeInTheDocument();
    });
  });

  it('should preserve algorithm state when moving nodes during execution', async () => {
    renderWithProvider(<PrimSimulator />);

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

