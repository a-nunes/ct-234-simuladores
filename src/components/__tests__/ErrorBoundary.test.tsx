import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

const Boom = () => {
  throw new Error('falha de teste');
};

describe('ErrorBoundary', () => {
  it('renderiza os filhos quando não há erro', () => {
    render(<ErrorBoundary><p>conteúdo</p></ErrorBoundary>);
    expect(screen.getByText('conteúdo')).toBeInTheDocument();
  });

  it('mostra a tela de recuperação em vez de desmontar a aplicação', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado');
    expect(screen.getByRole('button', { name: 'Recarregar' })).toBeInTheDocument();
    expect(screen.queryByText('falha de teste')).not.toBeInTheDocument();
    spy.mockRestore();
  });
});
