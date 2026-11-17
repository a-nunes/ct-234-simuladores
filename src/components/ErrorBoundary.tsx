import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Impede que um erro de renderização em um simulador desmonte a aplicação
 * inteira (tela em branco). Mostra uma mensagem e permite recarregar.
 * Não exibe detalhes do erro ao usuário; eles vão apenas para o console.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('Erro inesperado no simulador:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div role="alert" className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Algo deu errado</h1>
          <p className="text-slate-600 mb-6">
            O simulador encontrou uma entrada que não consegue processar. Recarregue a página para continuar.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
