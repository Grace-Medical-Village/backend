import { Handler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { Query } from './utils/types';

export const main: Handler = async (_event, _context, callback) => {
  const client = clientBuilder();
  await client.connect();

  const query: Query = {
    name: 'get-conditions',
    text: 'select id, condition_name from condition;',
  };

  const { rows }: any = await client.query(query);

  await client.end();

  const response = rows.length > 0 ? rows : [];
  callback(null, response);
};
