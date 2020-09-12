import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';

interface Options {
  region?: string;
  endpoint?: string;
}

let options: Options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event: APIGatewayEvent, _context: Context, callback: Callback): void => {
  let response;
  const data: any = JSON.parse(event?.body ?? '{}');

  if (Object.entries(data).length === 0) {
    response = {
      statusCode: 400,
      body: {
        error: 'Error',
        message: 'Patient data is empty',
      },
    };
    throw new Error(JSON.stringify(response));
  }
  console.log(data);

  const params = {
    TableName: process.env.DYNAMODB_TABLE ?? 'patients',
    Item: data,
  };

  dynamoDb.put(params, (error: AWSError, result: PutItemOutput) => {
    if (error) {
      console.error(error);

      response = {
        statusCode: error.statusCode || 400,
        headers: { 'Content-Type': 'text/plain' },
        body: `Error: Couldn't put the data ${JSON.stringify(data)}`,
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
