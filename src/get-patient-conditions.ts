import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getParameter } from './utils/request';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();
  const patientId = getParameter(event, 'patient_id');

  const query: Query = {
    name: 'get-patient-conditions',
    text: 'select * from patient_condition where patient_id = $1;',
    values: [patientId],
  };

  const { rows } = await client.query(query);

  await client.end();

  const body = rows.length > 0 ? rows : [];

  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  };

  return response;
};
