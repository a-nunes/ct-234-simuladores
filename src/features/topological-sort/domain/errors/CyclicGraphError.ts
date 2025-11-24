export class CyclicGraphError extends Error {
  constructor(message: string = 'O grafo contém ciclos. Ordenação topológica não é possível.') {
    super(message);
    this.name = 'CyclicGraphError';
    Object.setPrototypeOf(this, CyclicGraphError.prototype);
  }
}

