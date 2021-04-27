import { Headers, Response, ResponseStatus, ResponseData } from '../src/types';

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

export const buildResponse = (data: ResponseData): Response => {
  return {
    ...responseBase,
    body: JSON.stringify(data),
  };
};
