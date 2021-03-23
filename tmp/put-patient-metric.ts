import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getRequestBodyValue } from './utils/request';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const id = getRequestBodyValue(event, 'id');
  const value = getRequestBodyValue(event, 'value');

  const query: Query = {
    name: 'put-patient-metric',
    text: 'update patient_metric set value = $1 where id = $2;',
    values: [value, id],
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
