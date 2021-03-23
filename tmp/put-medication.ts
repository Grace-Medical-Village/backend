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
  const id = getRequestBodyValue(event, 'id');

  const query: Query = {
    name: 'put-medication',
    text: 'update medication set category_id = $1, name = $2, strength = $3 where id = $4;',
    values: [categoryId, name, strength, id],
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
