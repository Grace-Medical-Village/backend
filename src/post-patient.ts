import { APIGatewayProxyHandler } from 'aws-lambda';
import { snakeCase } from 'lodash';
import { clientBuilder } from './utils/db';
import { buildValsFromKeys, getRequestBodyKeys, getRequestBodyValues } from './utils/request';
import { responseBase } from './utils/response';
import { Query, Response, ResponseBody } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const keys = getRequestBodyKeys(event).map((k) => snakeCase(k).toLowerCase());
  const values = getRequestBodyValues(event);
  const v = buildValsFromKeys(keys);

  const queryText = `insert into patient (${[...keys]}) values (${[...v]}) returning id`;

  const query: Query = {
    name: 'post-patient',
    text: queryText,
    values: [...values],
  };

  const { rows } = await client.query(query);

  await client.end();

  const response: Response = {
    ...responseBase,
    statusCode: 400,
  };

  if (rows.length === 1) {
    const body: ResponseBody = { data: rows };
    response.statusCode = 201;
    response.body = JSON.stringify(body);
  }

  return response;
};
