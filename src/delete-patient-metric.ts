import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getParameter } from './utils/request';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();
  const id = getParameter(event, 'id');

  const query: Query = {
    name: 'delete-patient-metric',
    text: 'delete from patient_metric where id = $1;',
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
