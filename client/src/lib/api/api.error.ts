export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
  }
}
