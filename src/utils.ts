import { Options } from './types';

const isLocal = (): boolean => process.env.STAGE === 'local' ?? false;

const localOptions: Options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
};

export const options: Options = isLocal() ? { ...localOptions } : {};

export const genericResponse = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
};
