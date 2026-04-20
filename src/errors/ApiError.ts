export class ApiError<T = unknown> extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly description: string;
  public readonly details?: T;

  constructor(
    status: number,
    code: string,
    description: string,
    details?: T
  ) {
    super(description);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.description = description;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}