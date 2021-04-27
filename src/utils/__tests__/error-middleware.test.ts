import { buildErrorResponseBody, errorMiddleware } from '../error-middleware';
import createHttpError from 'http-errors';
import { NextFunction, Request, Response } from 'express';

describe('buildErrorResponseBody', () => {
  it('returns the full error response outside of production', () => {
    expect.assertions(5);

    process.env.NODE_ENV = 'test';
    const err = createHttpError(400, 'Bad Request');
    const errorResponseBody = buildErrorResponseBody(err);
    expect(errorResponseBody).toHaveProperty('status');
    expect(errorResponseBody.status).toStrictEqual(400);
    expect(errorResponseBody).toHaveProperty('message');
    expect(errorResponseBody.message).toStrictEqual('Bad Request');
    expect(errorResponseBody).toHaveProperty('stack');
  });

  it('excludes the stack if environment is production', () => {
    expect.assertions(5);
    process.env.NODE_ENV = 'production';
    const err = createHttpError(404, 'Not Found');
    const errorResponseBody = buildErrorResponseBody(err);

    expect(errorResponseBody).toHaveProperty('status');
    expect(errorResponseBody.status).toStrictEqual(404);
    expect(errorResponseBody).toHaveProperty('message');
    expect(errorResponseBody.message).toStrictEqual('Not Found');
    expect(errorResponseBody).not.toHaveProperty('stack');
  });
});

describe('errorMiddleware', () => {
  it('handles errors', () => {
    expect.assertions(5);

    const err = createHttpError(500, 'Error');
    const req = {} as Request;
    const res = ({
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    } as unknown) as Response;
    const next = jest.fn() as NextFunction;
    errorMiddleware(err, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(buildErrorResponseBody(err));
  });
});
