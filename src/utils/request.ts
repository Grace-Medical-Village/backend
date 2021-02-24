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

const iso8601Regex = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/);

export const buildValsFromKeys: BuildValsFromKeys = (keys) => keys.map((_, index) => `$${index + 1}`);

export const checkIso8601Format = (date: string): boolean => iso8601Regex.test(date);

export const getParameter: GetParameter = (event, key, required) => {
  let value: Value = null;
  if (event.queryStringParameters !== null) value = event?.queryStringParameters[key] ?? null;

  if (required && !value) console.error(`'${key}' is a required parameter`);

  return value;
};

export const getRequestBodyKeys: GetRequestBodyKeys = (event) => Object.keys(JSON.parse(event.body));

export const getRequestBodyValue: GetRequestBodyValue = (event, key) => {
  const body = JSON.parse(event?.body);

  const value: Value = body[key] ?? null;

  if (!value) console.error(`'${key}' is required in the request body`);

  return value;
};

// TODO
// export const getRequestBodyString: GetRequestBodyString = (event, key, required) => {
//   const value: Value = getRequestBodyValue(event, key);
//   if (typeof value !== 'string') throw Error('TODO');
//   if (required && value.length() === 0) return;
//   return value.trim();
// };

// export const getRequestBodyNumber: string = (event, key) => {
//   const value: Value = getRequestBodyValue(event, key);

//   if (typeof value !== 'string') throw Error('TODO');
//   return value;
// };

export const getRequestBodyValues: GetRequestBodyValues = (event) => Object.values(JSON.parse(event.body));
