import { Headers, Response, ResponseStatus } from './types';

export const headers: Headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const status: ResponseStatus = {
  statusCode: 200,
  statusText: 'OK',
};

export const responseBase: Response = {
  ...status,
  headers,
  body: '{}',
};
