export class InvalidLCSStringError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidLCSStringError';
    Object.setPrototypeOf(this, InvalidLCSStringError.prototype);
  }
}


