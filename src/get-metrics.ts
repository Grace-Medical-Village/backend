import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { responseBase } from './utils/response';
import { Query, Response, ResponseBody } from './utils/types';

export const main: APIGatewayProxyHandler = async () => {
  const client = clientBuilder();
  await client.connect();

  const query: Query = {
    name: 'get-metrics',
    text: 'select * from metric;',
  };

  const { rows } = await client.query(query);

  await client.end();

  const body: ResponseBody = {
    data: rows,
  };

  const response: Response = {
    ...responseBase,
    body: JSON.stringify(body),
  };

  return response;
};
