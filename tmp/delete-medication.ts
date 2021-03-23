import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getParameter } from './utils/request';
import { responseBase } from './utils/response';
import { DeleteResponseBody, Query, Response } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();
  const id = getParameter(event, 'id', true);

  const query: Query = {
    name: 'delete-medication',
    text: 'delete from medication where id = $1;',
    values: [id],
  };

  const { rowCount } = await client.query(query);

  await client.end();

  const body: DeleteResponseBody = { data: {} };

  if (rowCount === 0) {
    const message = `Error: Medication record does not exist for id ${id}`;
    body.error = {
      code: 600,
      message,
    };
  }

  const response: Response = {
    ...responseBase,
  };

  console.log(response);
  return response;
};
