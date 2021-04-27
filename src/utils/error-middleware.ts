import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

type ErrorResponseBody = {
  status: number;
  message: string;
  stack?: string;
};

export function errorMiddleware(
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(err.status);
  const errorResponseBody = buildErrorResponseBody(err);
  res.json(errorResponseBody);
}

export function buildErrorResponseBody(err: HttpError): ErrorResponseBody {
  const errorResponseBody: ErrorResponseBody = {
    status: err.status,
    message: err.message,
  };

  if (process.env.NODE_ENV !== 'production')
    errorResponseBody.stack = err.stack;

  return errorResponseBody;
}
