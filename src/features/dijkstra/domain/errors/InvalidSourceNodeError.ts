export class InvalidSourceNodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSourceNodeError';
    Object.setPrototypeOf(this, InvalidSourceNodeError.prototype);
  }
}

