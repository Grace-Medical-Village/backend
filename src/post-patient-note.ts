import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getRequestBodyValue } from './utils/request';
import { responseBase } from './utils/response';
import { Query, Response } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const patientId = getRequestBodyValue(event, 'patientId');
  const note = getRequestBodyValue(event, 'note');

  const query: Query = {
    name: 'post-patient-note',
    text: 'insert into patient_note (patient_id, note) values ($1, $2);',
    values: [patientId, note],
  };

  await client.query(query);

  await client.end();

  const response: Response = {
    ...responseBase,
    statusCode: 201,
  };

  return response;
};
