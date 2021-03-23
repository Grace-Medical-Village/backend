import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { checkIso8601Format, getParameter } from './utils/request';
import { headers } from './utils/response';
import { Query, ResponseBody } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  let name = getParameter(event, 'name', false);
  const birthdate = getParameter(event, 'birthdate', false);

  let text = 'select * from patient;';
  const patientSearchStatementBase = 'select id, first_name, last_name, birthdate, gender, mobile from patient';

  if (name && typeof name === 'string') {
    name = name.trim().toLowerCase();
    if (name.indexOf(' ') === -1) {
      text = `${patientSearchStatementBase} where lower(first_name) like '%${name}%' or lower(last_name) like '%${name}%';`;
    } else {
      const fullName = name.split(' ');
      text = `${patientSearchStatementBase} where lower(first_name) like '%${fullName[0]}%' or lower(last_name) like '%${fullName[0]}%' or lower(first_name) like '%${fullName[1]}% or lower(last_name) like '%${fullName[1]}%'';`;
    }
  } else if (birthdate && typeof birthdate === 'string' && checkIso8601Format(birthdate)) {
    text = `${patientSearchStatementBase} where birthdate = '${birthdate}';`;
  }

  const query: Query = {
    name: 'get-patients',
    text,
  };

  const { rows } = await client.query(query);

  await client.end();

  const body: ResponseBody = {
    data: rows,
  };

  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  };

  return response;
};
