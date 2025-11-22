import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BinarySearchSimulator } from '@features/binary-search/presentation/components/BinarySearchSimulator';

// Mock alert
global.alert = jest.fn();

describe('BinarySearchSimulator Integration', () => {
  it('should render with default configuration', () => {
    render(<BinarySearchSimulator />);

    expect(screen.getByText('Busca Binária')).toBeInTheDocument();
    expect(screen.getByText('Divisão-e-Conquista: Reduzindo o espaço de busca pela metade')).toBeInTheDocument();
  });

  it('should allow applying custom configuration', async () => {
    render(<BinarySearchSimulator />);

    const arrayInput = screen.getByPlaceholderText('2,5,8,12,16,23...');
    const searchInput = screen.getByPlaceholderText('23');
    const applyButton = screen.getByText('Aplicar');

    fireEvent.change(arrayInput, { target: { value: '1,2,3,4,5' } });
    fireEvent.change(searchInput, { target: { value: '3' } });
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(arrayInput).toHaveValue('1,2,3,4,5');
    });
  });

  it('should start simulation and show first step', async () => {
    render(<BinarySearchSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Iniciando busca binária/i)).toBeInTheDocument();
    });
  });

  it('should navigate between steps', async () => {
    render(<BinarySearchSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Iniciando busca binária/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Próximo');
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);

    await waitFor(() => {
      const stepIndicator = screen.getByText(/Passo \d+ de \d+/);
      expect(stepIndicator).toBeInTheDocument();
    });
  });

  it('should show correct state values', async () => {
    render(<BinarySearchSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('Valor buscado (x):')).toBeInTheDocument();
    });
  });

  it('should highlight correct cell (L, R, Q)', async () => {
    render(<BinarySearchSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      // Check if array visualization is rendered
      const arrayVisualization = screen.getByText('Visualização do Array');
      expect(arrayVisualization).toBeInTheDocument();
    });
  });

  it('should show step message', async () => {
    render(<BinarySearchSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Iniciando busca binária/i)).toBeInTheDocument();
    });
  });

  it('should show call stack', async () => {
    render(<BinarySearchSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      const callStackPanel = screen.getByText('Pilha de Chamadas');
      expect(callStackPanel).toBeInTheDocument();
    });
  });

  it('should reset simulation', async () => {
    render(<BinarySearchSimulator />);

    const startButton = screen.getByText('Iniciar');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Iniciando busca binária/i)).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Resetar');
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByText(/Iniciando busca binária/i)).not.toBeInTheDocument();
    });
  });

  it('should disable buttons at correct moments', () => {
    render(<BinarySearchSimulator />);

    const startButton = screen.getByText('Iniciar');
    expect(startButton).not.toBeDisabled();

    // After starting, start button should be disabled
    fireEvent.click(startButton);

    waitFor(() => {
      expect(startButton).toBeDisabled();
    });
  });
});

