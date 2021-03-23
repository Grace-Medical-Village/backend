import { Handler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { responseBase } from './utils/response';
import { Query, Response, ResponseBody } from './utils/types';

export const main: Handler = async () => {
  const client = clientBuilder();
  await client.connect();

  const query: Query = {
    name: 'get-conditions',
    text: 'select id, condition_name from condition;',
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
