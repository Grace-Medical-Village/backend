import { Handler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: Handler = async () => {
  const client = clientBuilder();
  await client.connect();

  const query: Query = {
    name: 'get-conditions',
    text: 'select id, condition_name from condition;',
  };

  const { rows }: any = await client.query(query);

  await client.end();

  const body = rows.length > 0 ? rows : [];

  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  };

  return response;
};
