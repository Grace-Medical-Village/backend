import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';

interface Options {
  region?: string;
  endpoint?: string;
}

interface Patient {
  birthdate: string;
  firstName: string;
  lastName: string;
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

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event: APIGatewayEvent, context: Context, callback: Callback): void => {
  const patient: Patient = JSON.parse(event?.body ?? '{}');

  if (Object.entries(patient).length === 0) {
    callback(
      JSON.stringify({
        error: 'Error',
        detail: 'Patient data is empty',
      })
    );
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
    lastName,
    firstName,
    birthdate,
    createdAt,
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE ?? 'patients',
    Item: item,
  };

  dynamoDb.put(params, (error: AWSError, result: PutItemOutput) => {
    let response;
    if (error) {
      console.error(error);

      response = {
        statusCode: error.statusCode || 400,
        headers: { 'Content-Type': 'text/plain' },
        body: `Error: Couldn't put the patient ${firstName} ${lastName} with ID: ${id}`,
      };
      callback(null, response);
      return;
    }

    response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
  console.log(context.getRemainingTimeInMillis()); // TODO CLEAN
};
