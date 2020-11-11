import { Options } from './types';

export const localOptions: Options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
};

export const genericResponse = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
};
