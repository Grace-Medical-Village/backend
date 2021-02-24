import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getRequestBodyValue } from './utils/request';
import { responseBase } from './utils/response';
import { Query, Response } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  console.log(event.body);
  const patientId = getRequestBodyValue(event, 'patientId');
  const metricId = getRequestBodyValue(event, 'metricId');
  const value = getRequestBodyValue(event, 'value');

  const query: Query = {
    name: 'post-patient-metric',
    text: 'insert into patient_metric (patient_id, metric_id, value) values ($1, $2, $3);',
    values: [patientId, metricId, value],
  };

  await client.query(query);

  await client.end();

  const response: Response = {
    ...responseBase,
    statusCode: 201,
  };

  return response;
};
