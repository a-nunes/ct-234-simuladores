export class InvalidArrayError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArrayError';
    Object.setPrototypeOf(this, InvalidArrayError.prototype);
  }
}

export class InvalidSearchValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSearchValueError';
    Object.setPrototypeOf(this, InvalidSearchValueError.prototype);
  }
}

