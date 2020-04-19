export class InvalidArgumentError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class AssertError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
