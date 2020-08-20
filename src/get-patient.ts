import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb';

interface Options {
  region?: string;
  endpoint?: string;
}

interface Item {
  id: string;
  key: string;
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
  let response;
  const id: string = event?.queryStringParameters?.id ?? '';
  console.log(id);

  const item = {
    id,
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE ?? 'patients',
    Key: item,
  };

  dynamoDb.get(params, (error: AWSError, result: GetItemOutput) => {
    if (error) {
      console.error(error);
      response = {
        statusCode: error.statusCode || 400,
        headers: { 'Content-Type': 'text/plain' },
        body: "Error: Couldn't get the new patient",
      };
      callback(error, response);
    }

    response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
