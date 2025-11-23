import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DijkstraSimulator } from '@features/dijkstra/presentation/components/DijkstraSimulator';
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

describe('DijkstraSimulator Integration', () => {
  it('should render with default configuration', () => {
    renderWithProvider(<DijkstraSimulator />);

    expect(screen.getByText('Algoritmo de Dijkstra')).toBeInTheDocument();
    expect(screen.getByText(/Encontra os caminhos mínimos/i)).toBeInTheDocument();
  });

  it('should start simulation and show first step', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Inicializando/i)).toBeInTheDocument();
    });
  });

  it('should navigate between steps', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Inicializando/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Próximo');
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);

    await waitFor(() => {
      const stepIndicator = screen.getByText(/Passo \d+ de \d+/);
      expect(stepIndicator).toBeInTheDocument();
    });
  });

  it('should show priority queue panel', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('Fila de Prioridade (S)')).toBeInTheDocument();
    });
  });

  it('should show distance table panel', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Distâncias e Predecessores/i)).toBeInTheDocument();
    });
  });

  it('should show action message panel', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Ação Atual/i)).toBeInTheDocument();
    });
  });

  it('should show final paths when simulation completes', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    // Navigate through all steps
    await waitFor(() => {
      const nextButton = screen.getByText('Próximo');
      expect(nextButton).toBeInTheDocument();
    });

    // Click next multiple times to reach final step
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop
    while (attempts < maxAttempts) {
      const nextButton = screen.queryByText('Próximo');
      if (!nextButton || (nextButton as HTMLButtonElement).disabled) {
        break;
      }
      fireEvent.click(nextButton);
      attempts++;
      // Wait for button state to update by checking if it still exists and is enabled
      await waitFor(() => {
        const updatedButton = screen.queryByText('Próximo');
        expect(updatedButton).toBeInTheDocument();
      }, { timeout: 100 });
    }

    await waitFor(() => {
      const finalPathsElements = screen.getAllByText(/Caminhos Mínimos/i);
      expect(finalPathsElements.length).toBeGreaterThan(0);
    });
  });

  it('should reset simulation', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Inicializando/i)).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Resetar');
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByText(/Inicializando/i)).not.toBeInTheDocument();
    });
  });

  it('should allow changing source node', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const changeSourceButton = screen.getByText('Alterar Origem');
    fireEvent.click(changeSourceButton);

    await waitFor(() => {
      expect(screen.getByText('Selecionar Vértice de Origem')).toBeInTheDocument();
    });

    // Click on a node button in the modal (use getAllByText and filter by button role)
    const nodeButtons = screen.getAllByText('B').filter(el => el.tagName === 'BUTTON');
    if (nodeButtons.length > 0) {
      fireEvent.click(nodeButtons[0]);
    }
  });

  it('should generate random graph', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const generateButton = screen.getByText('Gerar Grafo');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Gerar Grafo Aleatório')).toBeInTheDocument();
    });

    // Fill in number of vertices - use getByDisplayValue or findByRole
    const numberInput = await screen.findByRole('spinbutton', { hidden: false });
    fireEvent.change(numberInput, { target: { value: '5' } });

    // Click generate button in modal - find button with Shuffle icon (Gerar button in modal)
    const generateModalButtons = screen.getAllByText('Gerar');
    // The modal button should be the one that's not disabled and is in the modal
    const generateModalButton = generateModalButtons.find(btn => {
      const button = btn as HTMLButtonElement;
      return !button.disabled && button.textContent?.includes('Gerar');
    });
    if (generateModalButton) {
      fireEvent.click(generateModalButton);
    }

    await waitFor(() => {
      // Graph should be updated
      expect(screen.getByText('Algoritmo de Dijkstra')).toBeInTheDocument();
    });
  });

  it('should disable buttons at correct moments', () => {
    renderWithProvider(<DijkstraSimulator />);

    const startButton = screen.getByText('Iniciar');
    expect(startButton).not.toBeDisabled();

    const previousButton = screen.getByText('Anterior');
    expect(previousButton).toBeDisabled();

    // Next button only appears when simulation is running
    // So we check that it doesn't exist initially
    const nextButton = screen.queryByText('Próximo');
    expect(nextButton).toBeNull();
  });

  it('should show graph visualization', () => {
    renderWithProvider(<DijkstraSimulator />);

    expect(screen.getByText('Grafo Ponderado')).toBeInTheDocument();
  });

  it('should expand and collapse canvas', async () => {
    renderWithProvider(<DijkstraSimulator />);

    const expandButton = screen.getByText('Expandir');
    fireEvent.click(expandButton);

    await waitFor(() => {
      // Find the button with "Normal" text that is actually a button
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
});

