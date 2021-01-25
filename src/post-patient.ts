import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { buildValsFromKeys, getRequestBodyKeys, getRequestBodyValues } from './utils/request';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const keys = getRequestBodyKeys(event);
  const values = getRequestBodyValues(event);
  const v = buildValsFromKeys(keys);

  const queryText = `insert into patient (${[...keys]}) values (${[...v]})`;

  const query: Query = {
    name: 'post-patient',
    text: queryText,
    values: [...values],
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
