import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { buildSetStatment, getRequestBodyValue } from './utils/request';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const id = getRequestBodyValue(event, 'id');
  const setStatement = buildSetStatment(event, ['id']);

  const queryText = `update patient set ${[...setStatement]} where id = $1`;

  const query: Query = {
    name: 'put-patient',
    text: queryText,
    values: [id],
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
