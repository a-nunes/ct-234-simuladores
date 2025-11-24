export class InvalidRootNodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRootNodeError';
    Object.setPrototypeOf(this, InvalidRootNodeError.prototype);
  }
}

