import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getRequestBodyValue } from './utils/request';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const patientId = getRequestBodyValue(event, 'patient_id');
  const note = getRequestBodyValue(event, 'note');

  const query: Query = {
    name: 'post-patient-medication',
    text: 'insert into patient_medication (patient_id, note) values ($1, $2);',
    values: [patientId, note],
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
