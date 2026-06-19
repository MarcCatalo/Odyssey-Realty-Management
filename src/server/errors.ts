export class AppError extends Error {
  constructor(
    message: string,
    public readonly status = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function getErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status
    };
  }

  return {
    message: "The request could not be completed.",
    status: 500
  };
}
