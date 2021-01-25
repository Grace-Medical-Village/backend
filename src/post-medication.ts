import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getRequestBodyValue } from './utils/request';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const categoryId = getRequestBodyValue(event, 'category_id');
  const name = getRequestBodyValue(event, 'name');
  const strength = getRequestBodyValue(event, 'strength');

  const query: Query = {
    name: 'post-medication',
    text: 'insert into medication (category_id, name, strength) values ($1, $2, $3);',
    values: [categoryId, name, strength],
  };

  await client.query(query);

  await client.end();

  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify({}),
  };

  return response;
};
