export class RuntimeError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.path = opts.path;
  }
}
