export class InvalidArrayError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArrayError';
  }
}
