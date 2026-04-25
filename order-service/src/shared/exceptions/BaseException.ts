export abstract class BaseException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}
