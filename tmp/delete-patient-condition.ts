import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getParameter } from './utils/request';
import { responseBase } from './utils/response';
import { Query, Response } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const patientId = getParameter(event, 'patientId', true);
  const conditionId = getParameter(event, 'conditionId', true);

  const query: Query = {
    name: 'delete-patient-condition',
    text:
      'delete from patient_condition where patient_id = $1 and condition_id = $2;',
    values: [patientId, conditionId],
  };

  await client.query(query);

  await client.end();

  const response: Response = {
    ...responseBase,
    statusCode: 200,
  };

  return response;
};
