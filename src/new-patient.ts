import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';

interface Options {
  region?: string;
  endpoint?: string;
}

interface Patient {
  birthdate: string;
  country: string;
  firstName: string;
  gender: string;
  hispanic: string;
  language: string;
  lastName: string;
  zipCode5: string;
}

interface Item extends Patient {
  id: string;
  key: string;
  createdAt: number;
}
let options: Options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}
console.log(options);

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event: APIGatewayEvent, context: Context, callback: Callback): void => {
  let response;
  const patient: Patient = JSON.parse(event?.body ?? '{}');
  console.log(context);

  if (Object.entries(patient).length === 0) {
    response = {
      statusCode: 400,
      body: {
        error: 'Error',
        message: 'Patient data is empty',
      },
    };
    throw new Error(JSON.stringify(response));
  }

  /**
   * TODO's
   * Testing
   * Birthdate Regex Validation
   * First Name Regex Validation
   * Last Name Regex Validation
   */
  const birthdate = patient?.birthdate;
  const firstName = patient?.firstName.toLowerCase().trim();
  const lastName = patient?.lastName.toLowerCase().trim();

  const id = `${lastName}${firstName}${birthdate}`;
  const createdAt = new Date().getTime();

  const item: Item = {
    id,
    key: 'general',
    birthdate,
    country,
    firstName,
    gender,
    hispanic,
    language,
    lastName,
    zipCode5,
    createdAt,
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE ?? 'patients',
    Item: item,
  };

  dynamoDb.put(params, (error: AWSError, result: PutItemOutput) => {
    if (error) {
      console.error(error);

      response = {
        statusCode: error.statusCode || 400,
        headers: { 'Content-Type': 'text/plain' },
        body: `Error: Couldn't put the patient ${firstName} ${lastName} with ID: ${id}`,
      };
      return;
    }

    response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};
