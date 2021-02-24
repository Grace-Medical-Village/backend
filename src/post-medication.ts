import { APIGatewayProxyHandler } from 'aws-lambda';
import { buildValues, clientBuilder } from './utils/db';
import { getRequestBodyValue } from './utils/request';
import { responseBase } from './utils/response';
import { Query, Response } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  // TODO Error Handling
  // - Missing categoryId
  // - Type categoryId
  // - Missing name
  // - Type name
  // - Type strength

  const categoryId = getRequestBodyValue(event, 'categoryId');
  const name = getRequestBodyValue(event, 'name');
  const strength = getRequestBodyValue(event, 'strength');
  let categories = 'category_id, name';
  const values = [categoryId, name];

  if (strength) {
    values.push(strength);
    categories += ', strength';
  }

  const v = buildValues(values);
  const text = `insert into medication (${categories}) values (${v});`;

  const query: Query = {
    name: 'post-medication',
    text,
    values,
  };

  await client.query(query);

  await client.end();

  const response: Response = {
    ...responseBase,
    statusCode: 201,
  };

  return response;
};
