export class InvalidGraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidGraphError';
    Object.setPrototypeOf(this, InvalidGraphError.prototype);
  }
}

