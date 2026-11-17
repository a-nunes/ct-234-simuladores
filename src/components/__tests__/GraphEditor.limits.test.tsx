import { fireEvent, render, screen } from '@testing-library/react';
import GraphEditor, { MAX_GRAPH_NODES, MAX_LABEL_LENGTH, MAX_GRAPH_TEXT_LENGTH } from '../GraphEditor';

const openTextEditor = () => {
  const onGraphChange = vi.fn();
  render(<GraphEditor onGraphChange={onGraphChange} />);
  fireEvent.click(screen.getByRole('button', { name: /Editor de Texto/ }));
  return { onGraphChange, textarea: screen.getByRole('textbox') as HTMLTextAreaElement };
};

const generate = (textarea: HTMLTextAreaElement, text: string) => {
  fireEvent.change(textarea, { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar Grafo' }));
};

const lastGraph = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls[fn.mock.calls.length - 1][0];

describe('GraphEditor — limites do editor de texto', () => {
  it('aceita um grafo pequeno válido', () => {
    const { onGraphChange, textarea } = openTextEditor();
    generate(textarea, 'A -> B, C\nB -> C');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(lastGraph(onGraphChange).nodes).toHaveLength(3);
  });

  it(`rejeita mais de ${MAX_GRAPH_NODES} vértices sem alterar o grafo`, () => {
    const { onGraphChange, textarea } = openTextEditor();
    const labels = Array.from({ length: MAX_GRAPH_NODES + 1 }, (_, i) => `V${i}`);
    generate(textarea, labels.join('\n'));
    expect(screen.getByRole('alert')).toHaveTextContent(`no máximo ${MAX_GRAPH_NODES} vértices`);
    expect(lastGraph(onGraphChange).nodes).toHaveLength(0);
  });

  it('rejeita rótulos longos demais', () => {
    const { textarea } = openTextEditor();
    generate(textarea, `${'X'.repeat(MAX_LABEL_LENGTH + 1)} -> B`);
    expect(screen.getByRole('alert')).toHaveTextContent('Rótulo inválido');
  });

  it('trata nomes de propriedades do protótipo como rótulos comuns (Map, sem poluição)', () => {
    const { onGraphChange, textarea } = openTextEditor();
    generate(textarea, 'toString -> valueOf, B');
    expect(lastGraph(onGraphChange).nodes.map((n: { label: string }) => n.label)).toEqual(['toString', 'valueOf', 'B']);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('corta texto colado acima do limite', () => {
    const { textarea } = openTextEditor();
    fireEvent.change(textarea, { target: { value: 'A\n'.repeat(MAX_GRAPH_TEXT_LENGTH) } });
    expect(textarea.value.length).toBeLessThanOrEqual(MAX_GRAPH_TEXT_LENGTH);
  });
});
