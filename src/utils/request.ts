import {
  BuildSetStatement,
  BuildValsFromKeys,
  GetRequestBodyKeys,
  GetRequestBodyValue,
  GetRequestBodyValues,
  GetParameter,
  Value,
} from './types';

export const buildSetStatment: BuildSetStatement = (event, o) => {
  const statement: string[] = [];

  Object.entries(JSON.parse(event.body)).forEach((entry) => {
    const k = entry[0];
    const v = entry[1];
    if (!o.includes(k)) {
      typeof v === 'string' ? statement.push(`${k} = '${v}'`) : statement.push(`${k} = ${v}`);
    }
  });

  return statement;
};

export const buildValsFromKeys: BuildValsFromKeys = (keys) => keys.map((_, index) => `$${index + 1}`);

export const getParameter: GetParameter = (event, key) => {
  const value: Value = event?.queryStringParameters[key] ?? null;

  if (!value) throw Error(`'${key}' is a required query parameter`);

  return value;
};

export const getRequestBodyKeys: GetRequestBodyKeys = (event) => Object.keys(JSON.parse(event.body));

export const getRequestBodyValue: GetRequestBodyValue = (event, key) => {
  const body = JSON.parse(event?.body);

  const value: Value = body[key] ?? null;

  if (!value) throw Error(`'${key}' is required in the request body`);

  return value;
};

export const getRequestBodyValues: GetRequestBodyValues = (event) => Object.values(JSON.parse(event.body));
