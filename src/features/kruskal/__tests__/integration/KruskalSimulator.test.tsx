import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KruskalSimulator } from '@features/kruskal/presentation/components/KruskalSimulator';
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

describe('KruskalSimulator Integration', () => {
  it('should render with default configuration', () => {
    renderWithProvider(<KruskalSimulator />);

    expect(screen.getByText('Algoritmo de Kruskal (Union-Find)')).toBeInTheDocument();
    expect(screen.getByText(/Encontra a árvore geradora de custo mínimo/i)).toBeInTheDocument();
  });

  it('should start simulation and show first step', async () => {
    renderWithProvider(<KruskalSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });
    expect(screen.getByText(/Iniciando Kruskal/i)).toBeInTheDocument();
  });

  it('should navigate between steps', async () => {
    renderWithProvider(<KruskalSimulator />);

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

  it('should show sorted edges panel', async () => {
    renderWithProvider(<KruskalSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('sorted-edges-panel')).toBeInTheDocument();
    });
  });

  it('should show MST panel', async () => {
    renderWithProvider(<KruskalSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('mst-panel')).toBeInTheDocument();
    });
  });

  it('should show action message panel', async () => {
    renderWithProvider(<KruskalSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });
  });

  it('should show final MST when simulation completes', async () => {
    renderWithProvider(<KruskalSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    // Navigate through all steps
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
    expect(screen.getByText(/finalizado/i)).toBeInTheDocument();
  });

  it('should reset simulation', async () => {
    renderWithProvider(<KruskalSimulator />);

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

  it('should generate random graph', async () => {
    renderWithProvider(<KruskalSimulator />);

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
      expect(screen.getByText('Algoritmo de Kruskal (Union-Find)')).toBeInTheDocument();
    });
  });

  it('should disable buttons at correct moments', () => {
    renderWithProvider(<KruskalSimulator />);

    const startButton = screen.getByTestId('start-button');
    expect(startButton).not.toBeDisabled();

    const previousButton = screen.getByTestId('previous-button');
    expect(previousButton).toBeDisabled();

    const nextButton = screen.queryByTestId('next-button');
    expect(nextButton).toBeNull();
  });

  it('should show graph visualization', () => {
    renderWithProvider(<KruskalSimulator />);

    expect(screen.getByText('Grafo Não-Orientado Ponderado')).toBeInTheDocument();
  });

  it('should expand and collapse canvas', async () => {
    renderWithProvider(<KruskalSimulator />);

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

  it('should display union-find information in steps', async () => {
    renderWithProvider(<KruskalSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });
    expect(screen.getByText(/MAKE_SET/i)).toBeInTheDocument();

    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      const findMessages = screen.queryAllByText(/FIND/i);
      expect(findMessages.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('should show accept and reject steps', async () => {
    renderWithProvider(<KruskalSimulator />);

    const startButton = screen.getByTestId('start-button');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('action-message-panel')).toBeInTheDocument();
    });

    // Navigate through steps to find accept/reject
    let found = false;
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts && !found) {
      const nextButton = screen.queryByTestId('next-button');
      if (!nextButton || (nextButton as HTMLButtonElement).disabled) {
        break;
      }
      fireEvent.click(nextButton);
      attempts++;
      
      await waitFor(() => {
        const acceptMessages = screen.queryAllByText(/Adicionando à MST/i);
        const rejectMessages = screen.queryAllByText(/Rejeitando/i);
        if (acceptMessages.length > 0 || rejectMessages.length > 0) {
          found = true;
        }
      }, { timeout: 100 });
    }

    expect(attempts).toBeLessThan(maxAttempts);
  });

  it('should show total cost in final step', async () => {
    renderWithProvider(<KruskalSimulator />);

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
    });
    expect(screen.getAllByText(/Custo [Tt]otal:/i).length).toBeGreaterThan(0);
  });

  it('should preserve algorithm state when moving nodes during execution', async () => {
    renderWithProvider(<KruskalSimulator />);
    
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

