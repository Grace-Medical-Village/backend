import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getRequestBodyValue } from './utils/request';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const patientId = getRequestBodyValue(event, 'patientId');
  const conditionId = getRequestBodyValue(event, 'conditionId');

  const query: Query = {
    name: 'post-patient-condition',
    text:
      'insert into patient_condition (patient_id, condition_id) values ($1, $2);',
    values: [patientId, conditionId],
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
