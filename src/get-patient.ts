import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getParameter } from './utils/request';
import { headers } from './utils/response';
import { Query } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();
  const id = getParameter(event, 'id');

  const queryText = `
    select id,
           first_name,
           last_name,
           first_name || ' ' || last_name full_name,
           birthdate,
           gender,
           email,
           height,
           mobile,
           map,
           country,
           native_language,
           native_literacy,
           smoker
    from patient
    where id = $1;
    `;

  const query: Query = {
    name: 'get-patient',
    text: queryText,
    values: [id],
  };

  const { rows } = await client.query(query);

  await client.end();

  const body = rows.length > 0 ? rows[0] : {};

  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  };

  return response;
};
